---
title: A loveholidays GKE upgrade from 1.10 to 1.12 overran its window by about five hours
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [shipwreck of GKE cluster upgrade]
tags: [postmortem, upgrade, gke, pdb, hpa, loveholidays]
---

# A loveholidays GKE upgrade from 1.10 to 1.12 overran its window by about five hours

## Scenario

loveholidays ran GKE with GitOps-managed manifests. In March 2019 the team planned a 2 to 2.5 hour upgrade from Kubernetes 1.10 to 1.12, two minor versions apart. [[sources/research-pitfalls-and-case-studies]]

## What happened

The upgrade took roughly seven hours. Node drains were slow because of emptyDir volumes, long `terminationGracePeriodSeconds` values, and missing PodDisruptionBudgets. A managed instance group was left in a confused state, and a stuck node-pool upgrade had to be cancelled with gcloud. An Ingress broke because of a bug for names of 44 to 47 characters, and an HPA stopped reporting CPU and scaled to its maximum. The chosen GKE version had also been pulled for elevated error rates. URL: https://deploy.live/blog/the-shipwreck-of-gke-cluster-upgrade/

## Lesson

The author's rule is "Always consult GKE release notes first before making upgrades to the cluster". The other lessons were to stay close to current versions, to keep test environments identical to production including naming, to use PDBs and safe-to-evict annotations and tuned grace periods, and to alert on HPA saturation and duplicate ReplicaSets. See [[concepts/pitfalls-and-case-studies]].

## Related

[[findings/a-new-cluster-wide-default-must-wait-until-existing-workloads-carry-explicit-values]]
