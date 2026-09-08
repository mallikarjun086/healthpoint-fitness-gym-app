/**
 * HealthPoint Fitness - Client-Side 3D Landmark & Joint Kinematics Engine
 * Provides vector angle calculation, safe angle boundaries, biomechanical fault detection,
 * and peak/trough repetition oscillation state machines.
 */

// MediaPipe 33 Landmark Indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

// Skeletal Connection Pairs for Drawing
export const POSE_CONNECTIONS = [
  [11, 12], // Shoulders
  [11, 13], [13, 15], // Left Arm
  [12, 14], [14, 16], // Right Arm
  [11, 23], [12, 24], // Torso sides
  [23, 24], // Hips
  [23, 25], [25, 27], // Left Leg
  [24, 26], [26, 28], // Right Leg
  [27, 29], [29, 31], // Left Foot
  [28, 30], [30, 32], // Right Foot
];

/**
 * Calculates 3D angle at vertex point B between vectors BA and BC in degrees.
 */
export const calculateJointAngle = (a, b, c) => {
  if (!a || !b || !c) return 180;
  
  const ax = a.x ?? 0, ay = a.y ?? 0, az = a.z ?? 0;
  const bx = b.x ?? 0, by = b.y ?? 0, bz = b.z ?? 0;
  const cx = c.x ?? 0, cy = c.y ?? 0, cz = c.z ?? 0;

  const v1 = { x: ax - bx, y: ay - by, z: az - bz };
  const v2 = { x: cx - bx, y: cy - by, z: cz - bz };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 * mag2 === 0) return 180;

  const cosine = Math.max(-1.0, Math.min(1.0, dot / (mag1 * mag2)));
  return Math.round((Math.acos(cosine) * 180) / Math.PI);
};

/**
 * Euclidean distance between two landmarks
 */
export const calculateDistance = (a, b) => {
  if (!a || !b) return 0;
  const dx = (a.x ?? 0) - (b.x ?? 0);
  const dy = (a.y ?? 0) - (b.y ?? 0);
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Analyzes landmarks against exercise biomechanics
 */
export const analyzePoseFrame = (exerciseType, landmarks) => {
  if (!landmarks || landmarks.length < 33) {
    return {
      isValid: false,
      error: 'Stand back so your body is in full view of the camera',
      angles: {},
      faults: [],
      cue: 'Step into frame',
      formScore: 100
    };
  }

  const ex = (exerciseType || 'SQUAT').toUpperCase();
  const faults = [];
  let cue = '';
  let angles = {};
  let primaryAngle = 180;

  if (ex.includes('SQUAT')) {
    const lKnee = calculateJointAngle(landmarks[23], landmarks[25], landmarks[27]);
    const rKnee = calculateJointAngle(landmarks[24], landmarks[26], landmarks[28]);
    const kneeAvg = Math.round((lKnee + rKnee) / 2);

    const lHip = calculateJointAngle(landmarks[11], landmarks[23], landmarks[25]);
    const rHip = calculateJointAngle(landmarks[12], landmarks[24], landmarks[26]);
    const hipAvg = Math.round((lHip + rHip) / 2);

    // Knee Valgus Check (Knee distance vs Ankle distance)
    const kneeDist = calculateDistance(landmarks[25], landmarks[26]);
    const ankleDist = calculateDistance(landmarks[27], landmarks[28]);
    const valgusRatio = ankleDist > 0.05 ? kneeDist / ankleDist : 1.0;

    angles = {
      knee: kneeAvg,
      hip: hipAvg,
      valgusRatio: Math.round(valgusRatio * 100) / 100
    };
    primaryAngle = kneeAvg;

    if (valgusRatio < 0.78 && kneeAvg < 140) {
      faults.push({ type: 'KNEE_VALGUS', joint: 'knees', message: 'Knees caving in — Drive knees outward over toes' });
      cue = 'Drive your knees out!';
    } else if (kneeAvg < 65) {
      faults.push({ type: 'EXCESSIVE_DEPTH', joint: 'knees', message: 'Excessive depth — Control at parallel' });
      cue = 'Good depth, push up!';
    } else if (kneeAvg < 95) {
      cue = 'Great depth, drive through heels!';
    } else if (kneeAvg < 130) {
      cue = 'Hit parallel depth';
    } else {
      cue = 'Stand tall & brace core';
    }

  } else if (ex.includes('PUSH') || ex.includes('PRESS')) {
    const lElbow = calculateJointAngle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = calculateJointAngle(landmarks[12], landmarks[14], landmarks[16]);
    const elbowAvg = Math.round((lElbow + rElbow) / 2);

    const lSpine = calculateJointAngle(landmarks[11], landmarks[23], landmarks[27]);
    const rSpine = calculateJointAngle(landmarks[12], landmarks[24], landmarks[28]);
    const spineAvg = Math.round((lSpine + rSpine) / 2);

    angles = {
      elbow: elbowAvg,
      spine: spineAvg
    };
    primaryAngle = elbowAvg;

    if (spineAvg < 155) {
      faults.push({ type: 'HIPS_SAGGING', joint: 'hips', message: 'Hips dipping — Squeeze glutes and brace core' });
      cue = 'Brace your core, hips up!';
    } else if (elbowAvg < 90) {
      cue = 'Full chest depth, push the floor away!';
    } else if (elbowAvg > 155) {
      cue = 'Lower with 3-second control';
    } else {
      cue = 'Tuck elbows 45 degrees';
    }

  } else if (ex.includes('DEADLIFT') || ex.includes('HINGE') || ex.includes('RDL')) {
    const lHip = calculateJointAngle(landmarks[11], landmarks[23], landmarks[25]);
    const rHip = calculateJointAngle(landmarks[12], landmarks[24], landmarks[26]);
    const hipAvg = Math.round((lHip + rHip) / 2);

    const lKnee = calculateJointAngle(landmarks[23], landmarks[25], landmarks[27]);
    const rKnee = calculateJointAngle(landmarks[24], landmarks[26], landmarks[28]);
    const kneeAvg = Math.round((lKnee + rKnee) / 2);

    angles = {
      hipHinge: hipAvg,
      knee: kneeAvg
    };
    primaryAngle = hipAvg;

    if (kneeAvg < 75 && hipAvg < 95) {
      faults.push({ type: 'SQUATTING_DEADLIFT', joint: 'hips', message: 'Squatting the hinge — Push hips back horizontally' });
      cue = 'Hinge hips back, do not squat!';
    } else if (hipAvg < 90) {
      cue = 'Deep hamstring stretch, snap hips forward!';
    } else if (hipAvg > 155) {
      cue = 'Hinge at hips with flat back';
    } else {
      cue = 'Keep bar close to shins';
    }

  } else if (ex.includes('ROW')) {
    const lElbow = calculateJointAngle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = calculateJointAngle(landmarks[12], landmarks[14], landmarks[16]);
    const elbowAvg = Math.round((lElbow + rElbow) / 2);

    const lTorso = calculateJointAngle(landmarks[11], landmarks[23], landmarks[25]);

    angles = {
      elbow: elbowAvg,
      torso: lTorso
    };
    primaryAngle = elbowAvg;

    if (lTorso > 155) {
      faults.push({ type: 'TORSO_UPRIGHT', joint: 'torso', message: 'Torso too upright — Hinge forward to 45 degrees' });
      cue = 'Hinge torso forward to 45 degrees';
    } else if (elbowAvg < 85) {
      cue = 'Pinch shoulder blades tight at top!';
    } else {
      cue = 'Drive elbows back to pockets';
    }
  } else {
    // Default / Bicep Curl
    const lElbow = calculateJointAngle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = calculateJointAngle(landmarks[12], landmarks[14], landmarks[16]);
    const elbowAvg = Math.round((lElbow + rElbow) / 2);
    angles = { elbow: elbowAvg };
    primaryAngle = elbowAvg;
    if (elbowAvg < 60) {
      cue = 'Peak squeeze!';
    } else if (elbowAvg > 150) {
      cue = 'Full stretch, curl upward';
    } else {
      cue = 'Pin elbows stationary';
    }
  }

  const formScore = Math.max(50, 100 - faults.length * 20);

  return {
    isValid: true,
    exercise: ex,
    angles,
    primaryAngle,
    isSafe: faults.length === 0,
    faults,
    cue: cue || 'Good form, keep moving',
    formScore
  };
};

/**
 * Repetition Counter State Machine
 * Tracks joint oscillation peaks & troughs across rep phases:
 * 'EXTENDED' -> 'INFLECTION' (target depth) -> 'COMPLETED'
 */
export class RepCounterStateMachine {
  constructor(exerciseType = 'SQUAT') {
    this.exerciseType = exerciseType.toUpperCase();
    this.reps = 0;
    this.stage = 'EXTENDED'; // 'EXTENDED', 'DESCENDING', 'INFLECTION', 'ASCENDING'
    this.lowestAngle = 180;
    this.faultHistory = {};
    this.scores = [];
  }

  update(primaryAngle, currentFaults = [], formScore = 100) {
    let repIncremented = false;

    // Thresholds calibrated by movement archetype
    let extendedThreshold = 150;
    let inflectionThreshold = 95;

    if (this.exerciseType.includes('PUSH')) {
      extendedThreshold = 150;
      inflectionThreshold = 95;
    } else if (this.exerciseType.includes('DEADLIFT') || this.exerciseType.includes('HINGE')) {
      extendedThreshold = 155;
      inflectionThreshold = 90;
    } else if (this.exerciseType.includes('ROW') || this.exerciseType.includes('CURL')) {
      extendedThreshold = 145;
      inflectionThreshold = 75;
    }

    // State Transitions
    if (primaryAngle < this.lowestAngle) {
      this.lowestAngle = primaryAngle;
    }

    if (this.stage === 'EXTENDED' && primaryAngle < extendedThreshold - 15) {
      this.stage = 'DESCENDING';
    } else if (this.stage === 'DESCENDING' && primaryAngle <= inflectionThreshold) {
      this.stage = 'INFLECTION';
    } else if (this.stage === 'INFLECTION' && primaryAngle > inflectionThreshold + 20) {
      this.stage = 'ASCENDING';
    } else if (this.stage === 'ASCENDING' && primaryAngle >= extendedThreshold) {
      // Rep completed!
      this.reps += 1;
      this.stage = 'EXTENDED';
      this.lowestAngle = 180;
      repIncremented = true;
      this.scores.push(formScore);

      // Record any faults that occurred during this rep
      currentFaults.forEach(f => {
        this.faultHistory[f.type] = (this.faultHistory[f.type] || 0) + 1;
      });
    }

    return {
      reps: this.reps,
      stage: this.stage,
      repIncremented,
      averageScore: this.scores.length > 0 
        ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length) 
        : 100,
      faultSummary: this.faultHistory
    };
  }

  reset() {
    this.reps = 0;
    this.stage = 'EXTENDED';
    this.lowestAngle = 180;
    this.faultHistory = {};
    this.scores = [];
  }
}
