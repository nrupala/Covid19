# Contributing — PR-flow discipline

Direct pushes to `master` are retired. Every change lands through a pull request.

1. Create a feature branch from `master`.
2. Make the change; update docs in the same change set as behavior changes.
3. Add a CHANGELOG entry under `## [Unreleased]` (Keep a Changelog format).
4. Bump semver for the change (patch = fix, minor = feature, major = breaking)
   in `package.json` `version`.
5. Open the PR as a **draft**, then mark it ready when verification is green:
   draft PR → tests green → owner merges. Only the owner merges.
6. Record exact verification commands and observed results in the PR description.
   A green run is evidence; a claim without its command and output is not.
7. Merge commits reference the PR number; releases are tagged `vX.Y.Z` after
   merge.
8. Never commit secrets, tokens, credentials, or private keys.

Note: this repository has been inactive since 2021; treat the README's
documented API endpoints as unverified until behavior-checked.
