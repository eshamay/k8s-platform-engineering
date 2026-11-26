---
title: Kubebuilder
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: [Kubebuilder Book]
tags: [tool, operators, framework]
---

# Kubebuilder

Kubebuilder is a Kubernetes SIGs framework and tutorial book for writing controllers and operators. Its CronJob tutorial is the dossier's annotated example of a real Reconcile function. [[sources/research-declarative-vs-imperative]]

## What the controller tutorial teaches

The tutorial's Reconcile function fetches the object, lists the children it owns, cleans up, computes the next action, creates children, and requeues. It teaches three habits that make a controller declarative in practice. First, the controller rebuilds status from the observed world and not from prior status, which is the heart of [[concepts/idempotency]]. Second, children carry owner references so that garbage collection and re-triggering work, as described in [[concepts/owner-references-and-garbage-collection]]. Third, status is written through the status subresource, which avoids conflicts with spec updates and allows separate RBAC for the two. The stated goal of the loop is to "move the current state of the cluster closer to the desired state."

## Related

[[concepts/reconciliation-loop]], [[concepts/operator-pattern]], [[concepts/spec-status-split]], [[examples/database-operator-encodes-runbooks]]

## Groups, versions, kinds, and domains

The CronJob tutorial chapter on GVKs defines group, version, kind, and resource, explains that each GVK corresponds to a root Go type registered in a Scheme, notes the `Scale` subresource exception, and argues for one Kind per concern (App and DB as separate Kinds). Issue 5872, opened 2026-07-14, proposes a `--domain` flag and erroring on ambiguous external GVK resolution, and it was still open in late October 2026. [[sources/research-gvk-and-gvr]] See [[examples/kubebuilder-domain-flag-for-ambiguous-external-gvks]] and [[examples/hpa-scales-any-workload-through-the-scale-subresource]].

## Hub-and-spoke conversion

The Kubebuilder book describes the hub-and-spoke pattern for multi-version CRDs, where every version converts only to and from one hub version. [[sources/research-custom-resource-definition]] See [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]].

## Status subresource marker and client

Kubebuilder enables the status subresource with the `+kubebuilder:subresource:status` marker, and controllers should write status with `r.Status().Patch()` so generation is not bumped and the controller does not retrigger itself. Tutorial sources warn against using the normal client for status, forgetting RBAC on `/status`, and updating spec and status in one call. [[sources/research-spec-status-split]] See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]] and [[findings/status-client-rbac-and-conflict-mistakes]].

## Server-side apply scaffolding

The Kubebuilder book (alpha page) shows scaffolding with `--ssa` to generate apply configuration types, and applying status with `client.FieldOwner` and `client.ForceOwnership`. It recommends SSA when several controllers or users manage one resource and plain `Update()` for a sole owner. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/kubebuilder-controller-applies-status-with-a-field-owner]] and [[findings/applying-a-whole-read-back-object-claims-every-field]].

## Admission webhook scaffolding

The Kubebuilder book scaffolds webhooks with `kubebuilder create webhook`, implements `Default()` and `ValidateCreate`, `ValidateUpdate`, and `ValidateDelete`, and generates webhook manifests from markers. The webhooks ship in the same binary as the controller. [[sources/research-admission-webhooks-and-cel]] See [[examples/kubebuilder-operator-scaffolds-defaulting-and-validating-webhooks]].

## Good practices and the CronJob tutorial

The Kubebuilder good-practices page recommends idempotent reconcile, status conditions following the API conventions, one controller per Kind, and Kubernetes logging conventions. The CronJob tutorial is the dossier's recommended first hands-on exercise. [[sources/research-operator-pattern]] See [[findings/multi-kind-controllers-break-encapsulation-and-scale-poorly]], [[examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator]], and [[entities/operator-sdk]].

## Reconcile implementation lessons

The CronJob controller implementation chapter teaches idempotency, rebuilding status from observed children ("status should be able to be reconstituted from the state of the world"), updating the status subresource separately, controller owner references, field indexes for listing children, and `RequeueAfter` to wake at the next scheduled run. [[sources/research-reconciliation-loop]] See [[concepts/reconciliation-loop]].

## Idempotency in the good-practices page

The good-practices page says directly that the reconciliation loop needs to be idempotent, so it handles unexpected events, startup, and upgrades, and that logic keyed to specific events goes against the operator pattern and can leave resources stuck. [[sources/research-idempotency]] See [[findings/event-specific-logic-in-reconcilers]] and [[concepts/idempotency]].

## Owns and field indexers in the CronJob tutorial

The CronJob implementation page registers an informer on child Jobs with `Owns(&Job{})` so child changes reconcile the owner, and adds a field indexer on the owner reference so listing owned Jobs does not scan the whole cache. [[sources/research-informers-reflectors-and-workqueues]] See [[examples/kubebuilder-owns-and-a-field-indexer-wire-child-changes-to-the-owner]].
