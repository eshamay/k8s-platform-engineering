---
title: Field ownership can block drift correction
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [pitfall, server-side-apply, drift, flux, argo-cd]
---

# Field ownership can block drift correction

## Observation

When another field manager owns a field, server-side apply can block or distort correction. In the Flux community case, an edited Service port made the helm-controller dry-run fail with duplicate port names, so the controller stopped at "unable to determine cluster state" and never corrected anything. The `driftDetection.ignore` setting did not help because ignores apply after the dry-run. The thread links the same class of bug in Argo CD server-side diff (issue 17717) and Kubernetes issue 130292. [[sources/research-self-healing-and-drift-detection]] See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]].

## Interpretation

The Kubernetes documentation says writes to objects with managed fields can be forced, in which case ownership transfers, and a conflicting apply can also drop the field or abort. A drift-correcting tool therefore needs a policy for conflicts, and the policy decides whether a manual edit is reverted, tolerated, or breaks the diff. See [[concepts/server-side-apply-and-field-ownership]] and [[findings/multiple-writers-on-one-object]].

## Mitigations

The reported Flux mitigation is running helm-controller with `--override-manager=<manager>` so that the named manager's fields are transferred before diffing. Argo CD offers `managedFieldsManagers` in `ignoreDifferences` to ignore chosen managers. See [[comparisons/exemption-and-ignore-controls-across-tools]].

## Caveat

Correction 2026-11-26: the flag and its version are now confirmed. The helm-controller CHANGELOG lists `--override-manager` in the 1.5.0 section (2026-02-20), and `main.go` registers it as a repeatable flag. See [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] [[sources/research-gap-b1-unverified-claims]]. Whether the flag takes over before or after the dry-run was not checked.

## Related

[[concepts/self-healing-and-drift-detection]], [[entities/flux]], [[entities/argo-cd]]

## A second blocking case

Flux issue 1722 shows another way ownership blocks correction: a stale manager co-owning a list entry key leaves a half-removed container that fails the dry-run on every reconcile. The issue was closed through PR 1747 with an opt-in pre-dry-run takeover flag, `--override-manager-before-dry-run`, which shipped in kustomize-controller v1.10.0 and Flux v2.10.0 and which maintainers call dangerous. The documentation says to use it only to recover stuck objects and to remove it afterwards. [[sources/research-server-side-apply-and-field-ownership]] [[sources/research-gap-g3-flux-ssa-helm]] See [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]] and [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]].

The `--override-manager` flag in kustomize-controller is documented on the controller options page, where it takes over the named managers only after a successful dry-run. The helm-controller variant discussed above is documented in that project's changelog since v1.5.0.
