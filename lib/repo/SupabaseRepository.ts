import type { BenchmarkRepository } from "@/lib/repo/Repository";
import type {
  AnswerKeyItem,
  BenchmarkCase,
  BenchmarkRunSummary,
  Dimension,
  LeaderboardRow,
  Model,
  ModelBenchmarkResult,
  Provider,
  SampleOutput,
  Task,
} from "@/lib/types";

function unsupported<T>(...context: unknown[]): Promise<T> {
  void context;
  return Promise.reject(
    new Error(
      "SupabaseRepository is scaffolded for pass two. Run the migration, seed the tables and implement the typed query mappings before enabling USE_SUPABASE.",
    ),
  );
}

export class SupabaseRepository implements BenchmarkRepository {
  getModels(): Promise<Model[]> {
    return unsupported("getModels");
  }
  getModel(slug: string): Promise<Model | undefined> {
    return unsupported("getModel", slug);
  }
  getProviders(): Promise<Provider[]> {
    return unsupported("getProviders");
  }
  getDimensions(): Promise<Dimension[]> {
    return unsupported("getDimensions");
  }
  getLeaderboard(versionLabel?: string): Promise<LeaderboardRow[]> {
    return unsupported("getLeaderboard", versionLabel);
  }
  getRunSummary(): Promise<BenchmarkRunSummary> {
    return unsupported("getRunSummary");
  }
  getModelResults(): Promise<ModelBenchmarkResult[]> {
    return unsupported("getModelResults");
  }
  getModelResult(slug: string): Promise<ModelBenchmarkResult | undefined> {
    return unsupported("getModelResult", slug);
  }
  getUnavailableModels(): Promise<ModelBenchmarkResult[]> {
    return unsupported("getUnavailableModels");
  }
  getCases(): Promise<BenchmarkCase[]> {
    return unsupported("getCases");
  }
  getCase(slug: string): Promise<BenchmarkCase | undefined> {
    return unsupported("getCase", slug);
  }
  getTasks(): Promise<Task[]> {
    return unsupported("getTasks");
  }
  getTask(key: string): Promise<Task | undefined> {
    return unsupported("getTask", key);
  }
  getAnswerKey(caseSlug: string): Promise<AnswerKeyItem[]> {
    return unsupported("getAnswerKey", caseSlug);
  }
  getSamplesForTask(key: string, caseSlug: string): Promise<SampleOutput[]> {
    return unsupported("getSamplesForTask", key, caseSlug);
  }
}
