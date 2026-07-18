# Architecture decision

## Recommendation

Keep the public product statically backed by a versioned observed-results artefact. Run the benchmark offline through OpenRouter, persist immutable request, response, routing, cost and scoring evidence, then publish only the reviewed aggregate needed by the site.

## Why

The site is read-heavy and the mini benchmark is a dated research release. A database would add operational state without improving reproducibility. The runner and scoring modules provide the audit trail; the public JSON provides a stable deployment input.

## Evaluation flow

```text
Norwyn Controls case + versioned prompt
                  |
                  v
OpenRouter candidate runs, two samples per model
                  |
                  v
local schema validation + immutable generation artefacts
                  |
                  v
deterministic checks + blinded calibrated cross-family judges
                  |
                  v
per-sample scorecards + observed-results.json
                  |
                  v
Next.js pages and read-only API
```

## Execution controls

- Catalogue and endpoint metadata are snapshotted before execution.
- Candidate routes must support the structured-output and reasoning parameters used by the protocol.
- The selected endpoint is pinned and fallback is disabled.
- Candidate reasoning is capped at 2,048 tokens where supported; judge reasoning is capped at 1,024.
- Kimi K3 uses its mandatory maximum reasoning setting and carries an INT4 route qualification.
- A conservative ledger reserves worst-case request cost before dispatch as a process-local USD 7 guard. The dedicated
  OpenRouter key's USD 7.50 cap is the authoritative cross-process limit.
- Every accepted output must stop normally, satisfy the provider schema and pass local validation.
- Schema compliance is also scored for task completeness and instruction-injection resistance.

## Scoring controls

- Eleven metrics are reference-scored for value, evidence and protocol.
- Six ranked risks are scored for issue coverage, ordering, evidence precision and action linkage.
- Four diligence actions are scored for validity, budget, duration, ordering and decision utility.
- Judges see only the packet, anchors and IC note. Model identity, price and latency are hidden.
- Judges must separate strong and weak anchors by the calibration threshold; invalid judgements are rejected.
- Same-family judges do not contribute to a candidate's score.
- Overall is derived from the eight weighted dimensions and never stored as an independent source of truth.
- Complete two-sample results are ranked. Gaps below two overall points are marked as provisional ties.

## Failure modes

- **Endpoint unavailable:** retain the failed or partial artefact and exclude the model from ranked positions.
- **Billable invalid response:** account for the cost, retain the rejected output and do not silently retry without an explicit billable-retry flag.
- **Ambiguous timeout:** reserve the maximum request cost until provider usage can be reconciled.
- **Schema adaptation:** distinguish route-compatible response schema changes from local validation and scored compliance. Do not relax task requirements to manufacture a score.
- **Judge contamination:** exclude same-family judges and reject failed anchor calibration.
- **Over-interpretation:** label the release as directional because it contains one case and two samples per model.

## Deferred boundary

`BenchmarkRepository` still isolates presentation from storage. Supabase remains available for a future multi-case, multi-run service, but is not required for the v0.4 mini benchmark.
