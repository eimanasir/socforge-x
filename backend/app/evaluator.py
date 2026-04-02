def evaluate_resilience(variant_results):
    total_variants = len(variant_results)
    detected_variants = sum(1 for _, r in variant_results if r["detected_count"] > 0)
    resilience_score = round((detected_variants / total_variants) * 100, 2) if total_variants else 0

    if resilience_score >= 80:
        level = "Strong"
    elif resilience_score >= 50:
        level = "Moderate"
    else:
        level = "Weak"

    missed = []
    for variant_name, result in variant_results:
        if result["detected_count"] == 0 and result["logs"]:
            first_log = result["logs"][0]
            missed.append({
                "variant": variant_name,
                "technique_id": first_log["expected_technique_id"],
                "technique_name": first_log["expected_technique_name"],
                "message": first_log["message"]
            })

    return {
        "resilience_score": resilience_score,
        "variants_tested": total_variants,
        "variants_detected": detected_variants,
        "resilience_level": level,
        "missed_variants": missed
    }