---
title: Terraform review builds that write a shared state file and out-of-order merges deleted production clusters
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: spotify-kubecon-2019-gke-cluster-deletion-transcript
    hash: 335758d1f8ed
    ingested: 2026-11-26
  - id: spotify-kubecon-2019-keynote-slides-with-notes
    hash: 118b356a260f
    ingested: 2026-11-26
aliases: []
tags: [terraform, state-file, ci, permissions, deletion, spotify, guardrail]
---

# Terraform review builds that write a shared state file and out-of-order merges deleted production clusters

## Observation

Spotify's team adopted Terraform in a shared repository that both cluster operators and cluster users edited. Three process flaws combined into two deletions. First, a pull request's review build imported the Asia cluster into the Terraform state file, and that state file affects what master builds do in production, so an unmerged change modified global state. Second, a cluster user's pull request that added three users to an existing RoleBinding file did not define the Asia cluster, and it merged first, so Terraform saw a cluster missing from configuration and deleted it. Third, when the team tried to recreate the cluster, the automation's service account lacked permissions, so they granted broad but different permissions than those used to import the other clusters. Cloud APIs return different properties for the same clusters under different permissions, Terraform's view of the clusters changed, and it deleted a second cluster. [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]], [[sources/spotify-kubecon-2019-keynote-slides-with-notes]]

## Guardrails the team adopted

The speaker lists changes made afterward: linters and validators for infrastructure code, the dry-run output posted as a pull request comment, required status checks, a requirement that the branch be up to date before merging so the dry run reflects the current master, required approving reviews, review builds that fail when the dry run contains words such as "destroy", and doing cluster destruction manually outside the shared repository. The team also moved from engineers running Terraform on laptops with personal owner accounts to a service account, which exposed the permission gap. [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]]

## Why it matters for reconciling tools

The same logic applies to any controller that deletes what its configuration no longer lists. A reconciler is only as safe as the single source it reads, the identity it runs as, and the checks between a merge and a delete. See [[examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact]], [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]], and [[concepts/self-healing-and-drift-detection]].

## Related pages

[[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[concepts/declarative-vs-imperative]].
