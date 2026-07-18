import Link from "next/link";

type RunNoticeProps = {
  caseName: string;
  evaluatedAt: string;
  modelsCompleted: number;
  modelsRequested: number;
  samplesPerModel: number;
  totalSpendUsd: number;
};

export function RunNotice({
  caseName,
  evaluatedAt,
  modelsCompleted,
  modelsRequested,
  samplesPerModel,
  totalSpendUsd,
}: RunNoticeProps) {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(evaluatedAt));

  return (
    <aside className="synthetic-banner" aria-label="Observed benchmark run provenance">
      <span className="synthetic-banner-label">Observed run</span>
      <span>
        {caseName}, a synthetic company. {modelsCompleted} of {modelsRequested} models completed {samplesPerModel}{" "}
        scored samples via OpenRouter on {date}. Recorded spend: ${totalSpendUsd.toFixed(2)} USD.
      </span>
      <Link className="text-link" href="/methodology">
        Audit method
      </Link>
    </aside>
  );
}
