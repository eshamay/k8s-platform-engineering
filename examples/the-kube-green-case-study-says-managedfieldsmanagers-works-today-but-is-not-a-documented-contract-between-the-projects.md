---
title: The kube-green case study says managedFieldsManagers works today but is not a documented contract between the projects
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [kube-green and Argo CD self-heal]
tags: [argo-cd, kube-green, managedfieldsmanagers, secondary-source, conflict-policy]
---

# The kube-green case study says managedFieldsManagers works today but is not a documented contract between the projects

## Scenario

Tools that scale workloads on a schedule, such as kube-green and kube-downscaler, change `replicas` and so collide with Argo CD's self-heal. A practitioner write-up on christianhuth.de, dated 2026-08 by its image path, walks through six ways to resolve it. [[sources/research-gap-m4-ssa-conflict-policy]]

## What the write-up says

It says that ignoring differences by manager, with Argo CD's `managedFieldsManagers` rule, has the fewest side effects, and that it "holds today, but it's not a documented contract between the two projects". The approach requires the other controller to apply with server-side apply under a stable manager name. URL: https://christianhuth.de/any-tool-that-scales-kubernetes-workloads-on-a-schedule-kube-green-kube-downscaler-snorlax-sleepcycles-nightshift-collides-with-argo-cds-self-heal-the-same-way-six-ways-through-it-via-a/

## Evidence quality

This is a SECONDARY-ONLY personal write-up. Argo CD's own documentation confirms that `managedFieldsManagers` ignores "all fields owned by `kube-controller-manager`" in its example, so the mechanism is documented, but the dependence on another project's manager name is the author's observation. It is one of the only two sources the dossier found on mixed GitOps and controller ownership, and no named adopter policy was found. See [[decisions/force-conflicts-or-surface-them-to-humans]] and [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]].

## Related

[[entities/argo-cd]], [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]], [[findings/controllers-fighting-over-fields-cause-revert-loops]]
