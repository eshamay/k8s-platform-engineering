---
title: "Pluto and kubent ship no Crossplane rules so deprecated Crossplane GVKs pass unflagged"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, deprecation, pluto, kubent, crossplane, gvk]
---

# Pluto and kubent ship no Crossplane rules so deprecated Crossplane GVKs pass unflagged

## Observation

Neither common deprecated-API scanner knows Crossplane out of the box. Pluto (FairwindsOps, v5.24.6 on 2026-11-25) checks manifests, Helm charts, and live Helm releases against a bundled `versions.yaml` and labels results DEPRECATED or REMOVED. That file holds 86 `k8s`, 24 `cert-manager`, and 2 `istio` entries and no Crossplane or Upbound entry. Kubent (kube-no-trouble) queries the cluster and Helm releases and evaluates Rego rule sets for Kubernetes 1.16 through 1.32 plus a "future" set. Its last tagged release is 0.7.3 (2024-08-30), although the repository was still pushed to in 2026. [[sources/research-gap-g3-crossplane-v2]] https://github.com/FairwindsOps/pluto and https://github.com/doitintl/kube-no-trouble

## Custom entries exist

Pluto accepts extra checks with `--additional-versions` or `-f`, and kubent flags extra custom resources with `-a Kind.version.group`. Both mechanisms are manual. The dossier found no documentation of operator-GVK deprecation support beyond those custom-entry paths.

## Crossplane GVKs that need a custom entry

In the docs-shipped v2.5 CRDs, the `apiextensions.crossplane.io` XRD v1 is deprecated (served, still storage) beside v2, and the old `apiextensions.crossplane.io` Usage v1alpha1 and v1beta1 are deprecated in favor of `protection.crossplane.io` Usage and ClusterUsage v1beta1. Namespaced managed resources use `.m.` groups (for example `s3.aws.m.upbound.io/v1beta1`) beside legacy cluster-scoped groups (`s3.aws.upbound.io/v1beta2`), and Crossplane says it "will deprecate and remove cluster scoped MRs at a future date". The dossier infers, without a source stating it, that the API server returns a warning header for a client using the deprecated XRD v1, but pluto and kubent would not flag it without a custom rule.

## Mitigations

Use `crossplane beta upgrade check` from the v1.20 CLI for the v1-to-v2 move. It scans for removed v1 features (native patch-and-transform, ControllerConfig, external secret stores, XR connection details, default registry), not GVK deprecations. For GVKs, add custom pluto or kubent entries. See [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], and [[entities/crossplane]].
