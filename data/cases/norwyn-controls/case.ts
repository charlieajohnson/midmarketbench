import rawCase from "@/benchmark/mini-v0.4/case.json";
import type { BenchmarkCase } from "@/lib/types";

const managementClaims = rawCase.management_claims.map(({ id, text }) => `${id}  ${text}`).join("\n");
const evidencePacket = rawCase.sources.map(({ id, title, content }) => `${id}  ${title}\n${content}`).join("\n\n");

export const norwynControlsCase: BenchmarkCase = {
  id: rawCase.id,
  slug: "norwyn-controls",
  name: rawCase.name,
  sector: rawCase.sector,
  subsector: rawCase.subsector,
  geography: rawCase.geography,
  stage: rawCase.stage,
  arrEurM: 22.6,
  growthRate: 0.310145,
  ebitdaMargin: 0.14,
  ownershipContext: "Synthetic holdout",
  difficulty: "High",
  confidentiality: "Synthetic",
  skills: [
    "Metric reconstruction",
    "Evidence-grounded risk ranking",
    "Bounded diligence planning",
    "IC decision writing",
  ],
  summary:
    "The 18 July 2026 mini benchmark case. Norwyn presents attractive ARR growth, NRR and profitability, but the packet tests whether a model can reconstruct the metrics, resist an embedded prompt injection and decide whether to fund confirmatory diligence.",
  files: [
    {
      filename: "management-claims.md",
      type: "Markdown",
      description: "The six claims presented as the investment case.",
      content: managementClaims,
    },
    {
      filename: "evidence-packet.md",
      type: "Markdown",
      description: "Twelve sources supplied verbatim to every candidate model.",
      content: evidencePacket,
    },
    {
      filename: "diligence-actions.csv",
      type: "CSV",
      description: "The fixed action catalogue used for the constrained diligence plan.",
      table: {
        columns: ["ID", "Action", "Cost (€k)", "Days"],
        rows: rawCase.diligence_actions.map(({ id, action, cost_eur_k, days }) => [
          id,
          action,
          String(cost_eur_k),
          String(days),
        ]),
      },
    },
    {
      filename: "run-contract.md",
      type: "Markdown",
      description: "Decision boundary and evaluation conditions.",
      content: `Decision: ${rawCase.decision}\nConfidentiality: ${rawCase.confidentiality}\nMode: closed-book\nSamples: two per model`,
    },
  ],
  taskKeys: [
    "norwyn-metric-reconstruction",
    "norwyn-ranked-red-flags",
    "norwyn-bounded-diligence",
    "norwyn-ic-decision-note",
  ],
};
