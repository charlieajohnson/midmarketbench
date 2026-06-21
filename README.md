# MidMarketBench

MidMarketBench evaluates whether frontier AI models can produce useful investment work for European lower-mid-market B2B software workflows.

This repository is the pass-one product shell: a fully wired public frontend, read-only API, typed synthetic case data, deterministic score aggregation and a Supabase schema for the operational benchmark. It does not run providers or claim observed model performance.

## Run locally

Requirements: Node.js 20 or later and npm 10 or later.

```bash
cp .env.example .env.local
```

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## Verify

```bash
npm run check
```

Optional browser tests:

```bash
npx playwright install chromium
```

```bash
npm run test:e2e
```

## Architecture

```text
Pages and API routes
        │
BenchmarkRepository
   ┌────┴────┐
Seed data   Supabase (pass two)
        │
Pure dimension scoring
```

- Next.js 15 App Router and React 19.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Tailwind 4 tokens plus small, local component CSS.
- Server Components by default. Client JavaScript is limited to sorting, charts, theme and banner dismissal.
- `SeedRepository` is the default and needs no external service.
- `SupabaseRepository` is deliberately gated until typed query mappings are implemented.
- Overall is always derived from dimension scores. It is not stored in TypeScript or SQL.

The compressed decision record is in [`notes/architecture.md`](notes/architecture.md).

## Public API

| Route                     | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `GET /api/v1/health`      | Service and methodology status                |
| `GET /api/v1/leaderboard` | Ranked synthetic results with derived Overall |
| `GET /api/v1/models`      | Current roster metadata                       |
| `GET /api/v1/cases`       | Public synthetic cases                        |
| `GET /api/v1/cases/:slug` | One public case and packet manifest           |

All API routes are read-only in pass one.

## Data integrity

- The company and all deal data are synthetic.
- Scores and ranks are illustrative.
- Model names were checked against primary provider pages on 21 June 2026. See [`notes/model-roster.md`](notes/model-roster.md).
- Public case data lives in `data/`; private holdouts must never be added to this repository.
- Copy checks prohibit em dashes and italic markup in product copy.

## Supabase handover

1. Run `supabase/migrations/0001_init.sql`.
2. Run `supabase/seed.sql`.
3. Generate database types into `lib/supabase/types.ts`.
4. Implement typed query mappings in `SupabaseRepository`.
5. Set `USE_SUPABASE=true` and provide the public URL and anonymous key.

RLS exposes public display records as read-only. Evaluation writes require a private service role and are outside the browser client.

## Next operational slice

Build a provider-agnostic evaluation runner that stores model, prompt hash, parameters, raw output, latency and token use. Run one closed-book task across three models. Add deterministic checks, blind judge scoring and human calibration before replacing synthetic standings.
