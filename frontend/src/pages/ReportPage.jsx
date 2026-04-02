import GlassPanel from "../components/GlassPanel";

export default function ReportPage() {
  const data = JSON.parse(localStorage.getItem("socforge_run") || "null");

  if (!data) {
    return (
      <div className="page">
        <GlassPanel title="Purple Team Report">
          <p>No run available yet.</p>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero small">
        <h1>Purple Team Report</h1>
        <p>Baseline vs evasive outcomes and improvement guidance</p>
      </div>

      <div className="grid-2">
        <GlassPanel title="Executive Summary">
          <p>{data.ai.summary}</p>
          <p>{data.ai.improvement}</p>
        </GlassPanel>

        <GlassPanel title="Sigma Draft">
          <pre>{data.ai.sigma_draft || "No Sigma draft returned."}</pre>
        </GlassPanel>
      </div>
    </div>
  );
}