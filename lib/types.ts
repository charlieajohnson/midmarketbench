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
  release: string | null;
  contextWindow: string;
  openWeights: boolean | null;
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
  model: Model;
  provider: Provider;
  scores: ScoreSet;
  overall: number;
  range: [number, number];
  sampleScores: number[];
  samplesCompleted: number;
  samplesRequested: number;
  providerReportedCandidateCostUsd: number;
  providerReportedJudgeCostUsd: number;
  medianLatencyMs: number;
  provisionalTie: boolean;
  endpoint: OpenRouterEndpoint;
  caveat: string | null;
  mode: "Closed-book" | "Web-enabled" | "Agentic";
};

export type BenchmarkDataStatus = "observed" | "pending";
export type ModelResultStatus = "complete" | "partial" | "incomplete" | "unavailable" | "pending";

export type IncompleteSample = {
  sample: number;
  stage: string;
  reason: string;
};

export type OpenRouterEndpoint = {
  requestedId: string;
  returnedModels: string[];
  providers: string[];
  endpointTags: string[];
  quantizations: string[];
  contextLength: number | null;
  pricing: {
    basis: "selected_endpoint_snapshot";
    endpoints: Array<{
      tag: string;
      provider: string;
      promptUsdPerMillion: number;
      completionUsdPerMillion: number;
    }>;
  } | null;
};

type ScoredModelBenchmarkResultBase = {
  model: Model;
  provider: Provider;
  samplesCompleted: number;
  candidateSamplesCompleted: number;
  samplesRequested: number;
  incompleteSamples: IncompleteSample[];
  scores: ScoreSet;
  overall: number;
  range: [number, number];
  sampleScores: number[];
  providerReportedCandidateCostUsd: number;
  providerReportedJudgeCostUsd: number;
  medianLatencyMs: number;
  finishReasons: string[];
  endpoint: OpenRouterEndpoint;
  caveat: string | null;
};

export type CompleteModelBenchmarkResult = ScoredModelBenchmarkResultBase & {
  status: "complete";
  rank: number;
  provisionalTie: boolean;
};

export type PartialModelBenchmarkResult = ScoredModelBenchmarkResultBase & {
  status: "partial";
  rank: null;
  provisionalTie: false;
};

export type ScoredModelBenchmarkResult = CompleteModelBenchmarkResult | PartialModelBenchmarkResult;

export type UnscoredModelBenchmarkResult = {
  status: "incomplete" | "unavailable" | "pending";
  model: Model;
  provider: Provider;
  samplesCompleted: 0;
  candidateSamplesCompleted: number;
  samplesRequested: number;
  incompleteSamples: IncompleteSample[];
  endpoint: OpenRouterEndpoint;
  caveat: string | null;
  rank: null;
  provisionalTie: false;
};

export type ModelBenchmarkResult = ScoredModelBenchmarkResult | UnscoredModelBenchmarkResult;

export type BenchmarkRunSummary = {
  dataStatus: BenchmarkDataStatus;
  dataSource: string;
  benchmarkId: string;
  methodologyVersion: string;
  evaluatedAt: string;
  runId: string | null;
  mode: "Closed-book" | "Web-enabled" | "Agentic";
  caseId: string;
  caseName: string;
  caseConfidentiality: string;
  tasks: number;
  samplesPerModel: number;
  modelsRequested: number;
  modelsCompleted: number;
  modelsPartial: number;
  modelsIncomplete: number;
  modelsUnavailable: number;
  totalSpendUsd: number | null;
  conservativelyAccountedSpendUsd: number | null;
  providerReportedSpendUsd: number | null;
  spendBasis: string | null;
  localBudgetUsd: number;
  promptSha256: string | null;
  judgeSystemPromptSha256: string | null;
  candidateSchemaVariants: Array<{
    id: string;
    responseFormatSha256: string;
    acceptedSamples: number;
  }>;
  caseSha256: string | null;
  modelSnapshotSha256: string | null;
  limitation: string;
  scoring: string;
  reasoningPolicy: string;
  tieRule: string;
};

export type CaseTable = {
  columns: string[];
  rows: string[][];
};

export type CaseFile = {
  filename: string;
  type: "Markdown" | "CSV" | "JSON";
  description: string;
  content?: string;
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
