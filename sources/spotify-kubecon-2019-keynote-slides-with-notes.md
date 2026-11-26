---
title: Spotify KubeCon Europe 2019 keynote slides with speaker notes
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: spotify-kubecon-2019-keynote-slides-with-notes
    hash: 118b356a260f
    ingested: 2026-11-26
aliases: [Spotify talk slides]
tags: [postmortem, spotify, gke, terraform, slides, kubecon]
---

# Spotify KubeCon Europe 2019 keynote slides with speaker notes

> [!NOTE]
> **Raw file:** `raw/KubeCon Europe 2019 Keynote - David Xia - How Spotify Accidentally Deleted All Its Kube Clusters with No User Impact slides with notes.pdf` (38 pages)<br>
> **Kind:** The speaker's own slide deck with speaker notes, user-supplied<br>
> **Author:** David Xia, Spotify infrastructure engineer<br>
> **Dated:** 2019-05-22 (slide header)<br>
> **Ingested:** 2026-11-26

## Summary

The deck is the written form of the talk transcribed in [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]]. Its speaker notes match the spoken account and add precise wording and dates that the auto-generated transcript lacks. It is treated as the more reliable text where the two overlap.

## Key claims

- The deck is dated 2019-05-22 and titled "How Spotify Accidentally Deleted All Its Kube Clusters with No User Impact", by David Xia. The notes open by saying the team deleted production Kubernetes clusters "Accidentally. Twice. With little to no end user impact."
- The first deletion was in November 2018: a 50-node production cluster running dozens of workloads, deleted from the wrong of two browser tabs. The slide "How Do I Make It Stop?" answers "You don't." Restoration took 3.25 hours because of script bugs, incomplete or incorrect documentation, and a non-resumable creation process.
- The second story is headed "A Month Later" and lists three causes: trying to prevent accidental deletions by codifying clusters, unknowingly modifying global Terraform state during review builds, and two pull requests merged out of order. The follow-on slide "Can't Get Any Worse, Right?" lists a failed recreation for lack of permissions, different permissions granted to make it work, and Terraform's view of the clusters changing. The notes state that of three production clusters, two thirds were wiped out. [[findings/terraform-review-builds-that-write-a-shared-state-file-and-out-of-order-merges-deleted-production-clusters]]
- Developer impact was one team creating more non-Kubernetes VMs, the cluster operators updating hard-coded master IPs, and everyone refreshing credentials. The notes say no one reported end-user impact from either deletion.
- The "What We Did Right" slide gives three reasons: planned for failure, migrated gradually, and a culture of learning. The service-discovery slides say Spotify's internal system used pod IPs and not the Kubernetes Service IP, polled Services' Endpoints, was restarted when a cluster was deleted, and then gave clients only non-Kubernetes instances. [[findings/partial-migration-and-pod-ip-service-discovery-let-spotify-fail-over-when-its-kubernetes-clusters-were-deleted]]
- The best-practices slides list backups with tested restores, codified infrastructure (linters and validators, dry-run output as a pull request comment, required status checks, up-to-date branches, required approving reviews, failing review builds on keywords like "destroy"), and disaster-recovery tests. "Practice Makes Perfect" gives 3.25 hours for the first restore, about 8 PM to 5 AM for the second incident, and about one hour now for larger clusters. [[examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact]]

## Limits of this source

It is a conference deck, so the numbers are self-reported by the speaker. Images are decorative diagrams and were read from the extracted text layer. The deck does not give an exact date for the second incident.
