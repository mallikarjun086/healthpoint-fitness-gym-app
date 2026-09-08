"""
Unit tests for the HealthPoint Readiness Engine
"""

from readiness_engine import calculate_hrv_z_score, compute_readiness_score, detect_overtraining_trend


def test_readiness_engine():
    # 1. Peak recovery state
    history_peak = [75.0, 78.0, 80.0, 82.0, 81.0, 83.0, 85.0]
    res_peak = compute_readiness_score(
        today_hrv=92.0,
        history_7d_hrv=history_peak,
        today_sleep_minutes=500, # 8h 20m
        today_resting_hr=52,
        baseline_resting_hr=55
    )
    assert res_peak["readiness_score"] >= 80, f"Expected Peak readiness, got {res_peak}"
    assert res_peak["status_category"] == "PEAK"
    assert res_peak["hrv_z_score"] > 0

    # 2. Low recovery / fatigue state
    history_fatigue = [65.0, 64.0, 66.0, 65.0, 67.0, 65.0, 66.0]
    res_low = compute_readiness_score(
        today_hrv=36.0,
        history_7d_hrv=history_fatigue,
        today_sleep_minutes=310, # 5h 10m
        today_resting_hr=72,
        baseline_resting_hr=56
    )
    assert res_low["readiness_score"] < 50, f"Expected Low readiness, got {res_low}"
    assert res_low["status_category"] == "RECOVERY"
    assert res_low["suggest_guided_breathing"] is True

    # 3. 5-Day Overtraining downward trend
    downward_cascade = [78.0, 65.0, 52.0, 41.0, 32.0]
    overtrain_res = detect_overtraining_trend(downward_cascade, days_window=5)
    assert overtrain_res["is_overtrained"] is True, f"Expected overtraining detected, got {overtrain_res}"
    assert overtrain_res["consecutive_down_days"] == 5

    print("ALL READINESS ENGINE TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    test_readiness_engine()
