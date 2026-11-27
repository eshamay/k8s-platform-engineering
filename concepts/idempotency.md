---
title: Idempotency
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Idempotent reconciliation, Safe retries]
tags: [controllers, idempotency, external-resources]
---

# Idempotency

## Definition

Ensuring that running the same reconciliation logic multiple times produces the same result, without duplicating resources or causing errors. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md) The research dossier phrases it as an operation whose second run leaves the system in the same end state as the first. It shows up at three layers: the controller loop, the Kubernetes API, and the cloud APIs that controllers call. [sources/research-idempotency](../sources/research-idempotency.md)

## Why it matters

Because a level-triggered loop can run at any time and any number of times, a non-idempotent reconcile creates duplicates or fails on the second run. External APIs that lack natural idempotency (for example, creating a resource with a generated ID) need extra bookkeeping. The Kubernetes controllers page adds that "controllers can fail, so Kubernetes is designed to allow for that," which is why the loop must be a convergence process and not a script of one-shot commands. [sources/research-idempotency](../sources/research-idempotency.md)

## Layer 1: the controller loop

The controller-runtime FAQ says reconcile functions must be idempotent and must always read all the state they need before writing updates, which makes them tolerate skipped or coalesced events and restarts. The Kubebuilder good-practices page states that the reconciliation loop needs to be idempotent and warns that logic keyed to specific events goes against the operator pattern and can leave resources stuck. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) [sources/research-idempotency](../sources/research-idempotency.md) See [findings/event-specific-logic-in-reconcilers](../findings/event-specific-logic-in-reconcilers.md) and [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).

## Layer 2: the Kubernetes API

Deterministic object names give optimistic locking: a second create of the same name fails loudly and does not duplicate. The StatefulSet controller appends an ordinal and the Deployment controller hashes the pod template into the ReplicaSet name. When a name must be generated, the controller tracks the actions it took and requeues to repeat them if the objects have not appeared, as the ReplicaSet controller does. Server-side apply makes repeated writes safe, records field ownership in `managedFields`, and turns a clash with another manager into an explicit conflict. [sources/research-idempotency](../sources/research-idempotency.md) See [examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children](../examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children.md) and [concepts/server-side-apply-and-field-ownership](server-side-apply-and-field-ownership.md).

GitOps tools build on repeated apply. Flux runs a server-side apply dry-run every interval to find and correct drift, and Argo CD offers self-heal and retry with exponential backoff. Both rely on apply being safe to repeat. [sources/research-idempotency](../sources/research-idempotency.md) See [entities/flux](../entities/flux.md) and [entities/argo-cd](../entities/argo-cd.md).

## Layer 3: external cloud APIs

Creating a cloud resource is not naturally idempotent. If a controller calls a create API and crashes before it records the returned ID, the next reconcile cannot tell whether the resource exists, and a blind retry can leak the first one. The dossier describes four answers:

- Deterministic or caller-chosen names, so the same request names the same resource. Config Connector acquires a same-named resource, and ACK adopts by identifier. See [examples/config-connector-acquires-an-existing-google-cloud-resource-by-name](../examples/config-connector-acquires-an-existing-google-cloud-resource-by-name.md) and [examples/ack-adopt-or-create-brings-existing-aws-resources-under-management](../examples/ack-adopt-or-create-brings-existing-aws-resources-under-management.md).
- A persisted external identity, such as Crossplane's `crossplane.io/external-name` annotation, used for Observe, Update, and Delete. See [findings/external-identity-takes-different-forms-across-cloud-apis](../findings/external-identity-takes-different-forms-across-cloud-apis.md).
- Recording intent before acting and failing safe when the result is unknown. Crossplane writes `external-create-pending` and stops for a human, and SAP's provider adds a bounded lookup. See [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md) and [examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window](../examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window.md).
- A server-side client token that lets the cloud recognize a retried request and return a semantically equivalent response. See [examples/ec2-client-token-makes-a-retried-runinstances-call-safe](../examples/ec2-client-token-makes-a-retried-runinstances-call-safe.md).

[sources/research-idempotency](../sources/research-idempotency.md) See the side-by-side view in [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](../comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md).

## Idempotency for external create calls

The reconciliation-loop dossier shows that idempotency for external APIs needs more than status: Crossplane writes create-tracking annotations so a create whose status write failed is not repeated. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](../findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md).

## Idempotency under convergence

Convergence depends on idempotence in three places. Idempotent reconcilers make extra runs harmless, which is why most controllers can run as a single replica. Argo CD hooks run on every sync and must be idempotent. Failed operations are retried with backoff, so each retry must be safe. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md). Blind retry is safe only when the target API is idempotent, which is why retry storms and idempotency are linked. [sources/research-idempotency](../sources/research-idempotency.md) See [findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent](../findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent.md) and [findings/retry-storms-and-unbounded-retries](../findings/retry-storms-and-unbounded-retries.md).

## Design choices that remain open

The dossier leaves three questions unresolved: whether the external name belongs in an annotation or a spec field, how to recover from ambiguous creates at scale, and whether adopt-or-create is a safe default. See [decisions/external-name-annotation-or-spec-field](../decisions/external-name-annotation-or-spec-field.md), [decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging](../decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging.md), and [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md). kro and Cluster API idempotency are not covered by any readable source. [sources/research-idempotency](../sources/research-idempotency.md)

## Related

[concepts/reconciliation-loop](reconciliation-loop.md), [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), [concepts/provider](provider.md), [concepts/managed-resource](managed-resource.md), [concepts/finalizers](finalizers.md)

## Update from the leaked-resources dossier

The cloud-layer mechanisms above now have incident-grade evidence from GitHub issues, none from a named postmortem. A lost create result leads to a leaked or duplicated resource (an ACK CI run with a second VPC endpoint, an audit of 48 resources in 22 ACK controllers), to a stuck retry loop (a reported $155 over 15 days in an upjet provider), or to a halted resource that needs a human (Crossplane issue 3037). Caller-chosen names help only if the controller does not retry blindly: a 409 stopped a duplicate in one case, and a failed HTTP 400 create still produced a policy in another. Adoption as a convergence tool has its own failures, because `adopt-or-create` removes the foreign-owner guard. See [examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours](../examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours.md), [examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days](../examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days.md), [examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400](../examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400.md), [findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource](../findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource.md), and [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md). The unresolved question about the safer adoption default stays open in [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## Update from the m7 dossier

Correction note, 2026-11-26: the sentence above that kro and Cluster API idempotency are not covered by any readable source is superseded. kro records intended children in `status.managedResources` before applying and applies without force ([findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force](../findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force.md)). Cluster API tells providers to use provider-owned tags and deterministic hashed names and states no lost-create algorithm ([findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm](../findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm.md)). The external name defaults to the object name only for name-based kinds ([findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids](../findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids.md)). Config Connector's conflict policy is opt-in ([findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md)). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)
