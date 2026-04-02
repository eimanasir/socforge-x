import GlassPanel from "../components/GlassPanel";
import KpiCard from "../components/KpiCard";

export default function HomePage() {
  return (
    <div className="page">
      <div className="hero">
        <h1>SOCForge X</h1>
        <p>Adversary Simulation • Detection Resilience • Purple-Team Validation</p>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Mode" value="Live Lab" />
        <KpiCard label="Core Focus" value="Detection Resilience" />
        <KpiCard label="Workflow" value="Red → Blue" />
        <KpiCard label="Status" value="Operational" />
      </div>

      <div className="grid-2">
        <GlassPanel title="What this platform does">
          <p>
            Launch attacks from an adversary-facing console and observe whether they
            are caught in a separate SOC Command Center.
          </p>
        </GlassPanel>

        <GlassPanel title="Why it stands out">
          <p>
            SOCForge X focuses on whether detections remain effective after attacker
            behavior changes.
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}