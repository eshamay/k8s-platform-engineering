---
title: "Research dossier: reconcile defaults gap cluster (Flux, Argo CD, Crossplane, ACK, Cluster API, Config Connector)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [reconcile-interval, flux, argo-cd, crossplane, ack, cluster-api, config-connector, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: reconcile defaults gap cluster (Flux, Argo CD, Crossplane, ACK, Cluster API, Config Connector)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-reconcile-defaults.md` (sha256 prefix b7be72012393)<br>
> **Kind:** Verified research dossier for gap cluster g3-reconcile-defaults, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing cadence, drift, and entity pages<br>
> **Caveat:** Claims are labeled VERIFIED or UNVERIFIED in the dossier. Only VERIFIED claims enter wiki pages as fact. Where a source is a repository default branch, the dossier reads it as of 2026-11-26 with no tag pinned.

## Summary

The dossier reads primary sources only: the live Flux, Argo CD, ACK, and Config Connector documentation, plus source files and docs fetched at named tags or default branches. It reports that each tool uses a different notion of "interval", so a single default cannot be compared across tools without naming the mechanism.

The Flux conflict is an inconsistency inside Flux's own documentation and not a version difference. The concepts page says a Kustomization reconciles every five minutes by default, while the Kustomization reference, the CRD Go type, and the HelmRelease reference all mark `.spec.interval` as required. The only defaults found are the `flux create` CLI's one-minute `--interval` flag. The 60-second figure is a recommended minimum ("should"), and the CRD carries a duration-format pattern but no minimum.

Argo CD changed its default between v2.14 and v3.0. Through v2.14.0 the documented default was 180 seconds with jitter 0. From v3.0.0 through v3.6.0 it is 120 seconds plus 60 seconds of jitter. The v3.0.0 FAQ calls the result a "default maximum polling interval ... 3 minutes", so the wording reads as before while the mechanism differs.

Crossplane's managed-resource poll interval is 1 minute in crossplane-runtime and Crossplane core, and provider-upjet-aws overrides it to 10 minutes with a 1-hour sync period. ACK defaults to 10 hours after `ResourceSynced`. Cluster API's `--sync-period` is 10 minutes, but it is a cache resync and not a cloud drift poll. Config Connector uses a 10-minute mean with jitter between 0.5 and 1.5 times the mean.

## Key claims

### Flux

- The concepts page says: "The reconciliation runs every five minutes by default, but this can be changed with `.spec.interval`." https://fluxcd.io/flux/concepts/ (live site, read 2026-11-26)
- The Kustomization reference says: "`.spec.interval` is a required field ... The minimum value should be 60 seconds." https://fluxcd.io/flux/components/kustomize/kustomizations/
- The CRD Go type marks `Interval` as `+required` with only a duration-format pattern, no default, and no minimum marker in the lines read. https://github.com/fluxcd/kustomize-controller/blob/main/api/v1/kustomization_types.go (default branch as of 2026-11-26)
- The HelmRelease reference says "`.spec.interval` is a required field". https://github.com/fluxcd/helm-controller/blob/main/docs/spec/v2/helmreleases.md
- The `flux create` global `--interval` flag defaults to one minute ("source sync interval"). https://github.com/fluxcd/flux2/blob/main/cmd/flux/create.go
- The Kustomization reference uses ten minutes only as an example: "As specified by `.spec.interval`, every ten minutes, the Kustomization runs a server-side apply dry-run". A guide example uses `interval: 60m0s # detect drift and undo kubectl edits every hour`.
- Source or spec changes are handled outside the interval ("this is handled instantly outside the interval window."), `retryInterval` defaults to `.spec.interval`, and the controller "can be configured to apply a jitter to the interval". The jitter value was not read.

### Argo CD

- v2.5.0 through v2.14.0: `timeout.reconciliation: 180s`. The v2.9.0 FAQ says "The default polling interval is 3 minutes (180 seconds)." The controller flag default is `defaultAppResyncPeriod = 180` at v2.14.0.
- The `timeout.reconciliation.jitter` key first appears in `argocd-cm.yaml` at v2.10.0 (absent at v2.9.0) with default 0. The v2.13.0 manifest says "Disabled when the value is 0, defaults to 0."
- v3.0.0: "Two minutes by default with additional jitter." and jitter "defaults to 1 minute." The v3.0.0 FAQ says "The default maximum polling interval is 3 minutes (120 seconds + 60 seconds jitter)."
- v3.6.0 still ships `timeout.reconciliation: 120s` and `timeout.reconciliation.jitter: 60s`, with controller constants `defaultAppResyncPeriod = 120` and `defaultAppResyncPeriodJitter = 60`. The same holds at the v3.1.0, v3.2.0, v3.3.0, and v3.5.0 tags sampled.
- The v3.2.0 high-availability page still says "The controller polls Git every 3m by default.", which is stale relative to that tag's manifest.
- Pull request 27683, merged 2026-07-31, is titled "fix(controller): treat `timeout.reconciliation=0` as disabled soft expiry". Only the title and state were read.
- UNVERIFIED: why the default changed. The v3.0 upgrade notes and pull request searches turned up nothing. Versions v2.0.0 to v2.4.0 were not sampled.

### Crossplane

- crossplane-runtime's managed reconciler has `defaultPollInterval = 1 * time.Minute`. https://github.com/crossplane/crossplane-runtime/blob/main/pkg/reconciler/managed/reconciler.go
- Crossplane core's `--poll-interval` flag defaults to 1 minute ("How often individual resources will be checked for drift from the desired state."), and the minimum per-resource poll interval defaults to 1 second. https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go
- provider-upjet-aws S3 provider flags default to `--poll` 10m, `--sync` 1h, and `--max-reconcile-rate` 100, with poll jitter of 5 percent of the interval. https://github.com/crossplane-contrib/provider-upjet-aws/blob/92ebe88a2b59925198184c13ea797cfba6a1df29/cmd/provider/s3/zz_main.go (commit 92ebe88)
- The design one-pager for a per-resource poll interval is marked "Status: Draft", but the feature is implemented: core defines `MinPollInterval` for the `crossplane.io/poll-interval` annotation at v2.4.4 and on main, and crossplane-runtime defines `AnnotationKeyPollInterval`. The design status is stale relative to the code.
- The Crossplane documentation page for the provider poll interval and the `--max-reconcile-rate` default on docs.crossplane.io was not read.

### ACK

- "By default, all ACK controllers attempt to detect drift once every **10 hours**." https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/ (marked deprecated in favor of a newer site)
- The runtime constant is `defaultResyncPeriod = 10 * time.Hour`. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go
- The Helm values `reconcile.defaultResyncPeriod` (seconds) and `reconcile.resourceResyncPeriods` override it for all kinds or per kind.

### Cluster API

- The core `--sync-period` flag defaults to 10 minutes and is described as "The minimum interval at which watched resources are reconciled (e.g. 15m)". https://github.com/kubernetes-sigs/cluster-api/blob/main/core/main.go (default branch as of 2026-11-26)
- This is a cache resync and not an infrastructure poll. No per-resource drift period, MachineHealthCheck requeue period, or other drift handling was found, and the book path tried returned 404.

### Config Connector

- The reconciliation page says each resource reconciles "after a jitter period with an average based on the preconfigured default interval", and it does not state one number. https://cloud.google.com/config-connector/docs/concepts/reconciliation
- The global default mean is `MeanReconcileReenqueuePeriod = 10 * time.Minute`, and `IAMPolicyReconcileInterval` is `10 * time.Minute`. The resolution order is Terraform service mapping, DCL metadata, IAM kind constants, then the 10-minute default. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/k8s/constants.go
- Jitter spreads requeues "between 1/2 * MeanReconcileReenqueuePeriod and 3/2 * MeanReconcileReenqueuePeriod", so the default mean gives 5 to 15 minutes.
- The annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` sets the average per resource. The page says "Setting the reconciliation interval to 0 is irreversible."
- Failure retries use exponential backoff to a default ceiling of 120 seconds, configurable only for direct-controller resources. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/features/exponential-backoff-configuration.md
- UNVERIFIED: per-kind interval values from Terraform service mapping and DCL metadata, so whether direct, Terraform-based, and DCL-based controllers differ by default stays open.

## Not covered by the dossier

- Why Argo CD changed its default, and `timeout.reconciliation` values from v2.0.0 to v2.4.0.
- The docs.crossplane.io page for the provider poll interval, and any Cluster API drift or MachineHealthCheck cadence.
- Per-kind Config Connector defaults, the Flux controller jitter value, and the origin of the five-minute wording on the Flux concepts page.
- Production adopters and incidents. The dossier names none, so this ingest adds no example pages for named adopters or incidents.

## Pages this source informs

[[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/ack]], [[entities/cluster-api]], [[entities/config-connector]], [[entities/upjet]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[comparisons/drift-detection-mechanisms-across-tools]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[findings/drift-detection-latency-is-the-interval]], [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[concepts/self-healing-and-drift-detection]]
