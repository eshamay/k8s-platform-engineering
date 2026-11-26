---
title: Score generates Docker Compose or Kubernetes manifests from one workload spec
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [score, workload-spec, docker-compose, example, developer-experience]
---

# Score generates Docker Compose or Kubernetes manifests from one workload spec

## The use case

A team wants developers to run an application the same way on a laptop and in a cluster without hand-maintaining a Compose file and a set of Kubernetes manifests. The Score site presents one `score.yaml` that declares the containers, their ports, and abstract resources such as `type: postgres` (https://score.dev/). The command `score-compose` turns it into a Docker Compose project for local work, and `score-k8s` turns it into Kubernetes manifests. [[sources/research-kro-and-abstraction-models]]

## What the abstraction hides

The developer states that a Postgres database is needed and does not say how it is provided. In the local environment the implementation can be a container, and in a cluster it can be whatever the platform team maps that resource type to. The project summarizes this as the "how" becoming an environment-specific implementation detail. The stated aims are fewer lines of YAML and less drift between local and production setups.

## Evidence strength

The adopters named on the site are small and mid-size companies: Mineiros, Frontside Software, and BAUHAUS Deutschland, each using a single spec across local Docker and Kubernetes. These are vendor-site testimonials and not independent case studies. Score generates output only, so continuous reconciliation of what it produces still falls to a GitOps tool. See [[entities/score]] and [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]]. [[sources/research-kro-and-abstraction-models]]
