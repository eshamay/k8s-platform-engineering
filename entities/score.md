---
title: Score
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: [score.dev, score-compose, score-k8s]
tags: [tool, workload-spec, abstraction, developer-experience]
---

# Score

Score is a developer-facing, platform-agnostic workload specification that is translated into runnable manifests by a command-line tool. [[sources/research-kro-and-abstraction-models]]

## What it is

A developer writes one `score.yaml` that declares containers, ports, and abstract resources such as `type: postgres`. Implementation CLIs, `score-compose` and `score-k8s`, generate Docker Compose files or Kubernetes manifests from it. The project describes the result as "the 'how' becomes an environment specific implementation detail" (https://score.dev/). The site describes Score as a CNCF Sandbox project that originated at Humanitec, but the dossier did not verify that lineage, or its relationship to Radius-style platforms, from primary documents. [[sources/research-kro-and-abstraction-models]]

## Position among abstraction models

Score is aimed at cutting YAML bloat and local versus production drift. It generates output and does not run a controller, so it belongs with the render-time tools and not with Crossplane, kro, or Radius. It pushes the abstraction higher than Helm values or Kustomize patches, because the developer names a workload and an abstract resource type and never sees the resulting Deployment or database definition. The cost is a translation layer that someone must own, and the output still needs a GitOps tool for continuous correction. See [[examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec]], [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]], and [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]].

## Evidence caveat

The only adopter evidence in the dossier is a set of testimonials on the project's own site from Mineiros, Frontside Software, and BAUHAUS Deutschland. They are vendor-site statements and not independent case studies. [[sources/research-kro-and-abstraction-models]]

## Related

[[entities/radius]], [[entities/helm]], [[entities/kro]]
