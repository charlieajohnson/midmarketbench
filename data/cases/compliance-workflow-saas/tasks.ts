import type { Task } from "@/lib/types";

export const systemPrompt =
  "You are assisting a European lower-mid-market B2B software private equity investment team. Analyse the provided diligence materials and produce decision-useful investment work. Ground all claims in the materials. Clearly separate facts, inferences and open questions. Do not invent unsupported facts. Prioritise commercial judgement over generic summary.";

export const tasks: Task[] = [
  {
    key: "investment-summary",
    name: "Investment summary",
    prompt: "Produce a one-page investment summary for a European lower-mid-market B2B software investor.",
    expectedOutput: [
      "Company overview",
      "Investment thesis",
      "Key positives and concerns",
      "Operating highlights",
      "Preliminary recommendation",
    ],
    whatGoodLooksLike: [
      "Finds the actual value creation angle",
      "Challenges weak management claims",
      "Separates evidence from assumption",
      "Names the next diligence actions",
    ],
    failureModes: [
      "Rewrites the CIM",
      "Uses generic market language",
      "Ignores revenue quality",
      "Forces certainty from incomplete evidence",
    ],
  },
  {
    key: "red-flag-detection",
    name: "Red flag detection",
    prompt:
      "Identify the ten most important diligence risks. Rank them by severity and support each with packet evidence and a diligence action.",
    expectedOutput: ["Ranked risk", "Severity", "Evidence", "Why it matters", "Diligence action"],
    whatGoodLooksLike: [
      "Ranks by decision impact",
      "Connects evidence across files",
      "Distinguishes company-specific issues from generic PE risks",
    ],
    failureModes: [
      "Generic risk list",
      "Repeats headline NRR as a strength",
      "Misses concentration or services contamination",
      "No actionable next step",
    ],
  },
  {
    key: "retention-quality",
    name: "Retention quality",
    prompt:
      "Assess whether the NRR, GRR, logo retention and churn picture is credible. Separate price from volume and one-off from durable expansion.",
    expectedOutput: [
      "Metric assessment",
      "Cohort analysis",
      "Price-volume bridge",
      "Concentration effects",
      "Missing evidence",
    ],
    whatGoodLooksLike: [
      "Separates NRR from logo retention",
      "Identifies concentrated and price-led expansion",
      "Requests segment and account-level cuts",
    ],
    failureModes: [
      "Treats 118 percent NRR as broad-based",
      "Ignores cohort decay",
      "Confuses price uplift with product adoption",
    ],
  },
  {
    key: "tam-critique",
    name: "TAM critique",
    prompt: "Assess the credibility of the stated TAM. Identify category stretching and size the reachable market.",
    expectedOutput: [
      "Stated TAM",
      "Implied assumptions",
      "Serviceable market",
      "Reachable market",
      "Management questions",
    ],
    whatGoodLooksLike: [
      "Narrows the category to the actual workflow and ICP",
      "Accounts for European fragmentation",
      "Shows a bottom-up sizing path",
    ],
    failureModes: [
      "Accepts €14bn without challenge",
      "Confuses broad category spend with reachable ARR",
      "Applies US category assumptions",
    ],
  },
  {
    key: "management-qa",
    name: "Management Q&A",
    prompt: "Prepare prioritised management questions that could change the investment recommendation.",
    expectedOutput: ["Priority", "Question", "Decision relevance", "Confirmatory evidence", "Disconfirmatory evidence"],
    whatGoodLooksLike: [
      "Sharp and answerable questions",
      "Starts with recommendation-changing uncertainties",
      "Specifies the data cut required",
    ],
    failureModes: [
      "Long generic checklist",
      "Questions that invite narrative answers",
      "No link to the investment decision",
    ],
  },
];
