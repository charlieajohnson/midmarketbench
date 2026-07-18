import type { AnswerKeyItem } from "@/lib/types";

export const norwynAnswerKey: AnswerKeyItem[] = [
  {
    id: "NW_001",
    issue: "Headline NRR does not reconcile",
    evidence: ["D02 implies 105.8% all-customer NRR", "D03 shows only EUR 0.95m of usage-led expansion"],
    whyItMatters: "The reported 121 percent headline overstates both retention and the durability of expansion.",
    highScoreResponse:
      "Reconstructs NRR, GRR and stress NRR, then requests A01 to reconcile the customer-level bridge.",
    lowScoreResponse: "Repeats management's 121 percent NRR as a strength.",
  },
  {
    id: "NW_002",
    issue: "Closing ARR includes contracts that are not live",
    evidence: ["D08 includes EUR 1.30m signed but not live or invoiced more than six months after signature"],
    whyItMatters: "The ARR denominator, growth rate and valuation reference may all be overstated.",
    highScoreResponse: "Separates contracted, deployed and invoiced ARR and validates the position through A01.",
    lowScoreResponse: "Treats EUR 22.60m as fully deployed recurring revenue.",
  },
  {
    id: "NW_003",
    issue: "Adjusted EBITDA is not cash-like",
    evidence: ["D06 capitalises EUR 2.10m of development and excludes EUR 1.40m of payroll"],
    whyItMatters:
      "Expensing both items reduces normalised cash-like EBITDA to EUR 0.39m, or roughly 1.4 percent of revenue.",
    highScoreResponse: "Rebuilds cash-like profitability and validates the accounting bridge through A02.",
    lowScoreResponse: "Accepts the reported EUR 3.89m adjusted EBITDA and 14 percent margin.",
  },
  {
    id: "NW_004",
    issue: "Customer A drives expansion and creates a near-term renewal risk",
    evidence: ["D07: 12.4% of ARR and a retender in nine months", "D03: EUR 0.95m acquired-site roll-in"],
    whyItMatters: "One account materially affects headline expansion, concentration and downside.",
    highScoreResponse: "Prioritises the contract, tender pack and independent renewal call in A03.",
    lowScoreResponse: "Notes concentration without connecting it to NRR or the retender.",
  },
  {
    id: "NW_005",
    issue: "Implementation is slower and more service-heavy than claimed",
    evidence: ["D05: services are 21.2% of revenue at 23% gross margin", "D08: median go-live is 7.2 months"],
    whyItMatters: "Delivery intensity weakens scalability, margin quality and customer outcomes.",
    highScoreResponse:
      "Separates subscription and services economics and tests deployment outcomes through A01 or A04.",
    lowScoreResponse: "Calls the model product-led without reconciling delivery evidence.",
  },
  {
    id: "NW_006",
    issue: "DACH growth is dependent on one terminable reseller",
    evidence: ["D09: EUR 1.24m of EUR 1.75m DACH new-logo ARR came through one reseller"],
    whyItMatters: "The packet does not demonstrate a repeatable direct international motion.",
    highScoreResponse: "Tests the reseller contract, local product gaps, pipeline and cohorts through A05.",
    lowScoreResponse: "Treats DACH growth as proof of direct go-to-market repeatability.",
  },
];
