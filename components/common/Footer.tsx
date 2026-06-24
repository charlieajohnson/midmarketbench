import Link from "next/link";
import { benchmark } from "@/data/benchmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <div className="wordmark">MidMarketBench</div>
          <p>{benchmark.disclaimer}</p>
        </div>
        <div>
          <p className="eyebrow">Research</p>
          <div className="footer-links">
            <Link href="/methodology">Methodology</Link>
            <Link href="/cases">Case library</Link>
            <Link href="/models">Model index</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Build</p>
          <div className="footer-links">
            <a href="/api/v1/health">API health</a>
            <a href="/api/v1/leaderboard">Leaderboard JSON</a>
            <Link href="/about">Provenance</Link>
          </div>
        </div>
      </div>
      <div className="rule">
        <div className="shell footer-bottom">
          Methodology {benchmark.methodologyVersion} / Updated 21 June 2026 / Closed-book mode
        </div>
      </div>
    </footer>
  );
}
