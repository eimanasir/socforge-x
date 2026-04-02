import json
from app.config import DETECTION_PROFILES_PATH


def load_profiles():
    with open(DETECTION_PROFILES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def run_detection_engine(logs, profile_id="basic"):
    profiles = load_profiles()
    profile = next((p for p in profiles if p["id"] == profile_id), None)
    if not profile:
        raise ValueError(f"Detection profile {profile_id} not found")

    rules = profile["rules"]
    alerts = []

    for log in logs:
        raw = log.get("raw_log", {})
        alert = {
            "timestamp": log["timestamp"],
            "host": log["host"],
            "message": log["message"],
            "detected": False,
            "detection_name": "No rule matched",
            "severity": "N/A",
            "matched_technique_id": None
        }

        if raw.get("event_id") == 4625 and raw.get("failed_attempts", 0) >= rules["failed_login_threshold"]:
            alert["detected"] = True
            alert["detection_name"] = "Excessive Failed Login Detection"
            alert["severity"] = "High"
            alert["matched_technique_id"] = "T1110"

        elif (
            raw.get("process_name") == "powershell.exe"
            and rules["detect_encoded_powershell"]
            and any(sw in raw.get("command_line", "") for sw in rules["encoded_switches"])
        ):
            alert["detected"] = True
            alert["detection_name"] = "Encoded PowerShell Detection"
            alert["severity"] = "High"
            alert["matched_technique_id"] = "T1059.001"

        elif (
            raw.get("target_process") == "lsass.exe"
            and raw.get("process_name") in rules["lsass_tools"]
        ):
            alert["detected"] = True
            alert["detection_name"] = "LSASS Dump Attempt Detection"
            alert["severity"] = "Critical"
            alert["matched_technique_id"] = "T1003.001"

        alerts.append(alert)

    return alerts