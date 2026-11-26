---
title: Cluster add-on operators turn install and day-2 work into objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, add-ons, monitoring, certificates]
---

# Cluster add-on operators turn install and day-2 work into objects

## Scenario

Cluster add-ons and infrastructure components are the second group of operator use cases. Installing and upgrading monitoring, certificate management, and a service mesh are repeatable tasks that were once manual runbooks. [[sources/research-operator-pattern]]

## How it works

The CNCF explainer names Prometheus Operator for monitoring, cert-manager for TLS certificate issuance and renewal, and the Istio operator for mesh install and upgrade. Each exposes custom resources, so a cluster administrator declares what is wanted and the operator performs install and day-2 work continuously. URL: https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/.

## Related

[[entities/prometheus-operator]], [[entities/cert-manager]], [[concepts/operator-pattern]], [[examples/prometheus-operator-retrofits-status-onto-workload-crds]]
