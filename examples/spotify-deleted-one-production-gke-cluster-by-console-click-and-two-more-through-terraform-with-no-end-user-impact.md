---
title: Spotify deleted one production GKE cluster by console click and two more through Terraform with no end-user impact
type: example
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
aliases: [Spotify cluster deletions]
tags: [postmortem, spotify, gke, terraform, disaster-recovery, resilience, state-file]
---

# Spotify deleted one production GKE cluster by console click and two more through Terraform with no end-user impact

## Scenario

Spotify was migrating its stateless backend services to Google Kubernetes Engine and had three production clusters, one each in the US, Europe and Asia, each backed up every hour. Teams were told to migrate only part of each service, and Kubernetes usage was marked beta inside the company. The infrastructure engineers who ran the clusters called themselves the cluster operators, and the feature teams that used them were the cluster users. [sources/spotify-kubecon-2019-gke-cluster-deletion-transcript](../sources/spotify-kubecon-2019-gke-cluster-deletion-transcript.md)

## The first deletion, November 2018

An operator wanted to test a GKE feature with production-like settings and opened two browser tabs, one for a production cluster and one for a new test cluster. After finishing the test they deleted what they believed was the test cluster, but the production tab was open, and a 50-node cluster running dozens of workloads began to disappear. GKE gives no way to stop a deletion once it starts. Restoration took 3 hours 15 minutes, longer than it should have, because the cluster creation scripts had bugs, the documentation was incomplete and sometimes wrong, and the creation process could not resume after failing partway. [sources/spotify-kubecon-2019-gke-cluster-deletion-transcript](../sources/spotify-kubecon-2019-gke-cluster-deletion-transcript.md), [sources/spotify-kubecon-2019-keynote-slides-with-notes](../sources/spotify-kubecon-2019-keynote-slides-with-notes.md)

## The second incident, about a month later

The team decided to codify its clusters with Terraform so the mistake could not recur. The chain of events is analyzed in [findings/terraform-review-builds-that-write-a-shared-state-file-and-out-of-order-merges-deleted-production-clusters](../findings/terraform-review-builds-that-write-a-shared-state-file-and-out-of-order-merges-deleted-production-clusters.md). In short, a review build for an unmerged pull request imported the Asia cluster into a state file that production builds also used, a cluster user's unrelated pull request that did not mention the Asia cluster merged first, and Terraform deleted the Asia cluster. When the team tried to recreate it, they widened the service account's permissions, Terraform saw the other clusters with different properties under the new permissions, and it deleted a second cluster. Two of three production clusters were gone, and the incident ran from about 8 PM to 5 AM.

## Why users did not notice

The team credits three deliberate choices rather than luck. Teams ran only part of each service on Kubernetes and the rest on ordinary virtual machines. Spotify's internal service discovery registered pod IPs it polled from Kubernetes endpoints instead of using Kubernetes Service addresses. When a cluster disappeared the discovery system was restarted without it and clients received only the non-Kubernetes instances. See [findings/partial-migration-and-pod-ip-service-discovery-let-spotify-fail-over-when-its-kubernetes-clusters-were-deleted](../findings/partial-migration-and-pod-ip-service-discovery-let-spotify-fail-over-when-its-kubernetes-clusters-were-deleted.md). Hourly backups and rehearsed restores were also essential, and a culture of learning without blame kept the team improving. Afterward, restoring a larger cluster took about an hour.

## What this example teaches

Infrastructure as code does not remove the risk of deletion. It moves it into the state file, the review pipeline and the permissions of the automation identity. The second incident is a close relative of the Skyscanner outage, in [examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services](skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services.md), where a faithful reconciler applied a bad desired state. Both show why destructive operations need guards that are separate from the tool doing the reconciling. The impact was internal only: extra VMs, updated hard-coded master IPs, and refreshed credentials. See also [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md).

## What is not established

Dates are the speaker's: November 2018 for the first deletion and "a month later" for the second. The talk is self-reported and the end-user claim is that no reports reached the team.
