# Model roster provenance

Point-in-time roster checked against the OpenRouter catalogue and endpoint API on 18 July 2026. The immutable run snapshot records catalogue metadata, available routes, prices, context lengths and supported parameters used for preflight.

## Candidate models

| Provider family | Display name     | OpenRouter model ID         |
| --------------- | ---------------- | --------------------------- |
| Anthropic       | Claude Fable 5   | `anthropic/claude-fable-5`  |
| OpenAI          | GPT-5.6 Sol      | `openai/gpt-5.6-sol`        |
| Moonshot AI     | Kimi K3          | `moonshotai/kimi-k3`        |
| Anthropic       | Claude Opus 4.8  | `anthropic/claude-opus-4.8` |
| xAI             | Grok 4.5         | `x-ai/grok-4.5`             |
| Google          | Gemini 3.5 Flash | `google/gemini-3.5-flash`   |
| Z.ai            | GLM 5.2          | `z-ai/glm-5.2`              |
| Alibaba         | Qwen3.7 Max      | `qwen/qwen3.7-max`          |
| DeepSeek        | DeepSeek V4 Pro  | `deepseek/deepseek-v4-pro`  |

## Judge models

| Provider family | Role                     | OpenRouter model ID             |
| --------------- | ------------------------ | ------------------------------- |
| OpenAI          | Blinded calibrated judge | `openai/gpt-5.6-terra`          |
| Anthropic       | Blinded calibrated judge | `anthropic/claude-sonnet-5`     |
| Google          | Blinded calibrated judge | `google/gemini-3.1-pro-preview` |

Judges score model-hidden IC notes against strong and weak anchors on a 0 to 4 scale. A judge from the same provider family as the candidate is excluded from that candidate's aggregate.

## Routing policy

- A route must support `max_tokens`, `reasoning`, `response_format` and `structured_outputs`.
- The runner pins the selected eligible endpoint, disables fallback and stores the requested and returned model and provider metadata.
- The common reasoning budget is 2,048 tokens for candidates and 1,024 for judges.
- Kimi K3 is the explicit exception because its OpenRouter route requires maximum reasoning.
- A model without a complete, valid scored run remains recorded as partial or unavailable and is excluded from ranking.

## Kimi K3 qualification

The 18 July result refers specifically to Kimi K3 served by Moonshot AI through OpenRouter using the available INT4 route. Full model weights were not yet released at the benchmark date. It must not be described as a full-precision or downloadable-weights result.

## Sources

- OpenRouter model catalogue: <https://openrouter.ai/api/v1/models>
- OpenRouter provider routing: <https://openrouter.ai/docs/features/provider-routing>
- OpenRouter model pages: <https://openrouter.ai/models>

Provider identity marks use Simple Icons where available, with deterministic monogram fallbacks. Display metadata is secondary to the persisted model and endpoint snapshot for the dated run.
