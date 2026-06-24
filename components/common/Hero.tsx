import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-field" aria-hidden="true" />
      <div className="shell-wide hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">European B2B software investment benchmark</p>
          <h1 className="display">Investment judgement, benchmarked.</h1>
          <p className="hero-question">Not “can the model answer?” but “can the model help decide?”</p>
          <div className="hero-actions">
            <Link className="button-link button-link-primary" href="/#leaderboard">
              View leaderboard
            </Link>
            <Link className="button-link" href="/cases/compliance-workflow-saas">
              Read the case
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="evaluation-tableau">
            <div className="tableau-grid">
              <div className="tableau-card tableau-card-thesis">
                <span>Evaluation packet</span>
                <strong>Evidence into judgement</strong>
                <p>Closed-book review / model output / dissent notes</p>
              </div>
              <div className="tableau-panel tableau-panel-atmosphere">
                <div className="tableau-robe-fragment" />
                <div className="tableau-data-drape" />
                <div className="tableau-ledger-sheet">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="tableau-scale">
                  <span className="scale-post" />
                  <span className="scale-beam" />
                  <span className="scale-left" />
                  <span className="scale-right" />
                  <span className="scale-base" />
                </div>
              </div>
              <div className="tableau-panel tableau-panel-data">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="tableau-card tableau-card-note">
                <span>Marginalia</span>
                <strong>Scepticism flags the convenient narrative.</strong>
              </div>
              <div className="tableau-card tableau-card-score">
                <span>Grounding</span>
                <strong>88</strong>
                <p>packet evidence</p>
              </div>
              <div className="tableau-seal">
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
