import requests
from app.config import ABUSEIPDB_API_KEY


def extract_ips(logs):
    ips = set()
    for log in logs:
        raw = log.get("raw_log", {})
        for key in ["source_ip", "destination_ip"]:
            if raw.get(key):
                ips.add(raw[key])
    return sorted(ips)


def check_ip(ip):
    if not ABUSEIPDB_API_KEY:
        return {"ip": ip, "status": "No API key configured"}

    url = "https://api.abuseipdb.com/api/v2/check"
    headers = {
        "Accept": "application/json",
        "Key": ABUSEIPDB_API_KEY
    }
    params = {
        "ipAddress": ip,
        "maxAgeInDays": 90
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=15)
        data = response.json().get("data", {})
        return {
            "ip": ip,
            "abuse_confidence_score": data.get("abuseConfidenceScore"),
            "country_code": data.get("countryCode"),
            "usage_type": data.get("usageType")
        }
    except Exception as e:
        return {"ip": ip, "error": str(e)}