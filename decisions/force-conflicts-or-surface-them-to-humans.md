---
title: Force conflicts or surface them to humans
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [decision, server-side-apply, conflict, gitops]
---

# Force conflicts or surface them to humans

## Status

Active and evidence-only. This records a decision point described by the Kubernetes maintainers and visible in tool defaults, not a choice made by this wiki. It makes no recommendation.

## Context

A writer applying with server-side apply receives a conflict when another manager owns a field it wants to set. It can force the write, drop the field, or share ownership by setting the same value. The right default depends on whether the writer is a controller or a CD system. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Options

The first option is to force. The Kubernetes documentation says "It is strongly recommended for controllers to always force conflicts on objects that they own and manage", because a controller usually cannot resolve a disagreement about fields it owns. The second option is to surface the conflict to a human. The maintainer blog argues that "CI/CD systems are literally controllers, but for the purpose of apply, they are more like users", so they should show conflicts and let people reject a hotfix by force-applying, accept it, or accept then reject. A third option is to decide per field, as Kluctl does. See [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md).

## Decision guidance

The dossier observes that Argo CD and Flux both force by default, then provide exemptions such as `ignoreDifferences`, Flux ignore rules, and `ssa` annotations. The sources do not settle the best default for platform teams that run GitOps and in-cluster controllers on the same objects. Correction note, 2026-11-26: an earlier version of this section offered "a reasonable reading" of forcing for exclusively owned fields and exempting the rest. No source supports that as a recommendation, so it is withdrawn, and the evidence below is grouped by position without a ranking. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

**Force by default (the GitOps tool wins).** The Kubernetes documentation strongly recommends that controllers always force conflicts on objects they own. Argo CD runs `--server-side --force-conflicts` and ignores `Force=true`, helm-controller always forces, Cluster API's topology controller forces under `capi-topology`, and kro forces template applies. A practitioner blog (SECONDARY-ONLY, 2026-09-16) draws the consequence that "the conflict mechanism protects nobody from Argo CD", and that the boundary is drawn in the repository by not declaring the field.

**Surface or yield (the controller or a human decides).** The Kubernetes documentation lists three resolution options and the HPA handover. Flux's ignore rules strip a field when another Apply-type manager owns it and adopt the live value when Flux is the sole owner. kro's patch nodes apply without force and its conflict-detection mode refuses to steal from another Graph. Config Connector reads other managers' fields as user intent. Argo CD's `managedFieldsManagers` ignore rule keys off a named manager, which the kube-green case study calls "not a documented contract between the two projects" ([examples/the-kube-green-case-study-says-managedfieldsmanagers-works-today-but-is-not-a-documented-contract-between-the-projects](../examples/the-kube-green-case-study-says-managedfieldsmanagers-works-today-but-is-not-a-documented-contract-between-the-projects.md)).

**Limits of both.** A forced apply failed to revert a Service port edit in [examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port](../examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port.md), and Cluster API documents infinite reconcile for co-authored list slices ([findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items](../findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items.md)). Neither is solved by choosing force or yield.

**Not found.** A named adopter's written policy for mixed GitOps and controller ownership, and SIG API Machinery discussion of parsing `managedFields` to ignore conflicts. For the narrower choice between force and strip-or-adopt see [decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field](force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field.md).

## Consequences

Forcing keeps the cluster matching Git but can start revert loops with controllers that own the same field. Surfacing conflicts protects hotfixes but makes automation stop and wait for a person. See [findings/forcing-conflicts-hides-disagreements-between-writers](../findings/forcing-conflicts-hides-disagreements-between-writers.md), [examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict](../examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict.md), and [findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md).
