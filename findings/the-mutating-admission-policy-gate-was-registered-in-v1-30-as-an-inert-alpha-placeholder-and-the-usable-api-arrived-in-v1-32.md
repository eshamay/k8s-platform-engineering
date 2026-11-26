---
title: "The Mutating Admission Policy gate was registered in v1.30 as an inert Alpha placeholder and the usable API arrived in v1.32"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [MAP first available v1.30, why the MAP docs say v1.30]
tags: [kubernetes, mutating-admission-policy, feature-gates, documentation-conflict, v1-30, v1-32, v1-36, verified]
---

# The Mutating Admission Policy gate was registered in v1.30 as an inert Alpha placeholder and the usable API arrived in v1.32

## Observation

The live Mutating Admission Policy page says "Feature state: Stable since Kubernetes v1.36; enabled by default" and, in its body, "It was first available in the v1.30 release." The gate table at tag v1.36.0 starts the feature at Alpha 1.32. The two statements look contradictory, and the code explains both. [[sources/research-gap-b1-recheck-flux-k8s]] https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/

## What the code shows

- **v1.30:** Pull request 123425, "[KEP-3962]Add feature gate for MAP", merged on 2024-02-22 under milestone v1.30. At tag v1.30.0 the generic gate map has `MutatingAdmissionPolicy: {Default: false, PreRelease: featuregate.Alpha}`, and CHANGELOG-1.30 says "Added feature gate `MutatingAdmissionPolicy` for enabling mutation policy in admission chain." The gate was still Alpha and default false at v1.31.0. Nothing usable sat behind it yet, so it was an inert placeholder.
- **v1.32:** CHANGELOG-1.32 says "Introduced `v1alpha1` API for mutating admission policies", to be enabled with the feature gate and `--runtime-config` for `admissionregistration.k8s.io/v1alpha1`. KEP 3962's `kep.yaml` gives alpha v1.32, beta v1.34, and stable v1.36.
- **v1.34 and v1.36:** The v1.36.0 versioned gate table reads Alpha 1.32 (default false), Beta 1.34 (default false), and GA 1.36 (default true), and CHANGELOG-1.36 records "Promoted the `MutatingAdmissionPolicy` to GA (v1) in Kubernetes `v1.36`" (PR 136039).

The v1.36.0 versioned gate table starts the gate at 1.32, which is why the gate table and the docs sentence disagree. The docs sentence is not in the page's Markdown source. The source file uses a `feature-state` shortcode, so the sentence is rendered from gate data. That generation is the dossier's inference from the source file, and the shortcode implementation was not read, so treat it as secondary-only.

## What to cite

The first release with a usable API, and the KEP's alpha milestone, is v1.32. The first release in which the gate name existed is v1.30. Cite v1.32 for "first usable" and say the docs figure of v1.30 refers to the gate registration. The stage and default for GA are v1.36 and true. Whether the `admissionregistration.k8s.io/v1` group for this feature is served by default beyond the gate default was not checked.

## Related

This resolves the first mismatch listed in [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]]. See also [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]], [[concepts/admission-webhooks-and-cel]], and [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]].
