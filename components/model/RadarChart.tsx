"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from "recharts";
import type { Dimension, LeaderboardRow } from "@/lib/types";

export function RadarChart({ row, dimensions }: { row: LeaderboardRow; dimensions: Dimension[] }) {
  const data = dimensions.map((dimension) => ({
    dimension: dimension.shortLabel,
    score: row.scores[dimension.key],
    fullMark: 100,
  }));
  return (
    <div className="card chart-card" aria-label={`${row.model.name} dimension radar`}>
      <ResponsiveContainer width="100%" height={370}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="var(--color-border-strong)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "var(--color-ink-secondary)", fontSize: 11 }} />
          <Radar
            dataKey="score"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.24}
            isAnimationActive={false}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
