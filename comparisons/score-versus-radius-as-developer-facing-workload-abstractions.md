---
title: Score versus Radius as developer-facing workload abstractions
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [score, radius, workload-spec, developer-experience, comparison]
---

# Score versus Radius as developer-facing workload abstractions

> [!NOTE]
> Maturity and governance rows now rest on primary CNCF listings and repository files. The workload and runtime rows still rest on the project's own site (Score) and one third-party review (Radius), because the radapp.io and score.dev documentation sites were not read.

## The shared idea

Both tools let a developer describe a workload and ask for abstract backing resources, such as a Postgres database or a Redis cache, and leave the implementation to a platform team. Both aim to cut YAML bloat and keep development and production consistent. They differ in whether anything keeps running afterward. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Side by side

| Dimension | Score | Radius |
|---|---|---|
| What the developer writes | One `score.yaml` with containers, ports, and resources such as `type: postgres` | An application with containers, databases, and connections |
| How the implementation is chosen | The implementation CLI (`score-compose` or `score-k8s`) maps resource types for its environment | Platform engineers supply Recipes per environment |
| Runtime | None, output is generated manifests | Its own control plane |
| Targets | Docker Compose and Kubernetes | README lists local, private cloud, Azure, and AWS environments, and a review adds a Bicep dependency |
| Maturity signals | CNCF Sandbox, accepted 2024-07-08 (landscape file), spec 0.4.1 on 2026-05-25 | CNCF Sandbox, accepted 2024-04-16 (landscape file), v0.62.0 on 2026-10-27, one supported channel, breaking changes listed |
| Governance | Four maintainers from Oracle, an independent, Docker, and Checkly, and Humanitec named as sponsoring company in the sandbox application | Four maintainers, all Microsoft employees |
| Evidence | Primary listings plus vendor-site testimonials | Primary listings plus one blog review |

## Trade-offs

Score stays out of the cluster, so it adds no operational surface beyond the CLI, but the manifests it generates still need a GitOps tool for drift correction. Radius brings a control plane that can model connections and dependencies, at the cost of operating it and of the dependencies the review lists. Either tool is a higher-level alternative to the typed platform API that Crossplane or kro publishes, and neither is a replacement for them underneath. See [entities/score](../entities/score.md), [entities/radius](../entities/radius.md), [examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec](../examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec.md), [examples/radius-recipes-let-platform-engineers-decide-what-a-redis-cache-becomes-in-each-environment](../examples/radius-recipes-let-platform-engineers-decide-what-a-redis-cache-becomes-in-each-environment.md), and [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md).

## Open points

No primary text says Humanitec created Score, and neither documentation site was read. Neither tool is an operator-style reconciler for arbitrary resources: Radius is a platform with its own control plane and Score is a specification consumed by CLIs. See [findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company](../findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company.md), [findings/all-four-radius-maintainers-are-microsoft-employees-and-only-the-newest-minor-channel-is-supported](../findings/all-four-radius-maintainers-are-microsoft-employees-and-only-the-newest-minor-channel-is-supported.md), and [open-knowledge-gaps](../open-knowledge-gaps.md).

Correction note: the earlier "origin at Humanitec" and "CNCF Sandbox per a third-party review" cells are replaced by the primary listings above. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)
