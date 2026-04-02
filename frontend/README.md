# SOCForge X

SOCForge X is a small project I built to explore how detection logic holds up when attacker behavior changes.

Instead of just detecting a single version of an attack, the idea here is to simulate multiple variants (obfuscation, renamed tools, low-and-slow patterns) and see what the SOC would actually catch — and what it would miss.

---

## What it does

- Simulates attack scenarios mapped to MITRE ATT&CK
- Generates multiple attack variants (baseline + evasive)
- Runs detection logic against those variants
- Shows which variants were detected vs missed
- Calculates a simple "detection resilience score"
- Enriches suspicious IPs using AbuseIPDB
- Provides basic AI-assisted detection improvement suggestions

---

## How it’s structured

**Adversary Lab**
- Launch attack scenarios
- Choose mutation mode (baseline / all variants)
- Select detection profile

**SOC Command Center**
- View detection results
- See which variants triggered alerts
- Identify missed detections
- Review threat intel context
- Get suggestions for improving coverage

---

## Tech stack

- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Styling: Custom CSS + Framer Motion
- Threat Intel: AbuseIPDB API

---

## Why I built this

Most detection rules work for the obvious version of an attack, but fail when attackers slightly change their approach.

I wanted to build something that focuses on:
- detection gaps
- resilience, not just accuracy
- thinking like both attacker and defender

---

## How to run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload