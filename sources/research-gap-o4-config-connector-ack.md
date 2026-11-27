---
title: "Research dossier: Config Connector and ACK gap cluster (o4-config-connector-ack)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, ack, kro, cluster-api, crossplane, argo-cd, flux, deletion, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Config Connector and ACK gap cluster (o4-config-connector-ack)

> [!NOTE]
> **Raw file:** `raw/research-gap-o4-config-connector-ack.md` (sha256 prefix c0d708f1d445)<br>
> **Kind:** Verified research dossier for gap cluster o4-config-connector-ack, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Config Connector, ACK, kro, Cluster API, Crossplane, Argo CD, and Flux pages<br>
> **Caveat:** Google documentation, source files at `master` or `main`, and issue trackers were read on 2026-11-26. Latest releases seen were Config Connector v1.162.0 (2026-11-23), Argo CD v3.6.3 (2026-11-24), kustomize-controller v1.10.2 (2026-11-20), kro v0.10.0 (2026-11-10), Cluster API v1.15.0-rc.0 (2026-11-24), and Crossplane v2.4.4 and v2.3.8 (2026-11-24).

## Summary

The dossier covers four open gaps. For Config Connector it settles the installation modes from Google's documentation and the operator source: namespaced mode is the default in the `ConfigConnector` CRD and the documented recommendation, and it is implemented through one `ConfigConnectorContext` per namespace. It also settles the deletion policy from source: the constants are `delete` and `abandon`, and the controllers branch only on `abandon`. A Google design document describes the stuck-deletion case in which a parent is deleted before its child. No read document or source file describes dependency-ordered teardown, so the ordering reports stay open issues from reporters.

The Config Connector versus Crossplane comparison stays thin. The only direct treatments are a Crossplane maintainer's 2021 blog post and 2020 to 2022 issue comments, plus a 2024 question with no replies. Google's 2023 blog compares Config Connector with Terraform and never names Crossplane. The dossier records both positions and does not pick between them.

For the failure-mode reads, the Argo CD and Flux documentation confirm defaults the wiki already had (no prune by default, no retry of a failed sync for the same commit, foreground propagation, four Flux deletion policies) and add one new edge: Flux `WaitForTermination` gives up at `.spec.timeout`. ACK has two documentation sites that disagree on adoption maturity, and the old one is flagged deprecated by a contributor. First-party incident evidence for kro, ACK, and Cluster API is release notes, a troubleshooting page, and issue reports, with no named-organization postmortem.

The dossier's verification pass removed nothing and corrected two items: the date of two comments on provider-gcp issue 283 (2022-06-24, not 2021) and the title and framing of provider-gcp issue 518. Nothing in it contradicts a claim the wiki states as fact.

## Key claims

Config Connector installation modes and deletion
- Config Connector installs manually in namespaced mode (recommended for most use cases) or cluster mode, according to Google's installation-types page last updated 2026-11-19. VERIFIED.
- The CRD's `mode` field accepts `cluster` or `namespaced`, and the default is `namespaced`, read from `configconnector_types.go` on master. VERIFIED.
- Cluster mode requires exactly one of `credentialSecretName` or `googleServiceAccount`. Namespaced mode requires one `ConfigConnectorContext` per enabled namespace, each naming its Google service account. VERIFIED.
- `ConfigConnectorContext` can set an immutable `managerNamespace` in place of `cnrm-system`, and `actuationMode: Paused` keeps reconciling with the API server without actuating the cloud; the context value overrides the `ConfigConnector` value in namespaced mode. VERIFIED.
- Namespace annotations choose the project, folder, or organization only when the resource does not specify one. VERIFIED. Whether this differs between modes was not read.
- Deleting a Config Connector resource deletes the Google Cloud resource by default, and `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. The documentation names no other value. VERIFIED.
- Source defines `DeletionPolicyDelete = "delete"` and `DeletionPolicyAbandon = "abandon"`, and `HasAbandonAnnotation` returns `ok && val == DeletionPolicyAbandon`, so any other value leaves the delete path. VERIFIED.
- The direct controller logs "deletion policy set to abandon; abandoning underlying resource" and skips the cloud call; the DCL controller checks the policy, then orphan status, then the resource lease. VERIFIED.
- The Terraform-based controller path for `abandon` was not located in `tfcontroller.go` by pattern search, and the verification pass reproduced the empty result. UNVERIFIED as a statement about behavior.
- The deletion-defender controller uses the finalizer `cnrm.cloud.google.com/deletion-defender`, and when a CRD is being uninstalled it removes both finalizers and sets `abandon`. VERIFIED.
- A design document `graceful-orphan-deletion.md` (last commit 2026-02-09) says a child whose parent was deleted first stays on `DependencyNotFound` and "The finalizer on the `GKEHubFeatureMembership` is never removed." It is a proposal, and whether it shipped was not checked. VERIFIED as to the document.
- Issue 534 (opened 2021-08-19, open, contributor-association reporter) says a BigQueryDataset deleted before its tables leaves both in failure and gives annotation workarounds. VERIFIED as an open reporter claim.
- Issue 2894 (opened 2024-10-10, KCC 1.123.1, cluster mode, no association) says "KCC does not have the same dependency graph that Terraform has". SECONDARY-ONLY.
- Issue 479 (opened 2021-05-27, KCC 1.46.0) reports a ContainerNodePool delete stuck after a quota error, and a contributor said backoff retry "should be the designed behaviour". SECONDARY-ONLY.
- Issue 13335 (opened 2026-09-20, open) says `abandon` leaves `managed-by-cnrm` labels, and the reporter has not reproduced it on a current release. SECONDARY-ONLY.
- The default re-enqueue mean is 10 minutes (`MeanReconcileReenqueuePeriod`). VERIFIED.
- DataflowFlexTemplateJob, FirestoreIndex, and IAMServiceAccountKey cannot be acquired, and service-generated IDs need `resourceID`. VERIFIED.
- Argo CD reverses wave order when pruning, so higher waves are pruned first. VERIFIED. Whether cascade application deletion honors waves is UNVERIFIED (the first 90 lines of the page were read).

Config Connector versus Crossplane
- A Crossplane maintainer (association member) wrote in provider-gcp issue 283 that "a purpose built Crossplane provider offers a better experience for our community" and that Config Connector through the Kubernetes provider is not "sufficient as a replacement for a \"true\" Crossplane provider". VERIFIED as vendor-maintainer opinion. The later comment is dated 2022-06-24.
- The issue author (association none) said Config Connector is open source and could be used in compositions through the Kubernetes provider. SECONDARY-ONLY.
- The 2021-02-02 Crossplane post says Crossplane makes all managed resources cluster scoped and groups Config Connector, ASO, and ACK as add-ons. VERIFIED, dated for Crossplane v2, whose docs show a namespaced `.m.` API group example.
- Provider-gcp issue 518 (opened 2024-11-04, open) asks "what's better about provider-gcp?" and had zero comments when read. VERIFIED.
- Google's 2023-05-31 blog compares Config Connector with Terraform and Cloud Build, does not name Crossplane, and discourages the GKE add-on in production because of version lag. VERIFIED.
- The add-on is GKE Standard only and can lag the latest release by 12 months or more (installation-types page, 2026-11-19). VERIFIED.
- Config Connector has no price of its own: "You will incur costs for these resources." VERIFIED.
- The Crossplane managed reconciler default poll interval constant is 1 minute, a per-resource `crossplane.io/poll-interval` annotation exists, and `managementPolicies` is beta and provider-dependent. VERIFIED, with provider flags not read.
- A neutral third-party comparison or cost-of-ownership figure was not found. UNVERIFIED.

Argo CD, Flux, ACK, Config Connector failure modes
- Argo CD automated sync does not prune by default, does not react to live-cluster changes without `selfHeal`, and does not re-attempt a sync for the same commit and parameters. The self-heal retry delay is 5 seconds, and the reconciliation timeout is 120 seconds plus up to 60 seconds of jitter. VERIFIED.
- Once a `manualDefaults` object is present, `prune: true` applies to manual syncs. Per-resource options `Prune=false`, `Prune=confirm`, `Delete=false`, `Delete=confirm`, and `PruneLast` exist, and prune propagation defaults to foreground. VERIFIED.
- Argo CD application cascade deletion needs the resources finalizer and defaults to foreground propagation. VERIFIED.
- Flux garbage collection also runs when a Kustomization is deleted. `deletionPolicy` takes `MirrorPrune` (default), `Delete`, `WaitForTermination`, and `Orphan`. `WaitForTermination` will "log an error and will allow the Kustomization to be deleted" after the timeout. VERIFIED.
- Flux `ssa: Merge` cannot preserve changes to atomic list fields, forcing a StatefulSet "may result in potential data loss", and drift detection uses a server-side apply dry-run, which can produce repeated "configured" events from null or empty fields. VERIFIED.
- ACK deletion policy resolves in the order resource annotation, namespace annotation, controller flag, with `delete` as the default. The old docs site says drift is checked every 10 hours. VERIFIED.
- The old ACK docs mark `AdoptedResource` not recommended and the annotation feature alpha with gates off by default; the new docs call annotation adoption Beta and "enabled by default in the ACK runtime". A contributor confirmed the old site is deprecated. VERIFIED, with the sources disagreeing by age.
- From controller releases on or after 2026-10-08, `--enable-cross-namespace` defaults to `false`. VERIFIED.
- Config Connector known issues record a webhook TLS race before 1.134.1 that blocks creating new resources while existing ones keep reconciling, a stricter `state-into-spec` check in 1.134.0 that wedged `SQLInstance` until 1.134.2, and direct-reconciler regressions in 1.132.0. VERIFIED.

First-party pitfall evidence for kro, ACK, Cluster API
- ACK issue 3142 (2026-11-09, iam-controller v1.11.3) says ownership is recorded only in status, so "there is no owner check before an update or a delete". SECONDARY-ONLY. Issues 3142, 3152, 3153, and 3154 share one reporter and are one audit, not independent corroboration.
- ACK issue 3152: a contributor said the reporter was linking to "our deprecated docs website" and the new guide covers omitting `spec`. VERIFIED for the reply.
- ACK issue 3153 says a CR that stops rendering deletes the AWS resource and "Once the API server has accepted the DELETE, there is no way back." SECONDARY-ONLY.
- ACK issue 3154 says the namespace deletion-policy annotation is read only from CARM or IAMRoleSelector caches. SECONDARY-ONLY.
- ACK issue 3122 (2026-10-31): a contributor named the Recreate deployment strategy and leader election as alternatives to a stable client token, and cautioned that a fixed token can block re-creation after an out-of-band delete. VERIFIED for the reply, SECONDARY-ONLY for the defect.
- kro v0.10.0 (2026-11-10) lists "Fix Graph cleanup after partial apply failures" (#1491), rejecting duplicate RGD identities before adopting objects (#1428), and failing closed on schema changes (#1430). VERIFIED.
- kro pull request 1445 (merged 2026-10-29) adds an alpha per-resource `deletionPolicy` (`Delete` or `Orphaned`) behind the off-by-default `DeletionPolicy` gate, and `Orphaned` leaves the resource in the cluster and releases it. VERIFIED. Whether any fix was prompted by a production incident was not determined.
- Cluster API v1.15.0-rc.0 (2026-11-24, pre-release) lists two breaking changes and says v1beta1 "is on track to be unserved in CAPI v1.16". VERIFIED.
- The Cluster API troubleshooting page documents infinite reconcile with co-authored slices and server-side apply failing to remove list items after atomic-to-map transitions, with client-side apply as the workaround. VERIFIED.
- No named-organization postmortem for kro, Config Connector, ACK, or Cluster API was found. UNVERIFIED (searched trackers and release notes only).

## Open questions the dossier leaves

- Does the Config Connector Terraform-based controller honor `abandon`? The pattern search found no branch.
- Did the `graceful-orphan-deletion` proposal ship, and in which release?
- Does Argo CD cascade application deletion honor sync-wave order?
- Do namespace project annotations or per-namespace controller pods behave differently between the two install modes? The manual-install and IAM pages were not read.
- What default poll interval do the Crossplane GCP providers set through their own flag?
- Is there any neutral comparison or cost-of-ownership study for Config Connector and Crossplane?
- Which named organizations, if any, have published a postmortem about kro, Config Connector, ACK, or Cluster API?

## Pages touched

See [log](../log.md) for the full list of pages created and updated by this ingest.
