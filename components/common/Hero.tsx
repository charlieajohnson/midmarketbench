import Link from "next/link";

export function Hero() {
  return (
    <section className="hero hero-signal">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">European B2B software investment benchmark</p>
            <h1 className="hero-title">
              <span>Investment judgement,</span>
              <span>benchmarked.</span>
            </h1>
            <p className="hero-subline">Not “can the model answer?” but “can the model help decide?”</p>
            <div className="hero-actions">
              <Link className="button-link button-link-primary" href="/#leaderboard">
                View leaderboard
              </Link>
              <Link className="button-link" href="/cases/norwyn-controls">
                Inspect scored case
              </Link>
            </div>
            <div className="hero-run-meta" aria-label="Current benchmark run summary">
              <span>Observed 18 July 2026</span>
              <span>9 requested</span>
              <span>8 ranked</span>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-field-plane hero-field-plane-a" />
          <span className="hero-field-plane hero-field-plane-b" />
          <span className="hero-field-orbit" />
          <span className="field-grain" />
          <div className="hero-art-index">MMB / 01</div>
        </div>
      </div>
    </section>
  );
}
