import type {
  AnswerKeyItem,
  BenchmarkCase,
  Dimension,
  LeaderboardRow,
  Model,
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
  getCases(): Promise<BenchmarkCase[]>;
  getCase(slug: string): Promise<BenchmarkCase | undefined>;
  getTasks(): Promise<Task[]>;
  getTask(key: string): Promise<Task | undefined>;
  getAnswerKey(caseSlug: string): Promise<AnswerKeyItem[]>;
  getSamplesForTask(key: string, caseSlug: string): Promise<SampleOutput[]>;
}
