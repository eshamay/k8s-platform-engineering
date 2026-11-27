---
title: The kro docs disagree on whether an instance state of FAILED exists
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, status, documentation]
---

# The kro docs disagree on whether an instance state of FAILED exists

## Observation

At release v0.10.0, the kro Instances page lists the instance `state` values as ACTIVE, IN_PROGRESS, DELETING, and ERROR. The Schema page, in the same documentation set, lists them as ACTIVE, IN_PROGRESS, FAILED, DELETING, and ERROR. The schema page example reads `state: ACTIVE  # ACTIVE | IN_PROGRESS | FAILED | DELETING | ERROR`. The dossier read only the documentation and not the Go source, so it could not say which list matches the code. [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/02-schema.md

## Why it matters

A dashboard, alert rule, or script that switches on `status.state` needs the complete list of values. Code written from the Instances page would not handle FAILED, and code written from the Schema page would wait for a value that may never appear. The same page set also says that `state` is a reserved field that kro overrides, so a platform author cannot redefine it to settle the question.

## Mitigations

The instance documentation tells readers to rely on the `Ready` condition rather than on sub-conditions, see [findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract](kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract.md). Until the Go source is read, treat any value other than ACTIVE as not healthy, and treat ERROR and FAILED alike. See [entities/kro](../entities/kro.md) and [concepts/conditions](../concepts/conditions.md).

## Resolution from source (2026-11-26)

The Go source settles which list is right. At v0.10.0 `api/v1alpha1/instance_state.go` defines IN_PROGRESS, ACTIVE, DELETING, and ERROR, with no FAILED. The v0.9.4 file also defines `InstanceStateFailed` ("FAILED"), and its comment reads "Deprecated: InstanceStateFailed is a legacy state kept for compatibility." A search of `controller.go`, `status.go`, and `deletion.go` at v0.9.4 found no use of the constant, so it was a defined but apparently unset value. That search covered only those three files because repository-wide code search was rate limited, so "never set" stays unverified. The Schema page's FAILED therefore reflects a legacy constant, and code that switches on `status.state` at v0.10.0 does not need a FAILED branch. Keep treating ERROR and any value other than ACTIVE as not healthy, because kro still reserves `state`. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/api/v1alpha1/instance_state.go
