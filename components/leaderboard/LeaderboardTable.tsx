"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/common/Badge";
import { RankDelta } from "@/components/leaderboard/RankDelta";
import { ScoreCell } from "@/components/leaderboard/ScoreCell";
import { ModelLogo } from "@/components/model/ModelLogo";
import { roundScore } from "@/lib/scoring";
import type { Dimension, DimensionKey, LeaderboardRow } from "@/lib/types";

type SortKey = "rank" | "overall" | DimensionKey;

export function LeaderboardTable({ rows, dimensions }: { rows: LeaderboardRow[]; dimensions: Dimension[] }) {
  const [sort, setSort] = useState<SortKey>("overall");
  const [descending, setDescending] = useState(true);
  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const av = sort === "rank" ? a.rank : sort === "overall" ? a.overall : a.scores[sort];
        const bv = sort === "rank" ? b.rank : sort === "overall" ? b.overall : b.scores[sort];
        return (av - bv) * (descending ? -1 : 1) || a.rank - b.rank;
      }),
    [rows, sort, descending],
  );

  function changeSort(next: SortKey) {
    if (sort === next) setDescending((value) => !value);
    else {
      setSort(next);
      setDescending(next !== "rank");
    }
  }

  const ariaSort = (key: SortKey) =>
    sort === key ? (descending ? ("descending" as const) : ("ascending" as const)) : ("none" as const);

  return (
    <>
      <div className="leaderboard-mobile" aria-label="Mobile synthetic model leaderboard">
        <div className="mobile-sort-row" aria-label="Sort leaderboard">
          <button type="button" className="sort-button sort-chip" onClick={() => changeSort("rank")}>
            Rank
          </button>
          <button type="button" className="sort-button sort-chip" onClick={() => changeSort("overall")}>
            Overall
          </button>
          <button type="button" className="sort-button sort-chip" onClick={() => changeSort("commercial_judgement")}>
            Judgement
          </button>
        </div>
        <div className="rank-card-list">
          {sorted.map((row) => {
            const topDimensions = [...dimensions]
              .sort((a, b) => row.scores[b.key] - row.scores[a.key])
              .slice(0, 3);
            return (
              <article className="rank-card" key={row.model.id}>
                <div className="rank-card-head">
                  <div className="rank-stamp">#{row.rank}</div>
                  <Link className="model-cell" href={`/models/${row.model.slug}`}>
                    <ModelLogo provider={row.provider} />
                    <span className="model-cell-copy">
                      <span className="model-cell-name">{row.model.name}</span>
                      <span className="model-cell-provider">{row.provider.name}</span>
                    </span>
                  </Link>
                  <div className="rank-card-score mono">{roundScore(row.overall).toFixed(1)}</div>
                </div>
                <div className="rank-card-bars">
                  {topDimensions.map((dimension) => (
                    <div className="rank-card-bar" key={dimension.key}>
                      <span>{dimension.label}</span>
                      <span className="bar-track">
                        <span
                          className="bar-fill"
                          style={{ width: `${roundScore(row.scores[dimension.key])}%` }}
                        />
                      </span>
                      <span className="mono">{roundScore(row.scores[dimension.key])}</span>
                    </div>
                  ))}
                </div>
                <details className="rank-card-details">
                  <summary>All dimensions</summary>
                  <div className="rank-card-all">
                    {dimensions.map((dimension) => (
                      <span key={dimension.key}>
                        {dimension.shortLabel} <strong>{roundScore(row.scores[dimension.key])}</strong>
                      </span>
                    ))}
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </div>
      <div className="table-wrap leaderboard-table-wrap">
        <table className="leaderboard" aria-label="Synthetic model leaderboard">
          <thead>
            <tr>
              <th scope="col" aria-sort={ariaSort("rank")}>
                <button className="sort-button" onClick={() => changeSort("rank")}>
                  Rank
                </button>
              </th>
              <th scope="col">Delta</th>
              <th scope="col" className="left">
                Model
              </th>
              <th scope="col" aria-sort={ariaSort("overall")}>
                <button className="sort-button" onClick={() => changeSort("overall")}>
                  Overall
                </button>
              </th>
              {dimensions.map((dimension) => (
                <th scope="col" key={dimension.key} title={dimension.label} aria-sort={ariaSort(dimension.key)}>
                  <button className="sort-button" onClick={() => changeSort(dimension.key)}>
                    {dimension.shortLabel}
                  </button>
                </th>
              ))}
              <th scope="col">Mode</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.model.id}>
                <td className="mono">{row.rank}</td>
                <td>
                  <RankDelta delta={row.delta} />
                </td>
                <td className="left">
                  <Link className="model-cell" href={`/models/${row.model.slug}`}>
                    <ModelLogo provider={row.provider} />
                    <span className="model-cell-copy">
                      <span className="model-cell-name">{row.model.name}</span>
                      <span className="model-cell-provider">{row.provider.name}</span>
                    </span>
                  </Link>
                </td>
                <ScoreCell value={row.overall} leader={row.rank === 1} />
                {dimensions.map((dimension) => (
                  <ScoreCell key={dimension.key} value={row.scores[dimension.key]} />
                ))}
                <td>
                  <Badge>{row.mode}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
