from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.simulator import load_scenarios, simulate_scenario
from app.mutations import generate_variants
from app.detections import run_detection_engine, load_profiles
from app.evaluator import evaluate_resilience
from app.intel import extract_ips, check_ip
from app.ai_engine import recommendation_for_misses
from app.models import SimulateRequest

app = FastAPI(title="SOCForge X API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/scenarios")
def get_scenarios():
    return load_scenarios()


@app.get("/profiles")
def get_profiles():
    return load_profiles()


@app.post("/simulate")
def simulate(req: SimulateRequest):
    scenario, logs = simulate_scenario(req.scenario_id)

    if req.mutation_mode == "baseline":
        variants = [("baseline", logs)]
    else:
        variants = generate_variants(logs)

    variant_results = []
    all_logs = []

    for variant_name, variant_logs in variants:
        alerts = run_detection_engine(variant_logs, profile_id=req.detection_profile)
        detected_count = sum(1 for a in alerts if a["detected"])
        variant_results.append((variant_name, {
            "logs": variant_logs,
            "alerts": alerts,
            "detected_count": detected_count
        }))
        all_logs.extend(variant_logs)

    evaluation = evaluate_resilience(variant_results)
    intel = [check_ip(ip) for ip in extract_ips(all_logs)]
    ai = recommendation_for_misses(evaluation)

    return {
        "scenario": scenario,
        "variants": [
            {
                "name": name,
                "logs": data["logs"],
                "alerts": data["alerts"],
                "detected_count": data["detected_count"]
            }
            for name, data in variant_results
        ],
        "evaluation": evaluation,
        "intel": intel,
        "ai": ai
    }