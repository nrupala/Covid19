# Test plan — Covid19

## Scope

This is a legacy 2020 Cloudflare Worker serving India COVID-19 data.
Its data routes depend on a Workers KV namespace (the `COVID19` global
behind `store.js`) and on upstream sources (MoHFW, SteinHQ,
covid19india.org) that no longer exist, so the routes cannot be booted
or exercised headlessly — that limitation is recorded here rather than
papered over with a fake smoke test.

What is tested is the layer every route returns through and is keyed
on: the response helpers in `api.js` (`rawResponse`, `successResponse`,
`errorResponse` — the success/failure envelopes and headers every API
response carries) and the store-key constants in `constants.js`. These
run on Node's fetch-API globals, the same primitives the Workers
runtime provides, with no KV and no network.

## Suites

| Suite | Covers | Run it | Runs in CI |
|---|---|---|---|
| Unit tests (`test/api.test.mjs`, Node's built-in test runner) | Raw responses pass strings through and serialise objects with the JSON/CORS headers; the success envelope carries `success: true`, the data and parseable refresh timestamps; the error envelope carries `success: false`, the details and the requested status; store keys are unique non-empty strings | `node --test test/api.test.mjs` | Yes — CI workflow |

## CI gates

- CI workflow (`.github/workflows/ci.yml`) on every push and pull
  request to `master`: the unit suite must pass.
- CodeQL workflow (`.github/workflows/codeql.yml`,
  javascript-typescript, buildless) on push, pull request and a
  weekly schedule; findings are dispositioned per the house alert
  SLA (fix, or a dismissal with the reason recorded).
- No linter is configured for this legacy codebase; adding one is a
  maintainer decision for any future active development, recorded
  here instead of claimed.

## Cadence

- Every pull request: the unit suite, and CodeQL.
- Weekly: scheduled CodeQL run.
- Every release candidate: the release-readiness run (checker +
  evidence reads), per the house Release-Readiness Standard.

## Coverage bar

No numeric floor; new functionality lands with tests per CONTRIBUTING.
