import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="hero hero-atelier">
      <Image
        className="hero-bg-image hero-bg-image-desktop"
        src="/atelier/midmarketbench-hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <Image
        className="hero-bg-image hero-bg-image-mobile"
        src="/atelier/midmarketbench-hero-bg-mobile.webp"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-eyebrow">European B2B software investment benchmark</p>
          <h1 className="hero-title">
            Investment judgement,
            <br />
            benchmarked.
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
        </div>
      </div>
    </section>
  );
}
