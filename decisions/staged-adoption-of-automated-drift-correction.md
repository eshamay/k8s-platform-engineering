---
title: Staged adoption of automated drift correction
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [drift, adoption, safety, gitops]
---

# Staged adoption of automated drift correction

## Status

Pattern drawn from tool documentation and one vendor blog, not an ADR authored by this wiki. [[sources/research-self-healing-and-drift-detection]]

## Context

Automatic correction can revert an intentional emergency change, delete objects through prune, or recreate objects on immutable-field changes. Teams adopting a tool need to see drift before they let the tool act on it.

## Decision

Move through three stages. First observe: Flux's `warn` drift mode emits events only, Argo CD manual sync shows OutOfSync without applying, Crossplane's `Observe` policy imports without modifying, and tofu-controller can run detection-only. Then correct selectively: turn on `selfHeal` or drift mode `enabled` for stateless or well-understood workloads, keeping Argo CD `prune` off until trusted. Finally enforce broadly, with documented ignore rules for fields owned by other controllers.

## Consequences

Staged adoption delays the benefit of enforcement and requires someone to read the drift reports. It reduces surprise reverts, and it surfaces the second-writer problems early so ignore rules can be written before enforcement. See [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[findings/remediation-can-amplify-an-outage]], and [[findings/unintended-deletion-through-prune]].

## Related

[[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]], [[comparisons/exemption-and-ignore-controls-across-tools]], [[entities/tofu-controller]], [[concepts/self-healing-and-drift-detection]]

## Evidence from the GitOps incidents dossier

A reported production incident supports staging: self-heal skipped a migration hook on two of five regional Applications, and one mitigation is turning self-heal off for those Applications, see [[decisions/make-a-migration-a-managed-resource-or-turn-self-heal-off]] and [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].
