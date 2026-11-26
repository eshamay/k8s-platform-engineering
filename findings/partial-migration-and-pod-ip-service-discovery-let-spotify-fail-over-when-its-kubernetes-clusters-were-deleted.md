---
title: Partial migration and pod-IP service discovery let Spotify fail over when its Kubernetes clusters were deleted
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
tags: [resilience, service-discovery, migration, failover, blast-radius, spotify]
---

# Partial migration and pod-IP service discovery let Spotify fail over when its Kubernetes clusters were deleted

## Observation

Spotify attributes the lack of end-user impact to design choices made before the deletions. Teams were told to migrate only some of each service's instances to Kubernetes, because Kubernetes usage was still marked beta and the team was building confidence in operating and scaling the clusters. Services running on Kubernetes were registered the "non-Kubernetes way": the internal service discovery system used pod IPs and ignored the Kubernetes Service IP, polling each Service's Endpoints to update its own state. When a cluster was deleted, the operators were paged and removed it from service discovery's configuration, the system was restarted, the Kubernetes pods dropped out, and downstream clients gradually refreshed their backend lists and kept only the non-Kubernetes instances. [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]], [[sources/spotify-kubecon-2019-keynote-slides-with-notes]]

## Why it matters

The speaker stresses that these were deliberate choices to make the infrastructure more reliable and the migration reversible. Because capacity existed outside the clusters and discovery was independent of Kubernetes Services, losing a whole cluster became an operational page and not a user-facing outage. The pattern is a case of limiting the blast radius of a control plane by keeping the data path independent of it. See [[examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact]].

## Caveats

The recovery depended on manual steps, a page and a service discovery restart, and on the fact that part of each service still ran elsewhere. A fully migrated service would not have had that fallback, which is why Kubernetes was declared generally available only after the incidents and with work under way on multi-cluster redundancy. [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]]

## Related pages

[[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]], [[concepts/universal-control-plane]].
