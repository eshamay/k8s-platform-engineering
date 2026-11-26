---
title: "helm-controller has had a repeatable override-manager flag since v1.5.0, and it is unrelated to Helm v4 server-side apply"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [helm-controller override-manager]
tags: [flux, helm-controller, server-side-apply, field-manager, drift, verified]
---

# helm-controller has had a repeatable override-manager flag since v1.5.0, and it is unrelated to Helm v4 server-side apply

## Observation

The helm-controller CHANGELOG lists the flag in its 1.5.0 section, dated 2026-02-20: "The `--override-manager=<manager>` flag has been added for server-side apply drift detection and correction." The release list shows v1.5.0 published on 2026-02-20. On the main branch, `main.go` registers the flag as a repeatable string-array option described as "List of field managers to override during drift detection", and feeds it to the `DisallowedFieldManagers` setting of the drift detector. [[sources/research-gap-b1-unverified-claims]] URL: https://github.com/fluxcd/helm-controller/blob/main/CHANGELOG.md and https://github.com/fluxcd/helm-controller/blob/main/main.go

The changelog also says that this drift correction is "completely unrelated to Helm v4's server-side apply support, and was implemented long before Helm v4". The wiki should therefore not describe the flag as a consequence of Helm 4.

## What this settles

The community reply recorded in [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]] said the flag exists "since helm-controller v1.5.0". That version is now confirmed by the project's own changelog, so the flag and its version are no longer community-only claims. The flag is distinct from the kustomize-controller flags: `--override-manager` there takes over only after a successful dry-run, and `--override-manager-before-dry-run` (v1.10.0) takes over before it, see [[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation]].

## What it does not settle

The dossier read the changelog and `main.go`, not the helm-controller documentation pages. It did not test whether the helm-controller flag takes over before or after the drift-detection dry-run, so the wiki does not say whether it can recover an object already stuck at dry-run validation. Issue 17717 in Argo CD and Kubernetes issue 130292, which the community thread links, were not read in this pass.

## Related

[[findings/field-ownership-blocks-drift-correction]], [[comparisons/exemption-and-ignore-controls-across-tools]], [[entities/flux]], [[concepts/server-side-apply-and-field-ownership]]

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: the flag, its release (v1.5.0, 2026-02-20, pull request 1365), and the changelog sentence about Helm v4 are re-read and agree. The same release moved helm-controller to Helm v4 and defaulted new HelmReleases to server-side apply ([[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]]). Still not settled: whether the helm-controller flag takes over before or after the drift-detection dry-run. Its help text reads "List of field managers to override during drift detection", which does not say. [[sources/research-gap-b1-recheck-flux-k8s]]

## Update from the m4 dossier

Update 2026-11-26: the open point above is settled by source. The helm-controller flag patches `managedFields` before the server-side dry-run diff, so it can clear a stale manager that wedges the dry-run. The helm-controller docs flags table lists the flag with the example `--override-manager=kubectl-edit --override-manager=kubectl-patch`, while the HelmRelease specification pages do not describe it. [[sources/research-gap-m4-ssa-conflict-policy]] See [[findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller]].
