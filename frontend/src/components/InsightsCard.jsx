export default function InsightsCard({
  insight,
  onGenerate,
  busy,
}) {
  return (
    <section className="panel insights-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            SMART SUMMARY
          </span>

          <h2>AI insights</h2>
        </div>

        <button
          className="secondary-button"
          disabled={busy}
          onClick={onGenerate}
        >
          {insight ? "Refresh" : "Generate"}
        </button>
      </div>

      {insight ? (
        <pre>{insight}</pre>
      ) : (
        <p className="muted">
          See your spending patterns,
          payment notes, and simple
          savings suggestions.
        </p>
      )}
    </section>
  );
}