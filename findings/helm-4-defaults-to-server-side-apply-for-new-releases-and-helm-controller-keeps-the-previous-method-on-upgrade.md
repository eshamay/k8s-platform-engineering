---
title: "Helm 4 defaults to server-side apply for new releases, and helm-controller exposes the choice per install, upgrade, and rollback"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Helm 4 server-side apply default]
tags: [helm, helm-4, helm-controller, flux, server-side-apply, defaults, verified]
---

# Helm 4 defaults to server-side apply for new releases, and helm-controller exposes the choice per install, upgrade, and rollback

## Observation

The wiki previously said that one personal blog claimed Helm 4.0.0 enables server-side apply by default and that no primary Helm page confirmed it. The helm.sh overview now confirms it: "Helm 4 will default to server-side apply when installing a new Chart release." The page also says upgrades and rollbacks follow the method of the previous release, so "all releases created by Helm 3 will default to using client-side apply after upgrading to Helm 4." [[sources/research-gap-b1-recheck-flux-k8s]] https://helm.sh/docs/overview/ (Helm 4.3.1 docs, read 2026-11-26)

The `helm` command line takes `--server-side` with the values true, false, or auto, where auto follows the previous release's method, and `--force-conflicts`. The source marks `--force-conflicts` as mutually exclusive with `--force-replace` and the deprecated `force`. https://github.com/helm/helm/blob/main/pkg/cmd/upgrade.go

## How helm-controller exposes it

helm-controller v1.5.0 (2026-02-20) moved to Helm v4 and defaulted new HelmReleases to server-side apply ("Apply method is now defaulting to server-side apply for new HelmReleases"). The HelmRelease fields are:

- `.spec.install.serverSideApply` is a boolean that defaults to true, or to false when the `UseHelm3Defaults` feature gate is enabled.
- `.spec.upgrade.serverSideApply` and the rollback equivalent take `enabled`, `disabled`, or `auto`, with default `auto`.
- `force` "is ignored for server-side apply (which always forces conflicts with other field managers)".

The controller's `go.mod` pins `helm.sh/helm/v4` v4.3.1. https://github.com/fluxcd/helm-controller/blob/main/docs/spec/v2/helmreleases.md

## What is separate

The helm-controller drift detection, which uses a server-side dry-run apply, is a different feature. Its changelog says it "is completely unrelated to Helm v4's server-side apply support, and was implemented long before Helm v4 was released". HelmRelease `driftDetection.mode` still defaults to disabled (`enabled`, `warn`, and `disabled` are the values), and with `enabled` the controller corrects drift by creating and patching resources from the dry-run result. See [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]].

## Why it matters

Force-always server-side apply makes a HelmRelease take fields from other managers, so a team that moves to Helm 4 defaults can see new ownership conflicts resolved silently in Helm's favor. Existing releases created by Helm 3 keep client-side apply until the method is changed, which gives a mixed fleet. See [[concepts/server-side-apply-and-field-ownership]] and [[comparisons/ssa-conflict-policy-across-tools]].

## Related

[[entities/helm]], [[entities/flux]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[findings/forcing-conflicts-hides-disagreements-between-writers]]

## Update from the m4 dossier

Update 2026-11-26: source on Helm main now answers the points left open earlier. The field manager is the binary's base name unless `ManagedFieldsManager` is set, and a client-side to server-side upgrade also upgrades the client-side manager. The command line does not force conflicts unless `--force-conflicts` is set, whereas helm-controller sets `ForceConflicts = ServerSideApply`. The v4.0.0 tag was not read, and Helm issue 32706 reports an install conflict on a CRD installed client-side. [[sources/research-gap-m4-ssa-conflict-policy]] See [[findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked]].
