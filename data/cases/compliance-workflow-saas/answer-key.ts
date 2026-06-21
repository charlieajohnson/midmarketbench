import type { AnswerKeyItem } from "@/lib/types";

export const answerKey: AnswerKeyItem[] = [
  {
    id: "RF_001",
    issue: "NRR quality is overstated",
    evidence: [
      "118% reported NRR",
      "€1.1m of FY25 expansion came from one account",
      "€0.5m came from CPI-linked uplift",
      "Only €0.3m appears to be seat and module expansion",
    ],
    whyItMatters: "Durable usage-led expansion is materially weaker than the headline implies.",
    highScoreResponse: "Decomposes expansion by account, module, seat and price, then tests cohorts and concentration.",
    lowScoreResponse: "Treats 118 percent NRR as evidence of strong broad-based expansion.",
  },
  {
    id: "RF_002",
    issue: "Services contaminate software economics",
    evidence: [
      "Services are 28% of revenue",
      "Services gross margin is about 20%",
      "Software gross margin is about 85%",
    ],
    whyItMatters: "Implementation intensity limits scalability and suppresses blended margin quality.",
    highScoreResponse: "Restates software-only economics and tests whether delivery can be productised.",
    lowScoreResponse: "Uses total revenue growth without separating the delivery model.",
  },
  {
    id: "RF_003",
    issue: "Customer concentration is material",
    evidence: ["Account A is 11.7% of ARR", "Top ten customers are 41.8% of ARR"],
    whyItMatters: "Renewal timing and account-specific expansion can move headline growth and retention materially.",
    highScoreResponse: "Requests renewal dates, contract terms, expansion history and switching costs for the top ten.",
    lowScoreResponse: "Notes concentration without quantifying its effect on growth or downside.",
  },
  {
    id: "RF_004",
    issue: "The €14bn TAM stretches the category",
    evidence: [
      "Management uses total European compliance software",
      "The real ICP is regulated multi-site mid-market manufacturers in three regions",
    ],
    whyItMatters: "The reachable market is plausibly €0.6bn to €0.9bn, not the broad category total.",
    highScoreResponse: "Builds from target sites, buyer incidence, ACV and country-level penetrability.",
    lowScoreResponse: "Repeats the broad TAM as a growth proof point.",
  },
  {
    id: "RF_005",
    issue: "International product-market fit is unproven",
    evidence: ["DACH concentration", "Early UK and Benelux presence", "Regulatory and language fragmentation"],
    whyItMatters: "The repeatability of the growth plan has not been demonstrated outside the core geography.",
    highScoreResponse: "Separates pipeline, win rates, implementation cost and retention by country.",
    lowScoreResponse: "Assumes European adjacency translates into a repeatable go-to-market motion.",
  },
  {
    id: "RF_006",
    issue: "AI roadmap is not evidence of differentiation",
    evidence: [
      "Automated evidence review is a roadmap claim",
      "No proprietary data advantage or deployed customer proof is supplied",
    ],
    whyItMatters: "A generic feature roadmap may not defend the product from horizontal or incumbent competition.",
    highScoreResponse:
      "Tests shipped capability, workflow ownership, data rights, customer willingness to pay and measured outcomes.",
    lowScoreResponse: "Treats AI positioning as a moat.",
  },
];
