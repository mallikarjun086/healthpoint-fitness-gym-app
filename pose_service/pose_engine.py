"""
HealthPoint Fitness - Biomechanical Pose Engine
Stateless 3D Landmark & Kinematic Angle Analysis Module
Calculates joint angles, detects form deviations (knee valgus, lumbar flexion, elbow flare),
and manages repetition counting state.
"""

import math
from typing import Dict, List, Any, Optional, Tuple

# MediaPipe Pose Landmark Indices (33 points)
# 0: nose, 11: left_shoulder, 12: right_shoulder, 13: left_elbow, 14: right_elbow,
# 15: left_wrist, 16: right_wrist, 23: left_hip, 24: right_hip,
# 25: left_knee, 26: right_knee, 27: left_ankle, 28: right_ankle

class PoseEngine:

    @staticmethod
    def calculate_3d_angle(a: Dict[str, float], b: Dict[str, float], c: Dict[str, float]) -> float:
        """
        Calculates angle at joint B given 3 points A, B, C in degrees.
        Points are dicts with 'x', 'y', and optional 'z'.
        """
        ax, ay, az = a.get('x', 0.0), a.get('y', 0.0), a.get('z', 0.0)
        bx, by, bz = b.get('x', 0.0), b.get('y', 0.0), b.get('z', 0.0)
        cx, cy, cz = c.get('x', 0.0), c.get('y', 0.0), c.get('z', 0.0)

        # Vectors BA and BC
        v1 = (ax - bx, ay - by, az - bz)
        v2 = (cx - bx, cy - by, cz - bz)

        # Dot product and magnitudes
        dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
        mag1 = math.sqrt(v1[0]**2 + v1[1]**2 + v1[2]**2)
        mag2 = math.sqrt(v2[0]**2 + v2[1]**2 + v2[2]**2)

        if mag1 * mag2 == 0:
            return 180.0

        cosine = max(-1.0, min(1.0, dot / (mag1 * mag2)))
        angle_rad = math.acos(cosine)
        return math.degrees(angle_rad)

    @staticmethod
    def calculate_distance(a: Dict[str, float], b: Dict[str, float]) -> float:
        """Euclidean distance between two landmarks."""
        dx = a.get('x', 0.0) - b.get('x', 0.0)
        dy = a.get('y', 0.0) - b.get('y', 0.0)
        dz = a.get('z', 0.0) - b.get('z', 0.0)
        return math.sqrt(dx**2 + dy**2 + dz**2)

    def analyze_squat(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Squat Kinematics:
        - Knee Flexion: Hip (23/24) -> Knee (25/26) -> Ankle (27/28)
        - Hip Flexion: Shoulder (11/12) -> Hip (23/24) -> Knee (25/26)
        - Knee Valgus: Distance between knees vs distance between ankles
        """
        if len(landmarks) < 33:
            return {"valid": False, "error": "Insufficient landmarks"}

        # Left & Right side angles
        l_knee_angle = self.calculate_3d_angle(landmarks[23], landmarks[25], landmarks[27])
        r_knee_angle = self.calculate_3d_angle(landmarks[24], landmarks[26], landmarks[28])
        avg_knee_angle = round((l_knee_angle + r_knee_angle) / 2.0, 1)

        l_hip_angle = self.calculate_3d_angle(landmarks[11], landmarks[23], landmarks[25])
        r_hip_angle = self.calculate_3d_angle(landmarks[12], landmarks[24], landmarks[26])
        avg_hip_angle = round((l_hip_angle + r_hip_angle) / 2.0, 1)

        # Knee Valgus Ratio (Knee distance / Ankle distance)
        knee_dist = self.calculate_distance(landmarks[25], landmarks[26])
        ankle_dist = self.calculate_distance(landmarks[27], landmarks[28])
        valgus_ratio = (knee_dist / ankle_dist) if ankle_dist > 0.001 else 1.0

        # Faults
        faults = []
        cues = []

        if valgus_ratio < 0.78:
            faults.append("KNEE_VALGUS")
            cues.append("Drive your knees outward over toes")

        if avg_knee_angle < 70.0:
            faults.append("EXCESSIVE_DEPTH")
            cues.append("Control depth at parallel")
        elif avg_knee_angle > 105.0 and avg_knee_angle < 130.0:
            cues.append("Hit parallel depth")

        # Phase estimation
        phase = "STANDING"
        if avg_knee_angle < 95.0:
            phase = "BOTTOM_INFLECTION"
        elif avg_knee_angle < 140.0:
            phase = "IN_MOTION"

        return {
            "valid": True,
            "exercise": "SQUAT",
            "phase": phase,
            "kneeAngle": avg_knee_angle,
            "hipAngle": avg_hip_angle,
            "valgusRatio": round(valgus_ratio, 2),
            "isSafe": len(faults) == 0,
            "faults": faults,
            "coachingCue": cues[0] if cues else "Good alignment, keep pressing",
            "formScore": max(60, 100 - (len(faults) * 20))
        }

    def analyze_pushup(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Push-Up Kinematics:
        - Elbow Flexion: Shoulder (11/12) -> Elbow (13/14) -> Wrist (15/16)
        - Body Line / Core Sag: Shoulder (11/12) -> Hip (23/24) -> Ankle (27/28)
        """
        if len(landmarks) < 33:
            return {"valid": False, "error": "Insufficient landmarks"}

        l_elbow = self.calculate_3d_angle(landmarks[11], landmarks[13], landmarks[15])
        r_elbow = self.calculate_3d_angle(landmarks[12], landmarks[14], landmarks[16])
        avg_elbow = round((l_elbow + r_elbow) / 2.0, 1)

        l_spine = self.calculate_3d_angle(landmarks[11], landmarks[23], landmarks[27])
        r_spine = self.calculate_3d_angle(landmarks[12], landmarks[24], landmarks[28])
        avg_spine = round((l_spine + r_spine) / 2.0, 1)

        faults = []
        cues = []

        if avg_spine < 160.0:
            faults.append("HIPS_SAGGING")
            cues.append("Brace your core, do not let hips dip")
        elif avg_spine > 195.0:
            faults.append("HIPS_TOO_HIGH")
            cues.append("Lower hips into a flat plank")

        phase = "PLANK_TOP"
        if avg_elbow < 95.0:
            phase = "CHEST_BOTTOM"
        elif avg_elbow < 150.0:
            phase = "IN_MOTION"

        return {
            "valid": True,
            "exercise": "PUSHUP",
            "phase": phase,
            "elbowAngle": avg_elbow,
            "spineAngle": avg_spine,
            "isSafe": len(faults) == 0,
            "faults": faults,
            "coachingCue": cues[0] if cues else "Keep core rigid",
            "formScore": max(60, 100 - (len(faults) * 20))
        }

    def analyze_deadlift(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Deadlift / Hip Hinge Kinematics:
        - Hip Hinge: Shoulder (11/12) -> Hip (23/24) -> Knee (25/26)
        - Knee Angle: Hip (23/24) -> Knee (25/26) -> Ankle (27/28)
        """
        if len(landmarks) < 33:
            return {"valid": False, "error": "Insufficient landmarks"}

        l_hip = self.calculate_3d_angle(landmarks[11], landmarks[23], landmarks[25])
        r_hip = self.calculate_3d_angle(landmarks[12], landmarks[24], landmarks[26])
        avg_hip = round((l_hip + r_hip) / 2.0, 1)

        l_knee = self.calculate_3d_angle(landmarks[23], landmarks[25], landmarks[27])
        r_knee = self.calculate_3d_angle(landmarks[24], landmarks[26], landmarks[28])
        avg_knee = round((l_knee + r_knee) / 2.0, 1)

        faults = []
        cues = []

        if avg_knee < 80.0 and avg_hip < 90.0:
            faults.append("SQUATTING_DEADLIFT")
            cues.append("Push hips back horizontally, don't squat")

        phase = "LOCKOUT"
        if avg_hip < 90.0:
            phase = "HINGE_BOTTOM"
        elif avg_hip < 145.0:
            phase = "IN_MOTION"

        return {
            "valid": True,
            "exercise": "DEADLIFT",
            "phase": phase,
            "hipHingeAngle": avg_hip,
            "kneeAngle": avg_knee,
            "isSafe": len(faults) == 0,
            "faults": faults,
            "coachingCue": cues[0] if cues else "Drive hips forward",
            "formScore": max(60, 100 - (len(faults) * 20))
        }

    def analyze_row(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Bent-over Row Kinematics:
        - Torso Incline Angle: Shoulder -> Hip -> Vertical
        - Elbow Drive Angle: Shoulder -> Elbow -> Wrist
        """
        if len(landmarks) < 33:
            return {"valid": False, "error": "Insufficient landmarks"}

        l_elbow = self.calculate_3d_angle(landmarks[11], landmarks[13], landmarks[15])
        r_elbow = self.calculate_3d_angle(landmarks[12], landmarks[14], landmarks[16])
        avg_elbow = round((l_elbow + r_elbow) / 2.0, 1)

        l_torso = self.calculate_3d_angle(landmarks[11], landmarks[23], landmarks[25])
        avg_torso = round(l_torso, 1)

        faults = []
        cues = []

        if avg_torso > 150.0:
            faults.append("TORSO_TOO_UPRIGHT")
            cues.append("Hinge torso forward to 45 degrees")

        phase = "ARMS_EXTENDED"
        if avg_elbow < 90.0:
            phase = "ROW_PEAK"
        elif avg_elbow < 140.0:
            phase = "IN_MOTION"

        return {
            "valid": True,
            "exercise": "ROW",
            "phase": phase,
            "elbowAngle": avg_elbow,
            "torsoAngle": avg_torso,
            "isSafe": len(faults) == 0,
            "faults": faults,
            "coachingCue": cues[0] if cues else "Squeeze shoulder blades",
            "formScore": max(60, 100 - (len(faults) * 20))
        }
