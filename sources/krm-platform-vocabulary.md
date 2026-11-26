---
title: KRM and Platform Engineering Vocabulary (seed note)
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: []
tags: [vocabulary, krm, seed]
---

# KRM and Platform Engineering Vocabulary (seed note)

> [!NOTE]
> **Raw file:** `raw/krm-platform-vocabulary.md`<br>
> **Kind:** User-supplied vocabulary note, no external author or URL<br>
> **Ingested:** 2026-11-25

## Summary

A four-part glossary describing the shared vocabulary that tools like Crossplane and Flux use when they build on the Kubernetes Resource Model (KRM). It closes with three suggested deep-dives: a full lifecycle trace from a Flux Git commit, a comparison of Crossplane Compositions with kro, and scale management through informers, workqueues, and sharding. Those three follow-ups are tracked in [[open-knowledge-gaps]].

## Key claims

### Core architectural principles

- The Kubernetes API server and etcd can act as a general database and orchestration engine for any infrastructure, not only containers. See [[concepts/universal-control-plane]].
- Declarative specs describe an end-state instead of a command sequence. See [[concepts/declarative-vs-imperative]].
- Level-triggered controllers act on current state rather than on events, so a missed event is repaired by the next reconcile. See [[concepts/level-triggered-vs-edge-triggered]].
- Complex systems converge eventually; resources apply concurrently and retry until dependencies exist. See [[concepts/eventual-consistency-and-convergence]].
- Controllers continuously compare live infrastructure with etcd and revert out-of-band changes. See [[concepts/self-healing-and-drift-detection]].
- In pull-based GitOps an in-cluster agent pulls manifests from Git, rather than a pipeline pushing them. See [[concepts/gitops-pull-based-delivery]].

### KRM and API machinery

- GVK names a schema; GVR names a REST endpoint. See [[concepts/gvk-and-gvr]].
- A CRD registers a new GVK with native storage, RBAC, and validation. See [[concepts/custom-resource-definition]].
- Users own `.spec`; controllers own `.status`, enforced via the `/status` subresource. See [[concepts/spec-status-split]].
- Server-side apply tracks field ownership in `managedFields`. See [[concepts/server-side-apply-and-field-ownership]].
- Admission webhooks and CEL rules mutate or validate requests before persistence. See [[concepts/admission-webhooks-and-cel]].

### Controller and operator mechanics

- See [[concepts/operator-pattern]], [[concepts/reconciliation-loop]], [[concepts/idempotency]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/finalizers]], [[concepts/owner-references-and-garbage-collection]], and [[concepts/conditions]].

### Platform engineering and abstraction terms

- See [[concepts/managed-resource]], [[concepts/composite-resource]], [[concepts/composition]], and [[concepts/provider]]. The tools are [[entities/crossplane]], [[entities/kro]], and [[entities/flux]].

## Limits of this source

The note is a vocabulary list. It gives no citations, no worked examples, and no failure modes, so every page derived from it starts at `status: draft` until the research workflow adds external sources.
