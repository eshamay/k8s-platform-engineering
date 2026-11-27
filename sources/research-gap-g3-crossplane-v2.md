---
title: "Research dossier: Crossplane v2 gap cluster (claims, conditions, SSA, deletion, Operations, activation, scaling, scanners)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [crossplane, v2, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Crossplane v2 gap cluster (claims, conditions, SSA, deletion, Operations, activation, scaling, scanners)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-crossplane-v2.md` (sha256 prefix 073a1fe74dec)<br>
> **Kind:** Verified research dossier for gap cluster g3, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Crossplane pages<br>
> **Caveat:** Claims are labeled VERIFIED, SECONDARY-ONLY, or UNVERIFIED in the dossier. Only VERIFIED claims (and one SECONDARY-ONLY claim, attributed) enter wiki pages as fact. "main" claims describe the branch as read on 2026-11-26, not a tagged release. Documentation was read as markdown source in `crossplane/docs` (`content/v2.5/`), not as rendered pages.

## Summary

The dossier settles most open Crossplane v2 questions from primary sources: the v2.0.0, v2.1.0, v2.4.0, and v2.5.0 release notes, the v2.5 docs source, CRD manifests shipped with those docs, and `main`-branch source in `crossplane/crossplane`, `crossplane/crossplane-runtime`, and `crossplane/upjet`. The current release is v2.5.0 (2026-11-24) and v1.20 reached end of life with it. Five structural findings stand out. Claims survive only for legacy XRDs. `deletionPolicy` is gone from namespaced managed resources but remains on legacy ones, and `managementPolicies` is still beta. Operations, managed resource definitions, and activation policies are all alpha. The async `Synced` problem in provider-aws issue 2287 was closed by the stale bot with no fix, and the source still behaves the same way. Issue 7453 on external server-side apply writers is still open and not reproduced by a maintainer.

## Key claims

### Claims and XRD scope

- In v2 an XRD has a `scope` of `Namespaced` (the default) or `Cluster`, and neither supports claims: "The new namespaced and cluster scoped XRs in Crossplane v2 don't support claims." https://github.com/crossplane/docs/blob/master/content/v2.5/whats-new/_index.md
- A v1 XRD (`apiextensions.crossplane.io/v1`) defaults to `LegacyCluster`, which supports claims and does not use `spec.crossplane`. The v2 CRD version enumerates only `Namespaced` and `Cluster` and rejects `claimNames` with a CEL rule ("Claims aren't supported in apiextensions.crossplane.io/v2"). https://github.com/crossplane/docs/blob/master/content/v2.5/api/crds/apiextensions.crossplane.io_compositeresourcedefinitions.yaml
- The v1 XRD version is deprecated in the CRD but is still served and, in the v2.5 manifest, still the storage version.
- The v2.5.0 release notes state that "v1 legacy workloads like Claims and cluster scoped resources remain supported in Crossplane v2", and claims are still being fixed (v2.4.0 and v2.5.0 both carry claim changes). https://github.com/crossplane/crossplane/releases/tag/v2.5.0
- The v2.5 `composition/` docs directory has no claims page, while v1.20 had `concepts/claims.md`. Legacy cluster-scoped XRs are always deleted with the Background policy.
- No date or plan to deprecate or remove claims was found (UNVERIFIED, searched and absent).

### Conditions and async signaling

- provider-aws issue 2287 (opened 2026-03-11) was marked stale on 2026-06-10 and closed on 2026-06-25 with no maintainer comment and no linked fix. https://github.com/crossplane-contrib/provider-aws/issues/2287
- On `main`, upjet's async Terraform plugin SDK client returns `ResourceExists: true, ResourceUpToDate: true` from Observe during an ongoing operation, and the crossplane-runtime managed reconciler marks `ReconcileSuccess` on an up-to-date observation. Latest releases read: upjet v2.5.1 (2026-09-30), crossplane-runtime v2.5.0 (2026-11-23).
- The v2.5 docs show `AsyncOperation` with reason `Ongoing` and `Status: True`, while upjet code sets `Status: False`.
- v2.0.0 made XR and claim conditions persist `observedGeneration`.

### Server-side apply

- The v1.20 SSA concept page has no v2.5 successor. On `main` the composite reconciler applies `spec.crossplane.resourceRefs` with SSA `ForceOwnership` under field owner `apiextensions.crossplane.io/composite`, and composed resources use owners prefixed `apiextensions.crossplane.io/composed`. Claim-to-XR sync via SSA is a beta flag (`--enable-ssa-claims`) that defaults on.
- Issue 7453 (opened 2026-05-31 against v2.3.1) is open with labels `bug` and `stale`. A maintainer could not reproduce it on v2.3.1 and suggested `kubectl get -o yaml` hides `managedFields`. Community PRs 7783 and 7787 propose preserving `managedFields` and are open and unmerged. https://github.com/crossplane/crossplane/issues/7453
- Operations "force ownership when applying changes, which can cause conflicts."

### Deletion, policies, and garbage collection

- A namespaced XR can compose only resources in its own namespace, and v2.5.0 blocks a function from making a namespaced XR compose a cluster-scoped resource by setting `metadata.namespace`.
- XR deletion defaults to Background. The composition `deletionPolicy` (Background, Foreground, Pipeline) is alpha, behind `--enable-function-controlled-deletion`, new in v2.5.0.
- The managed reconciler deletes the external resource only when `observation.ResourceExists && policy.ShouldDelete()`, so a cascade that deletes an MR object without `Delete` in `managementPolicies` leaves the external resource and removes the finalizer. v2.4.0 restricted the XR garbage collector to resources whose controller reference points to the XR.
- v2.0.0 removed `deletionPolicy` from namespaced MRs ("Existing cluster scoped managed resources are not affected"). Issue 5283 ("Deprecate DeletionPolicy", opened 2024-01-25) is still open, last active 2024-08-14. https://github.com/crossplane/crossplane/issues/5283
- `managementPolicies` is still beta in the v2.5 docs, enabled by default, with values `*`, Create, Delete, LateInitialize, Observe, and Update, and an empty list pauses the resource. Runtime code calls the `{Observe}` set "ObserveOnly" and rejects unsupported combinations.

### Operations, activation, and scaling

- Operations are alpha in v2.5: every docs page carries `state: alpha`, the flag is `--enable-operations`, and the CRDs ship only `ops.crossplane.io/v1alpha1`. They cannot delete resources or set owner references. No beta plan was found.
- MRDs and MRAPs are alpha in the docs. An MRAP matches MRD names with prefix-only wildcards and sets matches `Active`, one way only. The Helm chart creates a default MRAP with `provider.defaultActivations: ["*"]`, and a provider needs the `safe-start` capability for MRDs to start Inactive. v2.4.0 scales safe-start provider runtimes to zero until the first MRD is active.
- The docs estimate about 3 MiB of API server memory per CRD. The v2.5.0 notes report core heap falling from 338 MiB to 190 MiB on a 791-CRD cluster (project self-reported), and a 2026-10-08 Crossplane blog reports 80 to 95 percent provider memory reduction on a 2,000-CRD cluster (project self-reported). https://blog.crossplane.io/cutting-provider-memory-by-80-crossplane-runtime-v2-4-and-client-caching/
- The v2.5 Pods guide gives a default polling rate of one minute and an hourly full re-check. v2.1.0 replaced custom client-side rate limiting with API Priority and Fairness, an XR circuit breaker (50 burst, then one per two seconds, open for five minutes), and `--max-concurrent-reconciles`.
- The MRD design doc (Accepted) says families "helped alleviate the issue, but some large Crossplane deployments still work around it". No numeric scaling limits are documented.

### Deprecated API scanners

- Pluto v5.24.6 (2026-11-25) bundles `versions.yaml` entries for `k8s` (86), `cert-manager` (24), and `istio` (2), with no Crossplane or Upbound entry, and accepts extra entries through `--additional-versions` or `-f`.
- Kubent's last tagged release is 0.7.3 (2024-08-30). It evaluates Rego rule sets for 1.16 through 1.32 and flags extra custom resources with `-a Kind.version.group`.
- Crossplane's own scanner is `crossplane beta upgrade check` in the v1.20 CLI, which finds removed v1 features and not GVK deprecations.
- v2.5 CRDs: XRD v1 deprecated and v2 served, Composition v1, MRD and MRAP v1alpha1, EnvironmentConfig v1beta1, Provider v1, Function v1 and v1beta1, `ops` v1alpha1, and the old `apiextensions` Usage deprecated in favor of `protection.crossplane.io`. Namespaced MRs use `.m.` groups beside legacy cluster-scoped groups, and cluster-scoped MRs are to be deprecated and removed "at a future date".

## Open points the dossier records

- No v2 page explains how `managementPolicies` interact with owner-reference cascade, and the behavior above is derived from source.
- No source quantifies API server memory with and without activation policies.
- No beta plan for Operations, no removal date for claims, legacy `deletionPolicy`, or legacy cluster-scoped MRs, and no numeric scaling limits were found.
- A maintainer resolution or merged fix for issue 7453 was not found, and the body of PR 8080 ("stop stale XR condition replay") was not read.

## Pages shaped by this source

[entities/crossplane](../entities/crossplane.md), [comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md), [concepts/composite-resource](../concepts/composite-resource.md), [concepts/managed-resource](../concepts/managed-resource.md), [findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api](../findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api.md), [findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs](../findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs.md), [examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource](../examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource.md), [examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024](../examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024.md), [findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays](../findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays.md), [findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references](../findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references.md), [findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off](../findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off.md), [examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds](../examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds.md), [findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged](../findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged.md), [findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes](../findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes.md).
