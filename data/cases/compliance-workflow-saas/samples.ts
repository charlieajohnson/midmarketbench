import type { SampleOutput } from "@/lib/types";

export const samples: SampleOutput[] = [
  {
    id: "sample_strong_red_flags",
    modelSlug: "gpt-5-5",
    taskKey: "red-flag-detection",
    caseSlug: "compliance-workflow-saas",
    quality: "strong",
    scores: {
      grounding: 90,
      commercial_judgement: 88,
      scepticism: 89,
      numerical_sanity: 86,
      risk_discovery: 90,
      question_generation: 86,
      european_context: 84,
      output_usefulness: 88,
    },
    evaluatorRationale:
      "Grounds each issue in the packet, ranks by decision impact and proposes a specific diligence action.",
    content: `### Ranked diligence risks

1. **NRR quality:** Headline NRR of 118 percent is not broad-based. FY25 expansion of €1.9m includes roughly €1.1m from one automotive account and €0.5m from CPI uplift, leaving about €0.3m of seat and module expansion. **Action:** decompose expansion by account, module, seat and price over three years.
2. **Services contamination:** Services are about 28 percent of revenue at roughly 20 percent gross margin. **Action:** restate software-only economics and test whether implementation can be productised.
3. **Customer concentration:** Account A is 11.7 percent of ARR; the top ten are 41.8 percent. **Action:** review renewal dates, contract protection and switching costs for the top ten.
4. **Geographic repeatability:** Product-market fit is DACH-proven. UK and Benelux remain early and fragmented. **Action:** separate pipeline, win rate, implementation cost and retention by country.
5. **TAM overreach:** The €14bn figure is a broad category. The reachable market is regulated mid-market manufacturers with multi-site audit workflows, plausibly €0.6bn to €0.9bn. **Action:** rebuild from target sites and ACV.

The central question is whether durable, usage-led expansion exists once price and one-off enterprise effects are removed.`,
  },
  {
    id: "sample_weak_red_flags",
    modelSlug: "gpt-5-2-pro",
    taskKey: "red-flag-detection",
    caseSlug: "compliance-workflow-saas",
    quality: "weak",
    scores: {
      grounding: 62,
      commercial_judgement: 55,
      scepticism: 52,
      numerical_sanity: 58,
      risk_discovery: 57,
      question_generation: 60,
      european_context: 54,
      output_usefulness: 64,
    },
    evaluatorRationale:
      "Lists generic risks, accepts headline NRR and TAM, and misses the packet's most decision-relevant contradictions.",
    content: `### Key risks

1. Competition in the compliance software market is intense.
2. Customer churn is a risk for SaaS businesses.
3. There is key-person risk in the founder-led structure.
4. Macroeconomic conditions in Europe could affect growth.
5. Execution risk exists around the AI roadmap.

Overall, the company shows strong momentum with 118 percent NRR and a large €14bn market opportunity.`,
  },
];
