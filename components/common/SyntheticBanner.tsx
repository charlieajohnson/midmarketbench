"use client";

import { useState } from "react";
import { benchmark } from "@/data/benchmark";

export function SyntheticBanner({ dismissible = true }: { dismissible?: boolean }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <aside className="synthetic-banner" aria-label="Synthetic data notice">
      <span className="synthetic-banner-label">Archival note</span>
      <span>{benchmark.disclaimer}</span>
      {dismissible && (
        <button
          className="banner-dismiss"
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss synthetic data notice"
        >
          Close
        </button>
      )}
    </aside>
  );
}
