import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page">
      <p className="eyebrow">404</p>
      <h1 className="display page-title">No benchmark artefact here.</h1>
      <p className="lede">The route does not map to a published case, model or task.</p>
      <div style={{ marginTop: 28 }}>
        <Link className="text-link" href="/">
          Return to the leaderboard
        </Link>
      </div>
    </div>
  );
}
