---
title: Argo CD rolls up child health with Lua checks
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, health, lua, status]
---

# Argo CD rolls up child health with Lua checks

## Scenario

Argo CD must report one health value for an application that may contain Deployments, custom resources, and many other kinds. It cannot do that from `spec`, so it reads each child's `status`. [[sources/research-spec-status-split]]

## How it works

Argo CD ships built-in health checks for core types. For CRDs it runs Lua scripts that read `obj.status` and return Healthy, Progressing, Degraded, or Suspended. An application's health is the worst of its immediate children. For a CRD with no script, Argo CD cannot derive health reliably, because, in the words of its documentation, "CRDs do not follow a consistent or standardized status format." Controllers therefore need to expose usable status, and operators of unusual CRDs need to write a script. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/health/.

## Lesson

A tool that does not understand the status shape of a kind cannot gate ordering on it. The cost of unstandardized status is paid as per-kind code in every consumer. See [[entities/argo-cd]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]], [[examples/crossplane-resources-hosted-by-argo-cd]], and [[comparisons/health-and-readiness-models-across-tools]].
