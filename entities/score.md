---
title: Score
type: entity
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
aliases: [score.dev, score-compose, score-k8s]
tags: [tool, workload-spec, abstraction, developer-experience]
---

# Score

Score is a developer-facing, platform-agnostic workload specification that is translated into runnable manifests by a command-line tool. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## What it is

A developer writes one `score.yaml` that declares containers, ports, and abstract resources such as `type: postgres`. Implementation CLIs, `score-compose` and `score-k8s`, generate Docker Compose files or Kubernetes manifests from it. The project describes the result as "the 'how' becomes an environment specific implementation detail" (https://score.dev/). The site describes Score as a CNCF Sandbox project that originated at Humanitec. The sandbox status is now verified from primary listings, and Humanitec is named as the sponsoring company in the sandbox application, but no primary text says Humanitec created Score, see below. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Position among abstraction models

Score is aimed at cutting YAML bloat and local versus production drift. It generates output and does not run a controller, so it belongs with the render-time tools and not with Crossplane, kro, or Radius. It pushes the abstraction higher than Helm values or Kustomize patches, because the developer names a workload and an abstract resource type and never sees the resulting Deployment or database definition. The cost is a translation layer that someone must own, and the output still needs a GitOps tool for continuous correction. See [examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec](../examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec.md), [comparisons/score-versus-radius-as-developer-facing-workload-abstractions](../comparisons/score-versus-radius-as-developer-facing-workload-abstractions.md), and [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md).

## Evidence caveat

The only adopter evidence in the dossier is a set of testimonials on the project's own site from Mineiros, Frontside Software, and BAUHAUS Deutschland. They are vendor-site statements and not independent case studies. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Related

[entities/radius](radius.md), [entities/helm](helm.md), [entities/kro](kro.md)

## Primary-source status (o6 dossier)

Score is a CNCF Sandbox project, accepted 2024-07-08 per the CNCF landscape file, see [findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes](../findings/radius-and-score-are-both-cncf-sandbox-projects-per-the-landscape-file-and-both-passed-sandbox-votes.md). Its maintainers span Oracle, an independent, Docker, and Checkly, and the sandbox application names Humanitec as the "sponsoring company", see [findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company](../findings/score-maintainers-span-four-employers-and-the-sandbox-application-names-humanitec-as-sponsoring-company.md). The spec releases slowly (0.4.1 on 2026-05-25) and the implementations release often (score-k8s 0.23.0 and score-compose 0.50.0 on 2026-11-14). The example spec uses `apiVersion: score.dev/v1b1`. The score.dev documentation was not read, so what the tool does rests on the READMEs. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)
