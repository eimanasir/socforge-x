SOCForge X

This is a project I built to understand how detection logic behaves when attacker techniques change.

Instead of just triggering an alert once and calling it “detected”, the idea here is to simulate different versions of the same attack and see what actually gets caught and what gets missed.

The app has two main parts:

Adversary Lab  
This is where you launch attack scenarios. You can choose a scenario, apply different variants (like obfuscation or low-and-slow behavior), and run the simulation.

SOC Command Center  
This is where you see the results. It shows which variants were detected, which ones were missed, a simple resilience score, and some additional context like threat intel and AI suggestions.

What it does

- simulates attack scenarios based on MITRE-style techniques  
- generates multiple variants of the same attack  
- runs detection logic against each variant  
- shows detected vs missed behavior  
- calculates a detection resilience score  
- enriches IPs using AbuseIPDB  
- gives basic AI-based suggestions for improving detections  

Tech stack

- React (Vite) for frontend  
- FastAPI (Python) for backend  
- AbuseIPDB for threat intelligence  
- Gemini API for AI suggestions  

Why I built this

Most beginner SOC projects focus on detecting a single version of an attack. In reality, attackers don’t behave that cleanly. Even small changes can break detections.

I wanted to build something that focuses more on detection gaps and resilience rather than just alert generation.

How to run

Backend

cd backend  
pip install -r requirements.txt  
uvicorn app.main:app --reload  

Frontend

cd frontend  
npm install  
npm run dev  

Then open http://localhost:5173

Notes

- The data is simulated for now  
- Only the latest run is stored  
- This is more of a learning project than a production system  

Author

Ahmed Bin Zahid
