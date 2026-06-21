insert into public.providers (id, name, slug, website) values
  ('openai', 'OpenAI', 'openai', 'https://openai.com'),
  ('anthropic', 'Anthropic', 'anthropic', 'https://anthropic.com'),
  ('google', 'Google', 'google', 'https://deepmind.google'),
  ('xai', 'xAI', 'xai', 'https://x.ai'),
  ('zai', 'Z.ai', 'zai', 'https://z.ai'),
  ('bytedance', 'ByteDance', 'bytedance', 'https://seed.bytedance.com'),
  ('alibaba', 'Alibaba', 'alibaba', 'https://qwen.ai'),
  ('deepseek', 'DeepSeek', 'deepseek', 'https://deepseek.com');

insert into public.dimensions (key, label, short_label, weight, description, high_descriptor, low_descriptor) values
  ('grounding', 'Grounding', 'G', 0.15, 'Claims are supported by packet evidence.', 'Specific evidence and attribution.', 'Generic or invented claims.'),
  ('commercial_judgement', 'Commercial judgement', 'CJ', 0.20, 'Identifies what matters economically.', 'Prioritises decision impact.', 'Misses the economic engine.'),
  ('scepticism', 'Scepticism', 'Sc', 0.15, 'Challenges weak claims and narratives.', 'Tests key claims.', 'Accepts management framing.'),
  ('numerical_sanity', 'Numerical sanity', 'Num', 0.15, 'Reconciles financial and operating data.', 'Connects metrics correctly.', 'Confuses or ignores metrics.'),
  ('risk_discovery', 'Risk discovery', 'Risk', 0.15, 'Finds hidden and second-order risks.', 'Connects evidence across files.', 'Lists generic risks.'),
  ('question_generation', 'Question generation', 'Q', 0.10, 'Asks recommendation-changing questions.', 'Specific and prioritised.', 'Generic checklist.'),
  ('european_context', 'European context', 'EU', 0.05, 'Accounts for European fragmentation.', 'Country-level nuance.', 'US assumptions.'),
  ('output_usefulness', 'Output usefulness', 'Use', 0.05, 'Creates reusable deal-team work.', 'Memo-ready and actionable.', 'Verbose and generic.');

insert into public.models (id, provider_id, slug, name, version, release_month, context_window, open_weights, source_url) values
  ('gpt-5-5', 'openai', 'gpt-5-5', 'GPT-5.5', 'gpt-5.5', '2026-04-01', 'Provider listed', false, 'https://developers.openai.com/api/docs/guides/latest-model'),
  ('claude-opus-4-8', 'anthropic', 'claude-opus-4-8', 'Claude Opus 4.8', '4.8', '2026-03-01', 'Provider listed', false, 'https://platform.claude.com/docs/en/about-claude/models/overview'),
  ('gemini-3-5-flash', 'google', 'gemini-3-5-flash', 'Gemini 3.5 Flash', '3.5 Flash', '2026-05-01', 'Provider listed', false, 'https://ai.google.dev/gemini-api/docs/models'),
  ('gpt-5-4', 'openai', 'gpt-5-4', 'GPT-5.4', 'gpt-5.4', '2026-03-01', 'Provider listed', false, 'https://developers.openai.com/api/docs/models'),
  ('claude-opus-4-7', 'anthropic', 'claude-opus-4-7', 'Claude Opus 4.7', '4.7', '2026-02-01', 'Provider listed', false, 'https://platform.claude.com/docs/en/about-claude/models/overview'),
  ('gemini-3-1-pro', 'google', 'gemini-3-1-pro', 'Gemini 3.1 Pro', '3.1 Pro', '2026-01-01', 'Provider listed', false, 'https://ai.google.dev/gemini-api/docs/models'),
  ('grok-4-20', 'xai', 'grok-4-20', 'Grok 4.20', '4.20', '2026-03-01', 'Provider listed', false, 'https://docs.x.ai/docs/models'),
  ('glm-5-2', 'zai', 'glm-5-2', 'GLM-5.2', '5.2', '2026-05-01', 'Provider listed', true, 'https://docs.z.ai'),
  ('qwen3-7-max', 'alibaba', 'qwen3-7-max', 'Qwen3.7 Max', '3.7 Max', '2026-03-01', 'Provider listed', false, 'https://qwen.ai'),
  ('seed-2-0-pro', 'bytedance', 'seed-2-0-pro', 'Seed 2.0 Pro', '2.0 Pro', '2026-04-01', 'Provider listed', false, 'https://seed.bytedance.com'),
  ('deepseek-v4-pro', 'deepseek', 'deepseek-v4-pro', 'DeepSeek V4 Pro', 'V4 Pro', '2026-04-01', '1M', true, 'https://api-docs.deepseek.com/quick_start/pricing'),
  ('gpt-5-2-pro', 'openai', 'gpt-5-2-pro', 'GPT-5.2 Pro', 'gpt-5.2-pro', '2026-02-01', 'Provider listed', false, 'https://developers.openai.com/api/docs/models');

insert into public.benchmark_versions (label, released_at, methodology_notes)
values ('v0.3', '2026-06-21', 'Synthetic product demonstration. Dimension scores only; Overall is derived.');

insert into public.cases (id, slug, name, sector, subsector, geography, company_stage, arr_eur_m, growth_rate, ebitda_margin, ownership_context, difficulty, skills, summary)
values ('case_001', 'compliance-workflow-saas', 'Veritalis Compliance Cloud', 'B2B Software', 'Compliance workflow', 'DACH, UK, Benelux', 'Lower mid-market', 18.4, 0.24, 0.12, 'Founder-owned', 'medium', array['commercial_judgement','retention_analysis','tam_critique','red_flag_detection','ic_memo_drafting'], 'Synthetic compliance workflow software case with retention, services mix, concentration and TAM traps.');

insert into public.tasks (key, name, prompt, expected_output, what_good_looks_like, failure_modes) values
  ('investment-summary', 'Investment summary', 'Produce a one-page investment summary for a European lower-mid-market B2B software investor.', '["Company overview","Investment thesis","Key positives and concerns","Operating highlights","Preliminary recommendation"]', '["Finds the value creation angle","Challenges weak management claims","Separates evidence from assumption"]', '["Rewrites the CIM","Uses generic market language","Ignores revenue quality"]'),
  ('red-flag-detection', 'Red flag detection', 'Identify the ten most important diligence risks and rank them by severity.', '["Risk","Severity","Evidence","Why it matters","Diligence action"]', '["Ranks by decision impact","Connects evidence across files"]', '["Generic risk list","Misses concentration or services contamination"]'),
  ('retention-quality', 'Retention quality', 'Assess whether the retention picture is credible and separate price from volume.', '["Metric assessment","Cohort analysis","Price-volume bridge","Missing evidence"]', '["Separates NRR from logo retention","Identifies concentrated expansion"]', '["Treats NRR as broad-based","Ignores cohort decay"]'),
  ('tam-critique', 'TAM critique', 'Assess the credibility of the stated TAM and size the reachable market.', '["Stated TAM","Serviceable market","Reachable market","Questions"]', '["Narrows to the actual ICP","Accounts for European fragmentation"]', '["Accepts broad TAM","Applies US assumptions"]'),
  ('management-qa', 'Management Q&A', 'Prepare prioritised management questions that could change the recommendation.', '["Priority","Question","Decision relevance","Evidence sought"]', '["Sharp and answerable questions","Starts with recommendation-changing uncertainty"]', '["Generic checklist","Narrative questions"]');

insert into public.case_tasks (case_id, task_key)
select 'case_001', key from public.tasks;
