"""
Unit test script for PoseEngine kinematics calculations
"""
from pose_engine import PoseEngine

def test_3d_angle_calculation():
    engine = PoseEngine()
    # 90-degree right angle (0,1,0) -> (0,0,0) -> (1,0,0)
    a = {"x": 0.0, "y": 1.0, "z": 0.0}
    b = {"x": 0.0, "y": 0.0, "z": 0.0}
    c = {"x": 1.0, "y": 0.0, "z": 0.0}
    angle = engine.calculate_3d_angle(a, b, c)
    assert abs(angle - 90.0) < 0.001, f"Expected 90.0, got {angle}"

    # 180-degree straight line (-1,0,0) -> (0,0,0) -> (1,0,0)
    a2 = {"x": -1.0, "y": 0.0, "z": 0.0}
    angle2 = engine.calculate_3d_angle(a2, b, c)
    assert abs(angle2 - 180.0) < 0.001, f"Expected 180.0, got {angle2}"

def test_squat_analysis():
    engine = PoseEngine()
    landmarks = [{"x": 0.0, "y": 0.0, "z": 0.0} for _ in range(33)]
    # Setup standing squat pose
    # Left: Hip (23) at (0.4, 0.5), Knee (25) at (0.4, 0.75), Ankle (27) at (0.4, 1.0)
    landmarks[23] = {"x": 0.4, "y": 0.5, "z": 0.0}
    landmarks[25] = {"x": 0.4, "y": 0.75, "z": 0.0}
    landmarks[27] = {"x": 0.4, "y": 1.0, "z": 0.0}
    # Right: Hip (24) at (0.6, 0.5), Knee (26) at (0.6, 0.75), Ankle (28) at (0.6, 1.0)
    landmarks[24] = {"x": 0.6, "y": 0.5, "z": 0.0}
    landmarks[26] = {"x": 0.6, "y": 0.75, "z": 0.0}
    landmarks[28] = {"x": 0.6, "y": 1.0, "z": 0.0}
    # Shoulders
    landmarks[11] = {"x": 0.4, "y": 0.2, "z": 0.0}
    landmarks[12] = {"x": 0.6, "y": 0.2, "z": 0.0}

    result = engine.analyze_squat(landmarks)
    assert result["valid"] is True
    assert result["kneeAngle"] == 180.0
    assert result["isSafe"] is True

    # Test Knee Valgus condition (knees cave inward: knee distance 0.1 vs ankle distance 0.2)
    landmarks[25] = {"x": 0.45, "y": 0.75, "z": 0.0}
    landmarks[26] = {"x": 0.55, "y": 0.75, "z": 0.0}
    valgus_res = engine.analyze_squat(landmarks)
    assert "KNEE_VALGUS" in valgus_res["faults"]
    assert "knees" in valgus_res["coachingCue"].lower()

if __name__ == "__main__":
    test_3d_angle_calculation()
    test_squat_analysis()
    print("ALL POSE ENGINE TESTS PASSED SUCCESSFULLY!")
