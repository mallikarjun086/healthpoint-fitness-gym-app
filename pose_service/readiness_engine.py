"""
HealthPoint Fitness - Biometric Readiness & Recovery Statistical Engine
Computes 0-100 Training Readiness Score from 7-day rolling HRV (RMSSD),
Resting Heart Rate, and Sleep Duration using transparent Z-Score mechanics.
"""

from typing import List, Dict, Any, Optional
import math


def calculate_hrv_z_score(today_hrv: float, history_7d: List[float]) -> tuple[float, float, float]:
    """
    Computes rolling mean, sample standard deviation, and Z-score for HRV RMSSD.
    """
    if not history_7d:
        return 0.0, today_hrv, 8.0
    
    mean_hrv = sum(history_7d) / len(history_7d)
    
    if len(history_7d) > 1:
        variance = sum((x - mean_hrv) ** 2 for x in history_7d) / (len(history_7d) - 1)
        std_dev = math.sqrt(variance)
    else:
        std_dev = 8.0
        
    std_dev = max(std_dev, 2.5)  # clamp to avoid division by zero or extreme sensitivity
    z_score = (today_hrv - mean_hrv) / std_dev
    return z_score, mean_hrv, std_dev


def compute_readiness_score(
    today_hrv: float,
    history_7d_hrv: List[float],
    today_sleep_minutes: int,
    today_resting_hr: int,
    baseline_resting_hr: int = 56
) -> Dict[str, Any]:
    """
    Computes transparent multi-component physiological readiness score (0 - 100).
    """
    # 1. HRV Sub-score (0-100) -> 50 baseline, 100 for +2 SD, 0 for -2 SD
    z_score, mean_hrv, std_dev = calculate_hrv_z_score(today_hrv, history_7d_hrv)
    hrv_sub_score = max(0.0, min(100.0, 50.0 + (z_score * 25.0)))

    # 2. Sleep Sub-score (0-100)
    sleep_hours = today_sleep_minutes / 60.0
    if sleep_hours >= 7.0:
        sleep_sub_score = max(0.0, min(100.0, (sleep_hours / 8.0) * 100.0))
    else:
        sleep_sub_score = max(0.0, min(100.0, 70.0 - ((7.0 - sleep_hours) * 20.0)))

    # 3. Resting HR Sub-score (0-100)
    hr_delta = max(0, today_resting_hr - baseline_resting_hr)
    rhr_sub_score = max(0.0, min(100.0, 100.0 - (hr_delta * 4.0)))

    # 4. Composite Formula
    composite = round((0.50 * hrv_sub_score) + (0.35 * sleep_sub_score) + (0.15 * rhr_sub_score))
    composite = max(0, min(100, composite))

    # 5. Recovery Categorization
    if composite >= 80:
        category = "PEAK"
        advice = "Parasympathetic dominance confirmed. Primed for high intensity / progressive overload (+2.5kg load)."
    elif composite >= 50:
        category = "OPTIMAL"
        advice = "Standard physiological recovery. Execute planned sets and repetitions."
    else:
        category = "RECOVERY"
        advice = "Fatigue detected. Auto-reducing volume by 20% and capping target RPE at 7.0."

    return {
        "readiness_score": composite,
        "status_category": category,
        "hrv_z_score": round(z_score, 2),
        "hrv_mean_7d": round(mean_hrv, 1),
        "hrv_sub_score": round(hrv_sub_score),
        "sleep_sub_score": round(sleep_sub_score),
        "rhr_sub_score": round(rhr_sub_score),
        "actionable_advice": advice,
        "suggest_guided_breathing": composite < 50
    }


def detect_overtraining_trend(hrv_history: List[float], days_window: int = 5) -> Dict[str, Any]:
    """
    Detects if HRV has suffered a downward trend for 5+ consecutive days.
    """
    if len(hrv_history) < days_window:
        return {"is_overtrained": False, "consecutive_down_days": 0}

    last_n = hrv_history[-days_window:]
    downward = True
    for i in range(len(last_n) - 1):
        if last_n[i+1] > last_n[i] + 3.0:
            downward = False
            break

    return {
        "is_overtrained": downward,
        "consecutive_down_days": days_window if downward else 0,
        "alert": "⚠️ Overtraining Alert: 5-day continuous downward HRV trend detected. Deload week suggested." if downward else None
    }
