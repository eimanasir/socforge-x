import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassPanel from "../components/GlassPanel";
import KpiCard from "../components/KpiCard";
import { getProfiles, getScenarios, simulateAttack } from "../lib/api";

export default function AdversaryLabPage() {
  const [scenarios, setScenarios] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [scenarioId, setScenarioId] = useState("");
  const [profileId, setProfileId] = useState("basic");
  const [mutationMode, setMutationMode] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [scenarioRes, profileRes] = await Promise.all([
          getScenarios(),
          getProfiles(),
        ]);
        setScenarios(scenarioRes || []);
        setProfiles(profileRes || []);
        if (scenarioRes?.length) {
          setScenarioId((prev) => prev || scenarioRes[0].id);
        }
      } catch (err) {
        setError("Failed to load scenarios or profiles from the backend.");
      }
    }

    loadData();
  }, []);

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId),
    [scenarios, scenarioId]
  );

  async function handleLaunch() {
    setLoading(true);
    setError("");

    try {
      const data = await simulateAttack({
        scenario_id: scenarioId,
        mutation_mode: mutationMode,
        detection_profile: profileId,
      });

      localStorage.setItem("socforge_run", JSON.stringify(data));
      setError("");
      alert("Attack launched successfully. Open SOC Command Center.");
    } catch (err) {
      setError("Attack launch failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="hero small">
        <h1>Adversary Lab</h1>
        <p>Launch baseline and evasive variants to pressure-test detection logic</p>
      </div>

      {error ? (
        <GlassPanel title="Launch Error">
          <p style={{ color: "#fca5a5" }}>{error}</p>
        </GlassPanel>
      ) : null}

      <div className="kpi-grid">
        <KpiCard label="Scenarios Loaded" value={scenarios.length || 0} />
        <KpiCard label="Profiles Loaded" value={profiles.length || 0} />
        <KpiCard
          label="Variant Mode"
          value={mutationMode === "all" ? "All Variants" : "Baseline"}
        />
        <KpiCard label="Execution State" value={loading ? "Running" : "Ready"} />
      </div>

      <div className="grid-2">
        <GlassPanel title="Attack Launcher">
          <label>Scenario</label>
          <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name}
              </option>
            ))}
          </select>

          <label>Detection Profile</label>
          <select value={profileId} onChange={(e) => setProfileId(e.target.value)}>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label>Mutation Mode</label>
          <select value={mutationMode} onChange={(e) => setMutationMode(e.target.value)}>
            <option value="all">Baseline + All Variants</option>
            <option value="baseline">Baseline Only</option>
          </select>

          <button className="primary-btn" onClick={handleLaunch} disabled={loading || !scenarioId}>
            {loading ? "Launching..." : "Launch Attack Chain"}
          </button>
        </GlassPanel>

        <GlassPanel title="Selected Scenario">
          {selectedScenario ? (
            <>
              <div className="badge-row">
                <span className="badge info">{selectedScenario.technique_id}</span>
                <span className="badge warn">{selectedScenario.technique_name}</span>
                <span className="badge danger">{selectedScenario.severity}</span>
              </div>

              <h2 style={{ marginTop: 0 }}>{selectedScenario.name}</h2>
              <p style={{ color: "#9eb9d4", marginBottom: 18 }}>
                Simulates suspicious activity aligned with ATT&CK behavior and tests whether
                existing detections survive attacker variations.
              </p>

              {selectedScenario.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="timeline-item"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                >
                  <div className="badge-row">
                    <span className="badge info">{step.event_type}</span>
                  </div>
                  <strong>Attack Step {idx + 1}</strong>
                  <p style={{ marginBottom: 0 }}>{step.message}</p>
                </motion.div>
              ))}
            </>
          ) : (
            <p style={{ color: "#9eb9d4" }}>Loading scenario details...</p>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}