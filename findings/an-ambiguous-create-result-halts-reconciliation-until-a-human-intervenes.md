---
title: An ambiguous create result halts reconciliation until a human intervenes
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: [Ambiguous create]
tags: [pitfall, crossplane, idempotency, external-resources, create-pending]
---

# An ambiguous create result halts reconciliation until a human intervenes

## Observation

If a controller crashes after calling a cloud create API but before recording the returned ID, the next reconcile cannot tell whether the resource exists. A naive retry creates a duplicate and leaks the first resource. Crossplane writes `external-create-pending` before the call and refuses to continue when the outcome is unknown, so the managed resource is blocked with an event that tells the operator to remove the annotation if it is safe to proceed. The reporters on Crossplane issue 3037 hit this after provider restarts, and the issue was closed as not planned. [[sources/research-idempotency]]

## Why it happens

Many cloud APIs generate the identifier, as an AWS VPC does, so the controller has nothing deterministic to look up after a lost response. Lookup by tags or labels needs per-resource code and fails when the resource type cannot be tagged. The maintainer's proposed mitigations were to document the behavior and to let resources with deterministic identifiers opt out. [[sources/research-idempotency]]

## Interpretation

The behavior is safe but does not scale, as the issue reporter noted: each ambiguity costs a human decision. SAP's provider narrows the problem with a bounded semantic lookup, and ACK and Config Connector avoid it for resources with caller-chosen names or IDs by acquiring what exists. A client token on the API side removes the ambiguity at the source. The dossier found no general solution. [[sources/research-idempotency]] See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].

## Mitigations

Prefer APIs and resource types with caller-chosen names or client tokens, record intent before acting, keep a bounded recovery path for resource types that have a business key, and alert on managed resources stuck behind the pending marker. See [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]] and [[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]].

## Related

[[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]], [[concepts/idempotency]], [[entities/crossplane]], [[concepts/managed-resource]]
