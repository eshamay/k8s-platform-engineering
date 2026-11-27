---
title: Spotify KubeCon Europe 2019 keynote transcript, deleting production GKE clusters with no user impact
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: spotify-kubecon-2019-gke-cluster-deletion-transcript
    hash: 335758d1f8ed
    ingested: 2026-11-26
aliases: [Spotify cluster deletion talk]
tags: [postmortem, spotify, gke, terraform, disaster-recovery, kubecon]
---

# Spotify KubeCon Europe 2019 keynote transcript, deleting production GKE clusters with no user impact

> [!NOTE]
> **Raw file:** `raw/spotify-kubecon-2019-gke-cluster-deletion-transcript.md`<br>
> **Kind:** User-supplied auto-generated transcript of the talk video (YouTube ix0Tw8uinWs), with caption errors such as "kerbin IDs" for Kubernetes<br>
> **Speaker:** David (Xia, per the companion slide deck, see [sources/spotify-kubecon-2019-keynote-slides-with-notes](spotify-kubecon-2019-keynote-slides-with-notes.md))<br>
> **Talk date:** 2019-05-22 per the slide deck; incidents in November 2018 and about a month later<br>
> **Ingested:** 2026-11-26

## Summary

An infrastructure engineer at Spotify tells two stories about accidentally deleting production Google Kubernetes Engine clusters: one by clicking delete in the wrong browser tab, and one while the team adopted Terraform to prevent exactly that mistake. Neither deletion reached end users. The talk explains why, and what the team changed afterward. It is the first primary account in this wiki of an infrastructure-as-code adoption deleting production clusters.

## Key claims

- Spotify had over 100 million subscribers, over 200 million monthly active users, more than a thousand developers deploying to over 10,000 virtual machines, and used Google Cloud Platform. The speaker's team, the cluster operators, built GKE infrastructure for feature teams, the cluster users, who were migrating stateless backends. [examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact](../examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact.md)
- At the time there were three production clusters, one each in the US, Europe and Asia, and each was backed up every hour.
- In November 2018 the speaker, wanting to test a GKE feature with production-like configuration, opened two browser tabs, one for a production cluster and one for a test cluster, and deleted a 50-node production cluster running dozens of workloads from the wrong tab. GKE offers no way to stop a deletion once it starts.
- Restoring the cluster and its integrations took 3 hours 15 minutes. It was slow because the cluster creation scripts had bugs, the documentation was incomplete and sometimes wrong, and the creation process could not resume after a partial failure.
- A month later, while adopting Terraform, the team imported the Asia cluster into the state file in a pull request's review build, which changed global state that affects production. A cluster user's separate pull request adding three users to a RoleBinding file did not define the Asia cluster and merged first, so Terraform deleted the Asia cluster. [findings/terraform-review-builds-that-write-a-shared-state-file-and-out-of-order-merges-deleted-production-clusters](../findings/terraform-review-builds-that-write-a-shared-state-file-and-out-of-order-merges-deleted-production-clusters.md)
- Recreating the cluster failed halfway because the service account lacked permissions. The team granted broad but different permissions than those used to import the clusters, and since Terraform saw different cluster properties under different permissions, the clusters looked different and a second cluster was deleted, so two thirds of the production clusters were gone. The second incident ran from about 8 PM to 5 AM.
- Impact was limited to internal work: one team created extra non-Kubernetes VMs, the cluster operators updated hard-coded master IPs, and everyone refreshed cluster credentials. No end-user impact was reported for either deletion.
- The speaker attributes the lack of user impact to three deliberate choices: planning for failure, migrating gradually (teams moved only part of each service, with Kubernetes marked beta), and a service discovery system that polled pod IPs from Kubernetes endpoints and failed over to the non-Kubernetes instances when a cluster disappeared. [findings/partial-migration-and-pod-ip-service-discovery-let-spotify-fail-over-when-its-kubernetes-clusters-were-deleted](../findings/partial-migration-and-pod-ip-service-discovery-let-spotify-fail-over-when-its-kubernetes-clusters-were-deleted.md)
- Practices the team credits: backups from day one and tested restores ("if you have never restored from backups, you don't have backups"), codifying infrastructure with linters, validators, dry-run output in pull request comments, required status checks, up-to-date branches, required reviews, and failing review builds that mention "destroy", with cluster destruction done manually outside that repository, plus scheduled disaster-recovery drills.
- Restore time later fell to about one hour for larger clusters. Kubernetes was then declared generally available inside Spotify, with five clusters per region and work under way on multi-cluster configuration and redundancy.

## Limits of this source

The transcript is auto-generated and contains recognition errors, so exact wording is taken from the slide deck where the two overlap. The talk does not state the dates of the second incident beyond "a month later", and the "this tool prevents the mistake" framing is the speaker's.
