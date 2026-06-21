# Architecture decision

## Recommendation

Next.js App Router with typed seed data behind `BenchmarkRepository`, deterministic scoring functions, read-only API routes and an optional Supabase implementation boundary.

## Why

The public product is read-heavy and content-shaped. Static rendering keeps the first pass cheap and reliable. The repository boundary makes live storage additive, while pure scoring keeps every aggregate reproducible.

## Rejected alternatives

- A database dependency in pass one: unnecessary operational fragility.
- A client-side SPA: additional JavaScript with no product benefit.
- An ORM: no complex transactional domain and no need for another abstraction.
- Persisting Overall: creates score drift and weakens traceability.

## Failure modes

- Synthetic results mistaken for observed performance: persistent disclaimers and no live attribution.
- Roster drift: primary-source ledger in `notes/model-roster.md`.
- Supabase enabled before mapping is implemented: explicit runtime error rather than silent mixed data.
- Public case overfitting: private holdouts must remain outside this repository and browser bundle.

## Next action

Implement run artefacts and typed Supabase query mappings, then execute one closed-book task across three models.
