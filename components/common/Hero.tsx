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
          <img className="hero-art-figure" src="/graphics/atelier-hero.svg" alt="" />
          <div className="hero-ledger-card hero-ledger-card-main">
            <span>Grounding</span>
            <strong>88</strong>
          </div>
          <div className="hero-ledger-card hero-ledger-card-secondary">
            <span>Scepticism</span>
            <strong>83</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
