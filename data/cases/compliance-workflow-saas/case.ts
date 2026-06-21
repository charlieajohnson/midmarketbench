import type { BenchmarkCase } from "@/lib/types";

export const complianceWorkflowCase: BenchmarkCase = {
  id: "case_001",
  slug: "compliance-workflow-saas",
  name: "Veritalis Compliance Cloud",
  sector: "B2B Software",
  subsector: "Compliance workflow",
  geography: "DACH, UK, Benelux",
  stage: "Lower mid-market",
  arrEurM: 18.4,
  growthRate: 0.24,
  ebitdaMargin: 0.12,
  ownershipContext: "Founder-owned",
  difficulty: "Medium",
  confidentiality: "Synthetic",
  skills: ["Commercial judgement", "Retention analysis", "TAM critique", "Red flag detection", "IC memo drafting"],
  summary:
    "Veritalis sells multi-site audit and compliance workflow software to regulated mid-market manufacturers. It reports €18.4m ARR, 24 percent growth, 118 percent NRR and a 12 percent EBITDA margin. The headline is attractive. The underlying expansion, revenue mix and reachable market require sharper work.",
  files: [
    {
      filename: "company-overview.md",
      type: "Markdown",
      description: "Company, product, customers and management framing.",
    },
    {
      filename: "arr-bridge.csv",
      type: "CSV",
      description: "Three-year ARR movement in EUR millions.",
      table: {
        columns: ["Fiscal year", "Opening ARR", "New logo", "Expansion", "Churn", "Closing ARR"],
        rows: [
          ["FY23", "9.0", "2.4", "1.3", "(0.8)", "11.9"],
          ["FY24", "11.9", "2.7", "1.7", "(1.0)", "15.3"],
          ["FY25", "15.3", "2.3", "1.9", "(1.1)", "18.4"],
        ],
      },
    },
    {
      filename: "retention-cohorts.csv",
      type: "CSV",
      description: "Logo retention and year-three NRR by customer cohort.",
      table: {
        columns: ["Cohort", "Accounts", "Year 1 logo", "Year 2 logo", "Year 3 logo", "NRR year 3"],
        rows: [
          ["2021", "120", "92%", "85%", "80%", "121%"],
          ["2022", "160", "90%", "83%", "–", "116%"],
          ["2023", "190", "88%", "–", "–", "109%"],
        ],
      },
    },
    {
      filename: "customer-concentration.csv",
      type: "CSV",
      description: "Largest customer and aggregate concentration.",
      table: {
        columns: ["Customer", "Segment", "ARR (€k)", "% of ARR"],
        rows: [
          ["Account A (automotive)", "Enterprise", "2,150", "11.7%"],
          ["Top 5 accounts", "Mixed", "5,600", "30.4%"],
          ["Top 10 accounts", "Mixed", "7,700", "41.8%"],
        ],
      },
    },
    {
      filename: "management-qa.md",
      type: "Markdown",
      description: "Management commentary on NRR, services, AI and international expansion.",
    },
    {
      filename: "answer-key.json",
      type: "JSON",
      description: "Private scoring guide represented here behind a spoiler gate.",
    },
  ],
  taskKeys: ["investment-summary", "red-flag-detection", "retention-quality", "tam-critique", "management-qa"],
};

export const caseStubs = [
  {
    name: "HelixRoster Health",
    subsector: "Healthcare workforce management",
    geography: "UK, Nordics",
    status: "In preparation",
  },
  { name: "AegisControl", subsector: "Cybersecurity compliance", geography: "Europe", status: "In preparation" },
  { name: "FerroFlow", subsector: "Industrial field service", geography: "DACH, CEE", status: "In preparation" },
  {
    name: "Lexora Automate",
    subsector: "Legal document automation",
    geography: "UK, Benelux",
    status: "In preparation",
  },
];
