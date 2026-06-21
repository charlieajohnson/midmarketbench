import { answerKey } from "@/data/cases/compliance-workflow-saas/answer-key";
import { complianceWorkflowCase } from "@/data/cases/compliance-workflow-saas/case";
import { samples } from "@/data/cases/compliance-workflow-saas/samples";
import { tasks } from "@/data/cases/compliance-workflow-saas/tasks";
import { dimensions, dimensionWeights } from "@/data/dimensions";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import { rankDeltas, scoresByModel } from "@/data/scores";
import { rankModels } from "@/lib/scoring";
import type { BenchmarkRepository } from "@/lib/repo/Repository";

export class SeedRepository implements BenchmarkRepository {
  async getModels() {
    return models;
  }
  async getModel(slug: string) {
    return models.find((model) => model.slug === slug);
  }
  async getProviders() {
    return providers;
  }
  async getDimensions() {
    return dimensions;
  }
  async getLeaderboard() {
    return rankModels(models, providers, scoresByModel, dimensionWeights, rankDeltas);
  }
  async getCases() {
    return [complianceWorkflowCase];
  }
  async getCase(slug: string) {
    return slug === complianceWorkflowCase.slug ? complianceWorkflowCase : undefined;
  }
  async getTasks() {
    return tasks;
  }
  async getTask(key: string) {
    return tasks.find((task) => task.key === key);
  }
  async getAnswerKey(caseSlug: string) {
    return caseSlug === complianceWorkflowCase.slug ? answerKey : [];
  }
  async getSamplesForTask(key: string, caseSlug: string) {
    return samples.filter((sample) => sample.taskKey === key && sample.caseSlug === caseSlug);
  }
}
