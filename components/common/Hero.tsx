import Image from "next/image";
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
          <Image
            className="hero-art-figure"
            src="/graphics/atelier-hero.svg"
            alt=""
            width={760}
            height={640}
            priority
          />
        </div>
      </div>
    </section>
  );
}
