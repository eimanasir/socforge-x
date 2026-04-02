import GlassPanel from "../components/GlassPanel";
import KpiCard from "../components/KpiCard";

export default function SocCenterPage() {
  const data = JSON.parse(localStorage.getItem("socforge_run") || "null");

  if (!data) {
    return (
      <div className="page">
        <div className="hero small">
          <h1>SOC Command Center</h1>
          <p>No active run found. Launch an attack from Adversary Lab first.</p>
        </div>
      </div>
    );
  }

  const { scenario, variants, evaluation, intel, ai } = data;

  return (
    <div className="page">
      <div className="hero small">
        <h1>SOC Command Center</h1>
        <p>Monitor alert outcomes, missed variants, and detection resilience</p>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Resilience Score" value={`${evaluation.resilience_score}%`} />
        <KpiCard label="Variants Tested" value={evaluation.variants_tested} />
        <KpiCard label="Detected Variants" value={evaluation.variants_detected} />
        <KpiCard label="SOC Readiness" value={evaluation.resilience_level} />
      </div>

      <div className="grid-2">
        <GlassPanel title="Active Scenario">
          <div className="badge-row">
            <span className="badge info">{scenario.id}</span>
            <span className="badge warn">{scenario.technique_id}</span>
            <span className="badge danger">{scenario.severity}</span>
          </div>

          <h2 style={{ marginTop: 0 }}>{scenario.name}</h2>
          <p style={{ color: "#9eb9d4", marginBottom: 8 }}>
            Technique: {scenario.technique_name}
          </p>
          <p style={{ color: "#9eb9d4" }}>
            This view represents the blue-team side of the workflow and shows how
            the SOC handled baseline and evasive variants after the attack was launched.
          </p>
        </GlassPanel>

        <GlassPanel title="Threat Intel Enrichment">
          {intel && intel.length > 0 ? (
            intel.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <strong>{item.ip}</strong>
                <p>Abuse Score: {item.abuse_confidence_score ?? "N/A"}</p>
                <p>Country: {item.country_code ?? "N/A"}</p>
                <p>Usage Type: {item.usage_type ?? "N/A"}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#9eb9d4" }}>No threat-intel results available.</p>
          )}
        </GlassPanel>
      </div>

      <GlassPanel title="Variant Detection Outcomes">
        <div className="variant-list">
          {variants.map((variant) => (
            <div className="variant-card" key={variant.name}>
              <div className="badge-row">
                <span className="badge info">{variant.name}</span>
                <span className={`badge ${variant.detected_count > 0 ? "success" : "danger"}`}>
                  {variant.detected_count > 0 ? "Detected" : "Missed"}
                </span>
              </div>

              <p><strong>Events:</strong> {variant.logs.length}</p>
              <p><strong>Alerts:</strong> {variant.detected_count}</p>

              {variant.alerts.map((alert, idx) => (
                <div key={idx} className="timeline-item">
                  <strong>{alert.detection_name}</strong>
                  <p style={{ marginBottom: 6 }}>{alert.message}</p>
                  <p style={{ color: "#9eb9d4", margin: 0 }}>
                    Severity: {alert.severity}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </GlassPanel>

      <div className="grid-2">
        <GlassPanel title="Missed Variants">
          {evaluation.missed_variants && evaluation.missed_variants.length > 0 ? (
            evaluation.missed_variants.map((miss, idx) => (
              <div key={idx} className="timeline-item">
                <strong>{miss.variant}</strong>
                <p style={{ marginBottom: 6 }}>
                  {miss.technique_id} — {miss.technique_name}
                </p>
                <p style={{ color: "#9eb9d4", margin: 0 }}>{miss.message}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#9eb9d4" }}>All tested variants were detected.</p>
          )}
        </GlassPanel>

        <GlassPanel title="AI Detection Guidance">
          <p><strong>Summary</strong></p>
          <p style={{ color: "#dbeafe" }}>
            {ai?.summary || "No AI summary available."}
          </p>

          <p><strong>Improvement</strong></p>
          <p style={{ color: "#9eb9d4" }}>
            {ai?.improvement || "No improvement guidance available."}
          </p>

          {ai?.sigma_draft ? (
            <>
              <p><strong>Sigma Draft</strong></p>
              <pre>{ai.sigma_draft}</pre>
            </>
          ) : null}
        </GlassPanel>
      </div>
    </div>
  );
}