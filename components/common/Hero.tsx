import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="hero">
      <Image
        className="hero-landscape"
        src="/hero-landscape.svg"
        alt="Abstract muted mountain landscape"
        fill
        priority
      />
      <div className="shell-wide hero-inner">
        <p className="eyebrow">European B2B software investment benchmark</p>
        <h1 className="display">Investment judgement, benchmarked.</h1>
        <p className="hero-question">Not “can the model answer?” but “can the model help decide?”</p>
        <div className="hero-actions">
          <Link className="text-link" href="/#leaderboard">
            View leaderboard
          </Link>
          <Link className="text-link" href="/cases/compliance-workflow-saas">
            Read the case
          </Link>
        </div>
      </div>
    </section>
  );
}
