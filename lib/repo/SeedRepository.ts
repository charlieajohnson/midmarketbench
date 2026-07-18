import { answerKey } from "@/data/cases/compliance-workflow-saas/answer-key";
import { complianceWorkflowCase } from "@/data/cases/compliance-workflow-saas/case";
import { samples } from "@/data/cases/compliance-workflow-saas/samples";
import { tasks } from "@/data/cases/compliance-workflow-saas/tasks";
import { norwynAnswerKey } from "@/data/cases/norwyn-controls/answer-key";
import { norwynControlsCase } from "@/data/cases/norwyn-controls/case";
import { norwynTasks } from "@/data/cases/norwyn-controls/tasks";
import { dimensions } from "@/data/dimensions";
import { loadObservedBenchmarkData } from "@/data/observed";
import type { BenchmarkRepository } from "@/lib/repo/Repository";

export class SeedRepository implements BenchmarkRepository {
  private readonly observed = loadObservedBenchmarkData();

  async getModels() {
    return this.observed.models.map(({ model }) => model);
  }
  async getModel(slug: string) {
    return this.observed.models.find(({ model }) => model.slug === slug)?.model;
  }
  async getProviders() {
    return [...new Map(this.observed.models.map(({ provider }) => [provider.id, provider])).values()];
  }
  async getDimensions() {
    return dimensions;
  }
  async getLeaderboard() {
    return this.observed.leaderboard;
  }
  async getRunSummary() {
    return this.observed.run;
  }
  async getModelResults() {
    return this.observed.models;
  }
  async getModelResult(slug: string) {
    return this.observed.models.find(({ model }) => model.slug === slug);
  }
  async getUnavailableModels() {
    return this.observed.models.filter(({ status }) => status !== "complete");
  }
  async getCases() {
    return [norwynControlsCase, complianceWorkflowCase];
  }
  async getCase(slug: string) {
    return [norwynControlsCase, complianceWorkflowCase].find((benchmarkCase) => benchmarkCase.slug === slug);
  }
  async getTasks() {
    return [...norwynTasks, ...tasks];
  }
  async getTask(key: string) {
    return [...norwynTasks, ...tasks].find((task) => task.key === key);
  }
  async getAnswerKey(caseSlug: string) {
    if (caseSlug === norwynControlsCase.slug) return norwynAnswerKey;
    return caseSlug === complianceWorkflowCase.slug ? answerKey : [];
  }
  async getSamplesForTask(key: string, caseSlug: string) {
    return samples.filter((sample) => sample.taskKey === key && sample.caseSlug === caseSlug);
  }
}
