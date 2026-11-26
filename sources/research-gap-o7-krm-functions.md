---
title: "Research dossier: gap cluster o7-krm-functions"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [krm-functions, kpt, kustomize, crossplane, composition-functions, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: gap cluster o7-krm-functions

> [!NOTE]
> **Raw file:** `raw/research-gap-o7-krm-functions.md` (sha256 prefix 35b3cd859ba9)<br>
> **Kind:** Verified research dossier for gap cluster o7-krm-functions, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the kpt, Kustomize, and Crossplane function pages<br>
> **Caveat:** Argo CD, Flux, and Helm-inflation constraints were not read, no WASM or in-process runtime search beyond the kpt and Kustomize pages was run, and Crossplane package-manager Go source was not read.

## Summary

The dossier covers two gaps. The KRM Functions Specification is a client-side contract: a function MUST be a container that reads a `ResourceList` on stdin and writes one on stdout, with a non-zero exit on failure and the ability to run as the non-root user `nobody`. kpt and Kustomize run functions without containers only through opt-in exec extensions (`--allow-exec`, and `--enable-alpha-plugins --enable-exec`) that both projects discourage, and Kustomize says it provides no sandbox.

Crossplane composition functions share the name but not the contract. Alpha (v1.11.0, 2023-01-31) ran containers through an `xfn` sidecar, v1.14.0 (2023-11-01) shipped the beta architecture of gRPC servers deployed as Deployments by the package manager and moved xfn out of tree, v1.17.0 (2024-08-29) graduated functions to v1, and v2.0.0 (2025-08-14) removed native patch and transform. Upgrading a Function changes behavior for every CompositionRevision that uses `functionRef`, including Manual pins. The verification pass removed nothing and corrected two quotations.

## Key claims

KRM function specification
- A function MUST be implemented as a container, MUST accept a `ResourceList` on stdin and write one to stdout, and MUST support YAML. VERIFIED.
- `items` is the only required property, `functionConfig` is optional input, and `results` is optional output. VERIFIED.
- A function container MUST be capable of running as non-root `nobody` when it needs no host filesystem, and a non-zero exit code indicates failure. VERIFIED.
- The spec is "completely decoupled from Kubernetes API machinery", and the `internal.config.kubernetes.io` annotation prefix is reserved. VERIFIED.
- The standard originated in kpt and was donated to the CNCF as part of Kubernetes SIG-CLI, per kpt's own page. VERIFIED.
- kpt recommends deterministic and idempotent functions, and its containers default to no network and no host filesystem. VERIFIED.
- kpt exec functions need `--allow-exec` and Kustomize exec functions need `--enable-alpha-plugins --enable-exec`. VERIFIED. Both docs discourage exec, and Kustomize provides no sandbox. VERIFIED.
- Argo CD, Flux, and Helm-inflation container constraints, WASM or in-process runtimes: UNVERIFIED.

Crossplane function runner history
- Alpha shipped in v1.11.0 (2023-01-31) with an `xfn` sidecar running rootless containers, and no alternative runners appeared. VERIFIED.
- The beta design makes functions Deployments behind a headless Service with the endpoint on the active FunctionRevision `status.endpoint`. VERIFIED.
- xfn was still maintained in v1.13.0, v1.14.0 (2023-11-01) shipped the incompatible beta architecture and moved xfn out of tree, and main carries a "feat: remove xfn" commit. VERIFIED.
- v1.17.0 graduated functions to v1 and deprecated native patch and transform without planning removal, and v2.0.0 removed `mode: Resources`. VERIFIED.
- Crossplane's contract is gRPC `RunFunction`. VERIFIED.
- Function upgrades affect pinned revisions under `functionRef`, and digest-pinned references are alpha behind `--enable-pipeline-oci-references`. VERIFIED.
- Function response caching is alpha in v1.20.0, and credentials on pipeline steps arrived in v1.16.0. VERIFIED.
- The latest observed release is v2.5.0 (2026-11-24). SECONDARY-ONLY, release metadata.
- A currently maintained xfn-like wrapper, exact function pod construction, and the controlled-rollout one-pager: UNVERIFIED.

## Open questions the dossier leaves

Whether Argo CD, Flux, or Helm inflation impose container constraints, whether any non-container function runtime exists, whether an xfn-like wrapper is maintained, how the package manager builds function pods, and what the controlled-rollout one-pager recommends.

## Pages touched

New pages are [[findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure]], [[findings/the-krm-functions-spec-is-a-client-side-standard-decoupled-from-the-cluster-and-reserves-internal-annotations]], [[findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage]], [[findings/kpt-containers-get-no-network-and-no-host-filesystem-by-default]], [[findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14]], [[findings/crossplane-functions-speak-a-grpc-runfunction-contract-that-differs-from-the-krm-resourcelist-over-stdio]], [[findings/upgrading-a-crossplane-function-changes-every-composition-revision-that-uses-functionref-including-manual-pins]], [[examples/crossplane-v1-14-0-shipped-beta-functions-on-2023-11-01-and-broke-compatibility-with-alpha-functions]], [[examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec]], and [[decisions/run-a-krm-function-as-a-container-or-as-an-exec-binary]].

Touched pages are [[entities/kpt]], [[entities/kustomize]], [[entities/crossplane]], [[concepts/composition]], [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]], [[findings/composition-functions-add-moving-parts-that-must-be-healthy]], [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]], [[decisions/choose-automatic-or-manual-composition-update-policy]], and [[sources/research-composition]].

## Related

[[open-knowledge-gaps]], [[concepts/tooling-landscape]]
