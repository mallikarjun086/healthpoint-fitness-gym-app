"""
HealthPoint Fitness - Pose Analysis Microservice (FastAPI)
Stateless service dedicated to processing kinematic pose landmarks and frames.
Spring Boot remains the system of record.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
from pose_engine import PoseEngine
from readiness_engine import compute_readiness_score, detect_overtraining_trend

app = FastAPI(
    title="HealthPoint Kinematics & Biometric Readiness Microservice",
    description="Stateless computer vision, kinematics, and physiological readiness analysis API",
    version="1.0.0"
)

# Enable CORS for React frontend (:5173 / :5174 / :3000) and Spring Boot (:8085)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PoseEngine()

class ReadinessRequest(BaseModel):
    todayHrv: float
    history7dHrv: List[float]
    todaySleepMinutes: int
    todayRestingHr: int
    baselineRestingHr: Optional[int] = 56

@app.post("/api/readiness/calculate")
def calculate_readiness(payload: ReadinessRequest):
    readiness = compute_readiness_score(
        today_hrv=payload.todayHrv,
        history_7d_hrv=payload.history7dHrv,
        today_sleep_minutes=payload.todaySleepMinutes,
        today_resting_hr=payload.todayRestingHr,
        baseline_resting_hr=payload.baselineRestingHr or 56
    )
    overtraining = detect_overtraining_trend(payload.history7dHrv + [payload.todayHrv], days_window=5)
    readiness["overtraining_analysis"] = overtraining
    return readiness

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0
    visibility: Optional[float] = 1.0

class LandmarkAnalysisRequest(BaseModel):
    exercise: str = Field(..., description="Exercise name e.g. SQUAT, PUSHUP, DEADLIFT, ROW")
    landmarks: List[Dict[str, float]] = Field(..., description="33 MediaPipe pose landmarks")
    userWeightKg: Optional[float] = 75.0
    targetReps: Optional[int] = 10

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "healthpoint-pose-microservice",
        "supportedExercises": ["SQUAT", "PUSHUP", "DEADLIFT", "ROW", "OVERHEAD_PRESS", "BICEP_CURL"],
        "framework": "FastAPI + MediaPipe 33-Landmark Vector Engine"
    }

@app.post("/api/pose/analyze-landmarks")
def analyze_landmarks(payload: LandmarkAnalysisRequest):
    exercise = payload.exercise.upper().replace("-", "_").replace(" ", "_")
    landmarks = payload.landmarks

    if len(landmarks) < 33:
        raise HTTPException(status_code=400, detail="Expected 33 MediaPipe pose landmarks")

    if "SQUAT" in exercise:
        return engine.analyze_squat(landmarks)
    elif "PUSH" in exercise and "UP" in exercise:
        return engine.analyze_pushup(landmarks)
    elif "DEADLIFT" in exercise or "HINGE" in exercise or "RDL" in exercise:
        return engine.analyze_deadlift(landmarks)
    elif "ROW" in exercise:
        return engine.analyze_row(landmarks)
    else:
        # Generic squat/hinge analysis fallback
        return engine.analyze_squat(landmarks)

@app.get("/api/pose/rules/{exercise}")
def get_exercise_rules(exercise: str):
    ex = exercise.upper()
    rules = {
        "SQUAT": {
            "primaryJoint": "Knee & Hip",
            "safeKneeRange": [70, 130],
            "valgusThreshold": 0.78,
            "cues": ["Drive knees out", "Chest tall", "Hit parallel depth"]
        },
        "PUSHUP": {
            "primaryJoint": "Elbow & Spine",
            "safeElbowRange": [45, 95],
            "safeSpineRange": [160, 195],
            "cues": ["Tuck elbows 45°", "Rigid plank", "Full chest depth"]
        },
        "DEADLIFT": {
            "primaryJoint": "Hip Hinge",
            "safeHipRange": [45, 90],
            "cues": ["Hinge hips back", "Flat spine", "Drive heels into floor"]
        },
        "ROW": {
            "primaryJoint": "Elbow & Torso",
            "safeTorsoAngle": [35, 60],
            "cues": ["Hinge to 45°", "Pinch shoulder blades", "Quiet lower back"]
        }
    }
    return rules.get(ex, rules["SQUAT"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8086)
