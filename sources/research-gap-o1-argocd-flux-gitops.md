---
title: "Research dossier: Argo CD and Flux GitOps gap cluster (o1-argocd-flux-gitops)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, flux, gitops, secrets, oci, applicationset, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Argo CD and Flux GitOps gap cluster (o1-argocd-flux-gitops)

> [!NOTE]
> **Raw file:** `raw/research-gap-o1-argocd-flux-gitops.md` (sha256 prefix 3a5f956bbd5a)<br>
> **Kind:** Verified research dossier for gap cluster o1-argocd-flux-gitops, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Argo CD, Flux, GitOps comparison, and decision pages<br>
> **Caveat:** Docs were read from the `main` branch through the gh CLI on 2026-11-26, not from a pinned release tag. Web search returned nothing for a neutral comparison, and adopter evidence is lists only.

## Summary

The dossier reads primary documentation for Argo CD and Flux and settles several documentation-level differences while leaving the head-to-head question largely open. Flux requires `prune` on each Kustomization and checks drift with a server-side apply dry-run on each user-set interval, and it gained `.spec.ignore` rules in 2026-08. Argo CD makes prune and self-heal opt-in under `syncPolicy.automated`, and `ignoreDifferences` changes only the diff unless `RespectIgnoreDifferences=true`. On secrets the two projects take opposite stances: Argo CD recommends destination-cluster operators and warns about generation plugins, while Flux decrypts SOPS inside kustomize-controller. Flux verifies Cosign and Notation signatures on OCI artifacts, and the Argo CD pages read document OCI sources but no OCI signature verification. For fleets, a central Argo CD instance reaches into registered clusters, ApplicationSet generators have documented limits, and the argocd-agent Labs project offers a pull model of unverified maturity.

No claim in the dossier was corrected or removed in its own verification pass, and none contradicts an existing wiki page, so no page was marked contradicted.

## Key claims

- Flux `.spec.prune` "is a required boolean field to enable/disable garbage collection for a Kustomization", and `kustomize.toolkit.fluxcd.io/prune: disabled` exempts one object. URL: https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md.
- Flux runs a server-side apply dry-run on each interval to detect and correct drift. The documented example is ten minutes, and the interval is user-configurable.
- Flux can lock down cross-namespace references with `--no-cross-namespace-refs=true` and impersonate a ServiceAccount through `.spec.serviceAccountName`.
- Argo CD automated sync has separate prune and self-heal options, and "`argocd app sync` without `--prune` does not prune". URL: https://github.com/argoproj/argo-cd/blob/main/docs/user-guide/auto_sync.md. See [findings/no-neutral-benchmark-or-cncf-comparison-of-argo-cd-and-flux-was-found-so-the-comparison-rests-on-each-project-s-own-documentation](../findings/no-neutral-benchmark-or-cncf-comparison-of-argo-cd-and-flux-was-found-so-the-comparison-rests-on-each-project-s-own-documentation.md).
- `ignoreDifferences` uses JSON patches, JQ and `managedFieldsManagers`, is diff-only by default, and `RespectIgnoreDifferences` is "only effective when the resource is already created in the cluster". See [findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist](../findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist.md).
- Argo CD ServerSideApply uses `kubectl apply --server-side --force-conflicts`, and client-side migration transfers fields to `argocd-controller`.
- Flux `.spec.ignore` takes JSON Pointer paths, and "Omitting the `target` selector causes the rule to match **all** objects managed by the Kustomization". See [findings/a-flux-ignore-rule-without-a-target-selector-matches-every-object-the-kustomization-manages](../findings/a-flux-ignore-rule-without-a-target-selector-matches-every-object-the-kustomization-manages.md).
- Argo CD "strongly" recommends destination-cluster secret management and says generated manifests are stored "in plaintext in its Redis cache". See [findings/argo-cd-recommends-destination-cluster-secret-operators-and-warns-that-generation-plugins-cache-plaintext-manifests-in-redis](../findings/argo-cd-recommends-destination-cluster-secret-operators-and-warns-that-generation-plugins-cache-plaintext-manifests-in-redis.md).
- Flux's "only supported encryption provider is SOPS", with `metadata`, `kind` and `apiVersion` left in plaintext. See [findings/flux-kustomize-controller-decrypts-only-sops-and-requires-metadata-kind-and-apiversion-to-stay-in-plaintext](../findings/flux-kustomize-controller-decrypts-only-sops-and-requires-metadata-kind-and-apiversion-to-stay-in-plaintext.md).
- Flux OCIRepository verifies Cosign and Notation signatures, keyless identity matching and a pinned trust root. Argo CD documents OCI sources and an OCI generator, and its source-integrity page covers Git GPG only. See [findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification](../findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification.md).
- ApplicationSet limits: matrix takes two children, nesting is once, the Pull Request generator polls every 30 minutes by default, the OCI generator every 3 minutes, and the overview says "nine" while listing ten. See [findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes](../findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes.md).
- Progressive Syncs (RollingSync) is Beta since v3.3.0, forces autosync off and watches only Application health. See [findings/applicationset-rollingsync-is-beta-forces-autosync-off-and-watches-only-application-health](../findings/applicationset-rollingsync-is-beta-forces-autosync-off-and-watches-only-application-health.md).
- The ApplicationSet create-only policy "doesn't prevent Application controller from deleting Applications according to ownerReferences". See [findings/the-applicationset-create-only-policy-does-not-stop-owner-reference-deletion-of-applications](../findings/the-applicationset-create-only-policy-does-not-stop-owner-reference-deletion-of-applications.md).
- argocd-agent (Labs) describes agents that "reach back to a central hub", with Managed and Autonomous modes, and a Flux Kustomization can target a remote cluster through `.spec.kubeConfig`. See [findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity](../findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity.md).
- Release cadence: Argo CD v3.6.3, v3.5.9 and v3.4.15 on 2026-11-24, and Flux v2.10.1 on 2026-11-20, v2.10.0 on 2026-10-26. These are observations, not policy.
- Named adopters are lists only. See [examples/the-flux-adopters-data-file-lists-xenit-sortlist-tietoevry-nexxiot-soulcycle-and-luma-health-among-others-with-no-write-ups](../examples/the-flux-adopters-data-file-lists-xenit-sortlist-tietoevry-nexxiot-soulcycle-and-luma-health-among-others-with-no-write-ups.md).

## Open questions the dossier leaves

These items are UNVERIFIED or not found and are not facts: a neutral benchmark or CNCF comparison of Argo CD and Flux; Argo CD documentation of OCI signature verification or of ksops and SOPS; independent evidence that signed OCI beats Git, and registry rate limits; an argocd-agent maturity statement; a quantified scale limit for ApplicationSet or hub-and-spoke Argo CD; an observe-only mode in either tool comparable to Crossplane Observe; Argo CD AppProject multi-tenancy, Flux notification-controller, and UI or CLI documentation, which were not read. Several documentation paths returned 404 (the Flux website component pages, `fluxcd/flux2` CHANGELOG and adopter files, Argo CD `resource_hooks.md` and `applicationset.md`).

## Pages touched

[entities/argo-cd](../entities/argo-cd.md), [entities/flux](../entities/flux.md), [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](../comparisons/flux-versus-argo-cd-drift-and-prune-defaults.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), [comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md), [comparisons/flux-versus-argo-cd-architecture](../comparisons/flux-versus-argo-cd-architecture.md), [comparisons/push-versus-pull-delivery](../comparisons/push-versus-pull-delivery.md), [decisions/git-versus-oci-as-the-canonical-source](../decisions/git-versus-oci-as-the-canonical-source.md), [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md), [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md), [examples/the-argo-cd-users-file-lists-452-self-reported-adopters](../examples/the-argo-cd-users-file-lists-452-self-reported-adopters.md), [decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops](../decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops.md), [decisions/reach-spoke-clusters-from-a-central-argo-cd-hub-or-with-argocd-agent-pulling-from-the-spokes](../decisions/reach-spoke-clusters-from-a-central-argo-cd-hub-or-with-argocd-agent-pulling-from-the-spokes.md)
