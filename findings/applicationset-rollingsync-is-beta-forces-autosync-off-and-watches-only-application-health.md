---
title: "ApplicationSet RollingSync is Beta, forces autosync off, and watches only Application health"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, applicationset, progressive-sync, rollingsync]
---

# ApplicationSet RollingSync is Beta, forces autosync off, and watches only Application health

## Observation

The Progressive Syncs page marks the feature "Beta Feature (Since v3.3.0)". Its RollingSync strategy "will force all generated Applications to have autosync disabled", and it respects sync windows. It does not integrate with Rollout controllers: "The feature only interacts with the health of managed Applications." An Application that no step selects is left out: "If an Application is not selected in any step, it will be excluded from the rolling sync". URL: https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/applicationset/Progressive-Syncs.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## Why it matters

Staged rollout across a fleet through ApplicationSets therefore turns off the self-heal and automated prune that a team may rely on for the same Applications, and its health gate is only as good as the Application health that the generic checks or custom Lua scripts report, see [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]. An Application missing from every step silently never syncs through this path.

## Related

[[entities/argo-cd]], [[findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes]]
