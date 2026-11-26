---
title: Morgan Stanley runs Flux across more than 500 clusters with self-service onboarding
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [use-case, flux, gitops, scale, multi-tenancy, case-study]
---

# Morgan Stanley runs Flux across more than 500 clusters with self-service onboarding

## Scenario

Morgan Stanley described its Flux adoption in a FluxCon NA 2025 talk by Tiffany Wang and Simon Bourassa, which the Flux team wrote up in March 2026. The reported footprint is "over 500 clusters, over 2,000 nodes, over 100,000 containers, and tens of thousands of Flux resources." Before Flux the firm used push pipelines, which suffered from drift and made cluster rebuilds fragile. [[sources/research-flux-deep-dive]]

## How it works

Multi-tenancy rests on service account impersonation with Kubernetes RBAC, so a team's Kustomization can only create what its ServiceAccount is allowed to create. A self-service onboarding platform checks the requester's entitlements, registers the service in a configuration management database, primes the new namespace with a GitRepository and a Kustomization, and scaffolds the team's repository.

At scale the platform team raised reconciliation intervals, tuned the `--concurrent` flag and the controllers' resource limits, and moved the source of truth from a self-hosted Git provider to S3 buckets, which the write-up gives as an availability and compliance choice. They built a central Grafana dashboard from kube-state-metrics and fed notification-controller events to developer tools. Sharding, OCI artifacts, and Flagger are on the roadmap, so the post reports no production sharding numbers.

## What to take from it

This is the clearest evidence in the wiki that Flux's vertical tuning and per-tenant impersonation hold up at several hundred clusters. It is a conference write-up by the adopter, so it is a self-reported account and not an independent audit. The same post says speakers from KLM, NatWest Group, and Orange were scheduled at FluxCon Europe 2026, but their stories were not read.

## Related

[[entities/flux]], [[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation]], [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]], [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[decisions/git-versus-oci-as-the-canonical-source]]

## Confirmation from the named-adopters dossier

The 2026-11-26 dossier re-read the Flux blog post (dated 2026-03-15) and confirmed the footprint figures, which are self-reported by Morgan Stanley and relayed by the Flux maintainers. It also confirmed that "Exploring sharding Flux controllers to distribute load across multiple instances within a cluster" sits under "Looking Ahead", so Morgan Stanley is not a documented sharding user. Their scaling work was reconciliation intervals, `--concurrent` flags, and resource limits. No other organization was found that says it runs sharded Flux. [[sources/research-gap-g1-named-adopters]] URL: https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/.
