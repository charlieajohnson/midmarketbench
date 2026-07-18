import type {
  AnswerKeyItem,
  BenchmarkRunSummary,
  BenchmarkCase,
  Dimension,
  LeaderboardRow,
  Model,
  ModelBenchmarkResult,
  Provider,
  SampleOutput,
  Task,
} from "@/lib/types";

export interface BenchmarkRepository {
  getModels(): Promise<Model[]>;
  getModel(slug: string): Promise<Model | undefined>;
  getProviders(): Promise<Provider[]>;
  getDimensions(): Promise<Dimension[]>;
  getLeaderboard(versionLabel?: string): Promise<LeaderboardRow[]>;
  getRunSummary(): Promise<BenchmarkRunSummary>;
  getModelResults(): Promise<ModelBenchmarkResult[]>;
  getModelResult(slug: string): Promise<ModelBenchmarkResult | undefined>;
  getUnavailableModels(): Promise<ModelBenchmarkResult[]>;
  getCases(): Promise<BenchmarkCase[]>;
  getCase(slug: string): Promise<BenchmarkCase | undefined>;
  getTasks(): Promise<Task[]>;
  getTask(key: string): Promise<Task | undefined>;
  getAnswerKey(caseSlug: string): Promise<AnswerKeyItem[]>;
  getSamplesForTask(key: string, caseSlug: string): Promise<SampleOutput[]>;
}
