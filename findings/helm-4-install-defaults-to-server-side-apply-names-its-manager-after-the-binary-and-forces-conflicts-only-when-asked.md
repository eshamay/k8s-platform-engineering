---
title: Helm 4 install defaults to server-side apply, names its manager after the binary, and forces conflicts only when asked
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Helm 4 field manager, Helm force-conflicts]
tags: [helm, helm-4, helm-controller, server-side-apply, field-manager, force-conflicts, verified]
---

# Helm 4 install defaults to server-side apply, names its manager after the binary, and forces conflicts only when asked

## Observation

The Helm v4.0.0 release notes (2025-11-12) list "Server side apply is now supported" and warn that it "may impact the experience". On main (commit 3b82b52, 2026-11-25), `helm install` has `--server-side` as a boolean that defaults to true. `helm upgrade` takes "true", "false", or "auto" with default "auto", which follows the previous release's method. Install, upgrade, and rollback all have `--force-conflicts`, default false, described as "if set server-side apply will force changes against conflicts". [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) URLs: https://github.com/helm/helm/blob/main/pkg/cmd/install.go and https://github.com/helm/helm/blob/main/pkg/cmd/upgrade.go

## Field manager

Helm uses `ManagedFieldsManager` if it is set and otherwise the base name of `os.Args[0]`, so the manager is normally `helm`. When a release created with client-side apply is upgraded with server-side apply, Helm upgrades the client-side field manager to the server-side one, with the source comment "Update client-side field manager if transitioning from client-side to server-side apply". URL: https://github.com/helm/helm/blob/main/pkg/kube/client.go

## The contrast with helm-controller

Unlike the Helm command line, helm-controller always forces: the source sets `ForceConflicts = ServerSideApply` with the comment "We always force conflicts on server-side apply." URL: https://github.com/fluxcd/helm-controller/blob/main/internal/action/install.go. The same install page of the helm-controller spec says the choice "always forces conflicts with other field managers". A human running Helm 4 gets a conflict error by default, and the same chart under Flux takes the fields. See [findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade](helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade.md).

## What is still open

The dossier read main only. Whether the v4.0.0 tag itself defaulted install to server-side apply is UNVERIFIED from source, although the helm.sh overview recorded earlier says Helm 4 defaults to it. Helm issue 32706 reports a related failure: see [examples/helm-issue-32706-helm-4-install-fails-on-a-crd-previously-installed-client-side](../examples/helm-issue-32706-helm-4-install-fails-on-a-crd-previously-installed-client-side.md).

## Related

[entities/helm](../entities/helm.md), [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)
