---
title: "Research dossier: admission and CRD gaps (m6-admission-crds)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [admission, webhooks, cel, crd, garbage-collection, kyverno, gatekeeper, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: admission and CRD gaps (m6-admission-crds)

> [!NOTE]
> **Raw file:** `raw/research-gap-m6-admission-crds.md` (sha256 prefix 7cac38f11490)<br>
> **Kind:** Verified research dossier for gap cluster m6-admission-crds, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the admission, CEL, CRD scale, garbage collection and CRD handling pages<br>
> **Caveat:** Files were read on default branches (main or master) on 2026-11-26 and can be ahead of the release tags named. Argo CD webhook absence rests on a tree-path search only.

## Summary

The dossier answers six open gaps from primary source files, Helm values, issues, pull requests and official pages. Latest releases on the read date were Kubernetes v1.37.3, Crossplane v2.5.0, kro v0.10.0, Argo CD v3.6.3, Config Connector v1.162.0, ACK s3-controller v1.16.0, Cluster API v1.14.4, Gatekeeper v3.23.1, Kyverno v1.20.0 and Backstage v1.57.3.

Admission: Config Connector and Cluster API ship many Fail webhooks, Crossplane core ships one Fail Usage webhook and uses CEL for its XRD and Composition validation, Gatekeeper defaults to Ignore, Kyverno defaults to Fail with a three-replica HA minimum, and kro and ACK ship none. CEL cost limits are settled from source: 10,000,000 per expression and 100,000,000 per CRD statically, and 1,000,000 per call and 10,000,000 per request or resource at runtime. The garbage-collector stall is fixed upstream by PR 125796 (v1.32) with a blockOwnerDeletion caveat. CRD count has no official limit and the evidence is issue reports. CRD handling is partly answered for Cluster API, Config Connector, ACK and Backstage.

## Key claims

- Crossplane's `crossplane-no-usages` webhook is Fail by default and settable to Ignore, and its XRD and Composition webhooks were replaced by CEL. VERIFIED. [findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel](../findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel.md)
- kro and ACK ship no webhook in what was read, and kro leans on CRD schema and CEL. VERIFIED. Argo CD ships none in manifests and charts paths. UNVERIFIED (tree search only). [findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only](../findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only.md)
- Config Connector's ten handlers and Cluster API's webhooks are all Fail. VERIFIED. [findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail](../findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail.md)
- Gatekeeper defaults to Ignore and documents the fail-closed deadlock. VERIFIED. [findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration](../findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration.md)
- Kyverno defaults to Fail, 10 s timeout, three replicas for HA, excludes its own namespace and kube-system by default, and an all-pods-down outage is recovered by deleting the resource webhook configurations. VERIFIED. [findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability](../findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability.md) and [findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded](../findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded.md)
- CEL limits: [findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime](../findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime.md) and [findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set](../findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set.md). VERIFIED.
- CRD scale: no official CRD count limit, thresholds cover built-in types, etcd default request 1.5 MiB and storage 2 GiB with 8 GiB suggested. VERIFIED. [findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit](../findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit.md) and [findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default](../findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default.md)
- Garbage collection: PR 125796 merged 2024-09-25 in v1.32. VERIFIED. [findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type](../findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type.md)
- CRD handling: [findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration](../findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration.md), [findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind](../findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind.md), [findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found](../findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found.md) and [findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd](../findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd.md). VERIFIED.

## Not found or unverified

- Measured Kyverno availability numbers, and any resilience comparison for Kyverno-generated native ValidatingAdmissionPolicy.
- An official limit on CRD count per cluster, and official apiserver memory per CRD.
- How long dependents remain after a down conversion webhook following the 1.32 fix, and any further partial-informer work.
- An ACK API-version stability policy, and Backstage CRD handling beyond `kubernetes.customResources`.
- Namespace exclusions in Cluster API and Config Connector webhook manifests (not searched exhaustively).
- One Kyverno HA page path returned empty content because the docs moved; the new path was read instead. GitHub code search was rate limited, so Argo CD searches fell back to tree listings.

## Pages updated from this source

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [concepts/scale-and-sharding](../concepts/scale-and-sharding.md), [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), [comparisons/kyverno-versus-native-validating-admission-policy](../comparisons/kyverno-versus-native-validating-admission-policy.md), [comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno](../comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno.md), [decisions/failure-policy-fail-or-ignore-for-an-admission-webhook](../decisions/failure-policy-fail-or-ignore-for-an-admission-webhook.md), [entities/crossplane](../entities/crossplane.md), [entities/kro](../entities/kro.md), [entities/argo-cd](../entities/argo-cd.md), [entities/config-connector](../entities/config-connector.md), [entities/ack](../entities/ack.md), [entities/cluster-api](../entities/cluster-api.md), [entities/backstage](../entities/backstage.md), [entities/kyverno](../entities/kyverno.md), and the findings and examples that cite this page.
