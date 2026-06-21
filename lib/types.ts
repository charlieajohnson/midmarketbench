export const dimensionKeys = [
  "grounding",
  "commercial_judgement",
  "scepticism",
  "numerical_sanity",
  "risk_discovery",
  "question_generation",
  "european_context",
  "output_usefulness",
] as const;

export type DimensionKey = (typeof dimensionKeys)[number];
export type ScoreSet = Record<DimensionKey, number>;

export type Provider = {
  id: string;
  name: string;
  slug: string;
  website: string;
};

export type Model = {
  id: string;
  slug: string;
  name: string;
  providerId: string;
  version: string;
  release: string;
  contextWindow: string;
  openWeights: boolean;
  isPreview?: boolean;
  sourceUrl: string;
};

export type Dimension = {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  weight: number;
  description: string;
  high: string;
  low: string;
};

export type LeaderboardRow = {
  rank: number;
  delta: number | "new";
  model: Model;
  provider: Provider;
  scores: ScoreSet;
  overall: number;
  mode: "Closed-book" | "Web-enabled" | "Agentic";
};

export type CaseTable = {
  columns: string[];
  rows: string[][];
};

export type CaseFile = {
  filename: string;
  type: "Markdown" | "CSV" | "JSON";
  description: string;
  table?: CaseTable;
};

export type BenchmarkCase = {
  id: string;
  slug: string;
  name: string;
  sector: string;
  subsector: string;
  geography: string;
  stage: string;
  arrEurM: number;
  growthRate: number;
  ebitdaMargin: number;
  ownershipContext: string;
  difficulty: "Low" | "Medium" | "High";
  confidentiality: "Synthetic";
  skills: string[];
  summary: string;
  files: CaseFile[];
  taskKeys: string[];
};

export type Task = {
  key: string;
  name: string;
  prompt: string;
  expectedOutput: string[];
  whatGoodLooksLike: string[];
  failureModes: string[];
};

export type AnswerKeyItem = {
  id: string;
  issue: string;
  evidence: string[];
  whyItMatters: string;
  highScoreResponse: string;
  lowScoreResponse: string;
};

export type SampleOutput = {
  id: string;
  modelSlug: string;
  taskKey: string;
  caseSlug: string;
  content: string;
  scores: ScoreSet;
  evaluatorRationale: string;
  quality: "strong" | "weak";
};
