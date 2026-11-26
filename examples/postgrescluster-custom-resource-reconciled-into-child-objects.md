---
title: A PostgresCluster custom resource reconciled into child objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [crd, operator-pattern, controller, etcd]
---

# A PostgresCluster custom resource reconciled into child objects

## Scenario

A team wants to run a database on Kubernetes without every application team learning how to assemble the pieces. A CRD registers a `PostgresCluster`-style kind, and an application team creates one small object that states how many replicas and which version it wants. [[sources/research-custom-resource-definition]]

## How it works

Once the CRD exists, the apiserver serves the new kind like any built-in type. The object is listed, watched, validated, covered by RBAC, written to the audit log, and stored in etcd under a registry path of the form `/registry/<group>/<resource>/...`. A custom controller watches the objects and reconciles each one into child resources such as StatefulSets, Services, and Secrets, then reports progress in `status`. URL: https://semicolony.dev/codex/kubernetes/internals/crd-operators/. The official custom resources page names this same pairing of a custom resource and a custom controller as the operator pattern. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/.

## Lesson

The CRD supplies only the data model and the API endpoint. All behavior lives in the controller, so the quality of the platform depends on the controller following the conventions for `spec`, `status`, and conditions. Because the objects live in the same etcd as everything else, the secondary source also cites a limit of about 1.5 MB per object, which should be confirmed against official documentation before it is relied on. See [[concepts/operator-pattern]], [[concepts/custom-resource-definition]], [[examples/database-operator-encodes-runbooks]], and [[findings/etcd-scale-limits-of-the-shared-store]].
