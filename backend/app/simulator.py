import json
from datetime import datetime, timedelta
from app.config import SCENARIOS_PATH


def load_scenarios():
    with open(SCENARIOS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def simulate_scenario(scenario_id: str):
    scenarios = load_scenarios()
    scenario = next((s for s in scenarios if s["id"] == scenario_id), None)
    if not scenario:
        raise ValueError(f"Scenario {scenario_id} not found")

    base_time = datetime.utcnow()
    logs = []

    for idx, step in enumerate(scenario["steps"], start=1):
        logs.append({
            "scenario_id": scenario["id"],
            "scenario_name": scenario["name"],
            "timestamp": (base_time + timedelta(minutes=idx)).isoformat() + "Z",
            "host": f"lab-host-{scenario['id'][-1]}",
            "event_type": step["event_type"],
            "message": step["message"],
            "raw_log": step["raw_log"],
            "expected_technique_id": scenario["technique_id"],
            "expected_technique_name": scenario["technique_name"],
            "expected_severity": scenario["severity"]
        })

    return scenario, logs