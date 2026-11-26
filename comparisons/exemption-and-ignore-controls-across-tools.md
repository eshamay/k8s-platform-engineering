---
title: Exemption and ignore controls across tools
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [comparison, drift, ignore, adoption]
---

# Exemption and ignore controls across tools

Every stack offers some way to say "do not fight this field or resource". The mechanisms differ in scope. [[sources/research-self-healing-and-drift-detection]]

| Scope | [[entities/flux]] | [[entities/argo-cd]] | [[entities/crossplane]] |
|---|---|---|---|
| Ignore specific fields | `driftDetection.ignore` with JSON Pointers and target selectors (HelmRelease) | `ignoreDifferences` by JSON pointer, JQ path, or `managedFieldsManagers`, per app or system-wide | Not described |
| Per-object opt-out | `kustomize.toolkit.fluxcd.io/ssa` annotation: `Ignore` or `IfNotPresent` | Not described | `managementPolicies` limit actions per resource |
| Observe without changing | `warn` drift mode (HelmRelease) | Manual sync (OutOfSync only) | `Observe` policy |
| Transfer field ownership | kustomize-controller `--override-manager` and, since v1.10.0, `--override-manager-before-dry-run` (documented); helm-controller `--override-manager` (changelog entry since v1.5.0) | `managedFieldsManagers` to ignore chosen managers | Not described |
| Stop everything | `suspend` | Turn off automated sync | `crossplane.io/paused` annotation |
| Dangerous correction | `force` recreates on immutable changes, use temporarily | `prune` off by default, rollback blocked under auto sync | `Delete` policy and finalizers control external deletion |

## Reading the table

An important limit is order of operations: Flux's `driftDetection.ignore` applies after the dry-run, so it cannot rescue a dry-run that already failed because of field ownership. See [[findings/field-ownership-blocks-drift-correction]]. For the pitfalls these controls address, see [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[findings/late-initialized-fields-create-false-drift]], and [[findings/multiple-writers-on-one-object]]. ACK adoption controls were not read. See [[comparisons/drift-detection-mechanisms-across-tools]] and [[decisions/staged-adoption-of-automated-drift-correction]].

## Server-side apply controls

Server-side apply adds Flux's `ssa` annotation values and Strip and Adopt ignore rules, Argo CD's Server-Side Diff as an alternative to `ignoreDifferences` for server defaults, and Kluctl's per-field force annotations. [[sources/research-server-side-apply-and-field-ownership]] See [[comparisons/ssa-conflict-policy-across-tools]].

## Update from the o1 dossier, 2026-11-26

Argo CD `ignoreDifferences` takes JSON patches, JQ and `managedFieldsManagers`, can be set system-wide in `argocd-cm`, and by default changes only the diff, see [[findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist]]. Flux `.spec.ignore` takes JSON Pointer paths and, without a target selector, matches every object, see [[findings/a-flux-ignore-rule-without-a-target-selector-matches-every-object-the-kustomization-manages]]. Flux also has the per-object `force` and `prune: disabled` annotations. Neither tool's pages read describe an observe-only mode like Crossplane's Observe. Argo CD's closest equivalents are manual sync with automation off and the ApplicationSet create-only policy, whose limit is in [[findings/the-applicationset-create-only-policy-does-not-stop-owner-reference-deletion-of-applications]]. [[sources/research-gap-o1-argocd-flux-gitops]]
