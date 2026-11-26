---
title: AWS Controllers for Kubernetes (ACK)
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: [ACK, AWS Controllers for Kubernetes]
tags: [tool, provider, aws]
---

# AWS Controllers for Kubernetes (ACK)

ACK is the AWS project that exposes AWS services such as S3, databases, and IAM as Kubernetes custom resources. It follows the pattern of controllers that act directly on an external API. [[sources/research-universal-control-plane]]

## Design properties

ACK runs one controller per AWS service. Each controller talks to a single AWS API endpoint and receives only the IAM permissions it needs, so permissions and releases are scoped per service. Reconciliation runs on change and on a periodic resync, with a default of 10 hours, confirmed in 2026-11-26 against both the drift-recovery page and the runtime source. Existing AWS resources can be adopted through annotations, a deletion-policy annotation chooses between delete and retain, and cross-account management uses IAM roles that are separate from Kubernetes RBAC.

## Pitfalls

A ten-hour resync means an out-of-band change may sit uncorrected for a long time, while adoption can collide with existing resources. See [[findings/immutable-fields-and-drift-collisions]], [[findings/destructive-deletion-of-external-resources]], and [[findings/blast-radius-and-privilege-centralization]]. The dossier flags the resync default as something to re-verify against current docs.

## Deletion policy documentation

Deleting an ACK custom resource deletes the AWS resource first by default. A `retain` policy, set by annotation, namespace annotation, or controller flag, keeps the cloud resource, which helps with migrations or with removing ACK management. Adoption is a separate feature that the dossier did not read. [[sources/research-declarative-vs-imperative]] See [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Reconcile behavior

The level-triggered dossier could not confirm ACK's resync or drift-recovery behavior, because the overview page lacked those details. ACK is expected to follow the same reconcile shape as other provider controllers. [[sources/research-level-triggered-vs-edge-triggered]] See [[examples/cloud-console-changes-reverted-by-provider-controllers]] and [[open-knowledge-gaps]].

## Related

[[concepts/provider]], [[concepts/managed-resource]], [[entities/config-connector]], [[examples/cloud-services-as-kubernetes-objects]]

## Drift recovery

The ACK drift-recovery page confirms the long resync: after `ResourceSynced = true` controllers keep reconciling about every 10 hours by default to limit AWS API cost and throttling, and the Helm values `reconcile.defaultResyncPeriod` and `reconcile.resourceResyncPeriods` shorten it per kind. This confirms the default noted earlier through a digest of the primary page. [[sources/research-self-healing-and-drift-detection]] See [[examples/ack-resync-period-tuning-for-stateful-resources]] and [[decisions/choosing-a-drift-check-interval-for-external-resources]].

## Conditions without observedGeneration

ACK publishes `ResourceSynced`, but its conditions lack `observedGeneration`, so consumers cannot distinguish a stale `ResourceSynced=True` from a current one. Issue 1583 proposes adding it, or publishing `False` at reconcile start. The issue was open with a frozen label when fetched. [[sources/research-spec-status-split]] See [[findings/missing-observedgeneration-hides-stale-status]] and [[decisions/publish-synced-false-at-reconcile-start]].

## One controller image per AWS service

The ACK overview says the project ships one controller image per AWS service, each reconciling custom resources into AWS API calls, with support for adopting pre-existing AWS resources and exporting fields to ConfigMaps or Secrets. The operator-pattern dossier cites it as an example of per-service controllers for an external system. [[sources/research-operator-pattern]] See [[examples/ack-ships-one-controller-per-aws-service]] and [[comparisons/how-flux-ack-and-cluster-api-split-controllers]].

## Resource adoption policies

The ACK adoption guide describes the `services.k8s.aws/adoption-policy` annotation with two values: `adopt-or-create` adopts an existing AWS resource or creates it, with the manifest as source of truth, and `adopt` imports strictly and fills the spec from AWS. The `adoption-fields` annotation names the identifier used to find the resource, such as a VPC ID, queue URL, SNS ARN, bucket name, or table name. Deleting the Kubernetes object deletes the AWS resource unless `deletionPolicy: Retain` is set, and the guide labels adoption a Beta feature. This fills the adoption gap noted above, though the dossier did not read ACK's idempotency behavior for creates beyond adoption. [[sources/research-idempotency]] See [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]], [[findings/adopt-or-create-can-take-over-a-look-alike-resource]], and [[decisions/adopt-or-create-or-require-explicit-import]].

## Deletion policy

By default ACK deletes the AWS resource and then the Kubernetes object. The `services.k8s.aws/deletion-policy: retain` annotation keeps the AWS resource, which the guide recommends for cluster migration and for S3 buckets and RDS databases. Lookup order is resource annotation, namespace annotation, then controller default, and retained resources can be re-imported with the adoption annotations. The page does not say how the ACK finalizer is named or removed. Source shows the name template `finalizers.<apiGroup>/<Kind>`, removed after the AWS cleanup, see [[findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup]]. [[sources/research-finalizers]] See [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]] and [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Conditions

ACK uses `ACK.Recoverable` for transient errors such as throttling, `ACK.Terminal` for errors that need a spec change, `ACK.ResourceSynced` for whether the AWS resource matches the spec, `ACK.Adopted`, `ACK.ReferencesResolved`, and `Ready` as the top-level indicator. [[sources/research-conditions]] See [[examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions]] and [[concepts/conditions]].

## Read-only annotation versus adoption

ACK offers the annotation `services.k8s.aws/read-only: "true"`, under which the controller syncs status from AWS, ignores spec, never creates, updates, or deletes, and shows an error if the AWS resource is missing. ACK's separate adoption feature gives full management, which mirrors the observe-versus-promote split in Crossplane's management policies. [[sources/research-managed-resource]] See [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]].

## Leaf provider beneath kro

The composite resources dossier shows ACK as a leaf provider. The Amazon EKS guide composes ACK S3 Buckets with ConfigMaps and Deployments in a kro RGD and passes the bucket ARN from `status.ackResourceMetadata` into the application's configuration. The dossier read none of ACK's own documentation on readiness or deletion. [[sources/research-composite-resource]] See [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].

## Operational topics inherited by a composition layer

The ACK overview says ACK "lets you define and use AWS service resources directly from Kubernetes" and ships one controller image per AWS service, which avoids CRD sprawl by construction. Its sidebar lists drift recovery, adoption, retention after deletion, field export into ConfigMaps or Secrets, and multi-account and multi-region management, which are the problems a composition layer inherits. The page is thin and the site is marked deprecated, so verify against the current site. [[sources/research-composition]]

## Provider behavior in the Providers dossier

The Providers dossier read the ACK concepts page in full. ACK reconciles immediately on a spec change and resyncs every 10 hours on the Amazon EKS managed capability, with exponential backoff on retries and no retry for permanent errors. Its conditions include `ACK.Terminal`, `ACK.Recoverable`, `ACK.Adopted`, `ACK.ReferencesResolved`, and `ACK.IAMRoleSelected`. Namespaces map to IAM roles through `IAMRoleSelector`, see [[examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management]], and cross-namespace references are off by default but are not tenant isolation, see [[findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation]]. The per-service packaging is compared with Crossplane families in [[comparisons/provider-families-versus-per-service-controllers]]. [[sources/research-provider]]

## Managed kro pairing on EKS

The Amazon EKS guide positions kro as the glue that composes workloads with ACK-managed AWS resources, such as S3 buckets, into "cloud building blocks" with default and immutable organizational settings, and the kro overview uses an ACK `Bucket` inside a `WebApp` graph. kro can wait for ACK status fields, such as a bucket ARN, that do not exist yet. See [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]]. [[sources/research-kro-and-abstraction-models]]

## Landscape view

In [[concepts/tooling-landscape]], ACK is the AWS-only member of the provisioning layer, shipping one controller image per service through ECR Public so a cluster installs only what it needs, with adoption of existing AWS resources, field export to ConfigMaps or Secrets, and cross-account management (https://aws-controllers-k8s.github.io/community/docs/community/overview/). The dossier notes that each service has its own release cadence. See [[examples/single-cloud-teams-pick-ack-per-service-or-azure-service-operator-v2-with-code-generated-crds]]. [[sources/research-landscape]]

## Resync default confirmed in the reconcile-defaults dossier

The ACK drift-recovery page says "By default, all ACK controllers attempt to detect drift once every **10 hours**", the runtime constant is `defaultResyncPeriod = 10 * time.Hour`, and the Helm values `reconcile.defaultResyncPeriod` (seconds) and `reconcile.resourceResyncPeriods` override it for all kinds or per kind. The docs page is marked deprecated in favor of a newer site. [[sources/research-gap-g3-reconcile-defaults]] See [[examples/ack-resync-period-tuning-for-stateful-resources]].

## Incident from the GitOps incidents dossier

ACK issue 2911 (2026-06) reports an Argo CD prune that deleted a WAFv2 WebACL CR, after which the CR stayed in `Terminating` because the controller did not map the AWS not-found error. See [[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].


## Missing observedGeneration seen from Argo CD

Argo CD issue 30373 (2026-10-23) reports that ACK resources have no `observedGeneration`, so Argo CD's built-in ACK health check reports Healthy about 2 seconds before the controller re-stamps its conditions after a spec change (iam-controller v1.10.1). The reporter's statement that ACK issue 1583 has been open since 2022 is SECONDARY-ONLY. See [[examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change]] and [[sources/research-gap-g1-operator-loop-failures]].

## Leaked and duplicated resources and adoption failures from the leaked-resources dossier

The 2026-11-26 dossier collects reporter-level evidence on two ACK weaknesses. First, a lost Create response duplicates the AWS resource or wedges the custom resource: a CI run created a second VPC endpoint during a controller rollout with leader election off ([[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]]), a GitOps bootstrap across two clusters left one duplicate Route 53 hosted zone per name ([[examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name]]), and an audit counts 48 resources in 22 controllers ([[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]]). Runtime pull request 292 (merged 2026-11-20) patches status right after Create. Second, `adopt-or-create` has no foreign-owner guard and behaves differently by kind ([[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]], [[findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge]]). The earlier note on this page that adoption fills the adoption gap should be read with those caveats. Most late-2026 ACK adoption reports come from one reporter. [[sources/research-gap-g1-leaked-resources-adoption]] See [[decisions/make-an-ack-create-retry-safe-with-a-stable-client-token-leader-election-or-a-recreate-rollout]].

## Adopters file

ACK's ADOPTERS file calls itself "a self-reported list of users". The first three rows name Adobe, BT, and Continuum Industries, with no object counts. See [[examples/adobe-lists-ack-for-global-kubernetes-cluster-provisioning-and-stateful-service-infrastructure]]. [[sources/research-gap-g1-named-adopters]]

## First-party pitfall reports from the other-tool pitfalls dossier

The 2026-11-26 dossier read the ACK community tracker. Most issues below were filed on 2026-11-09 by one reporter and so are one audit and not independent corroboration. Issue 3142 says ownership is recorded only in CR status, so overlapping controllers or a restored copy can give one AWS resource two owners ([[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]]). Issues 3152 and 3136 say adoption under Argo CD or Flux overwrites the AWS resource with the git spec, and a failed adoption patch can write a stub spec ([[findings/ack-adoption-under-a-gitops-agent-overwrites-the-aws-resource-with-the-spec-in-git-and-a-failed-adoption-patch-can-write-a-stub-spec]]). Issues 3153 and 3154 say pruning deletes the AWS resource and the namespace retain annotation is ignored in single `--watch-namespace` installs ([[findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs]]). Issue 3122 (sapphirew, 2026-10-31) is a separate reporter and a CI reproduction, already covered above. All were open with no maintainer root-cause confirmation. No ACK release-note breaking changes were retrieved. [[sources/research-gap-g1-other-tool-pitfalls]]

## Server-side apply behavior (m4 dossier)

The shared ACK runtime reconciler writes with controller-runtime merge patches and `StrategicMergeFrom` for Secrets and ConfigMaps, and a search found no `ForceOwnership`, `FieldOwner`, or `client.Apply` call outside a mock, so the runtime sets no server-side apply manager. The conclusion rests on absence at runtime commit b1f8861, and the per-service controllers were not read. The latest runtime release read was v0.68.0, published 2026-11-09. [[sources/research-gap-m4-ssa-conflict-policy]] See [[findings/the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager]] and [[comparisons/ssa-conflict-policy-across-tools]].

## Cache scope and what "resync" means (m5 dossier)

Service controllers set the cache namespaces and label selector from `--watch-namespace` and `--watch-selectors`, default to one concurrent reconcile per resource, and filter events with `GenerationChangedPredicate` unless ignore-field-drift is on. Correction note, 2026-11-26: the 10-hour "resync" earlier on this page is a `RequeueAfter` after a successful reconcile and not an informer resync. The runtime keys its resource manager factories by `GroupKind`. See [[examples/ack-service-controllers-scope-their-cache-by-namespace-and-label-selector-and-trigger-on-generation-changes]], [[findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack]], and [[findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately]]. [[sources/research-gap-m5-informers-caches]]

## Admission and CRD handling

The ACK runtime defines only a conversion webhook type and the s3-controller chart ships no webhook ([[findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only]]). Each service has its own Helm chart that carries its CRDs, and no written API-version policy was found ([[findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found]]). [[sources/research-gap-m6-admission-crds]]

## Under a GitOps agent and inside compositions (o3 dossier)

The deletion policy lookup is the resource annotation, then the namespace annotation, then the controller default, and first match wins, so a chart that stamps `deletion-policy: delete` on every custom resource defeats a controller-wide `retain` according to the reporter of issue 3153, see [[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]]. Issue 2361 says Flux server-side apply reverts reference fields that the controller rewrote ([[findings/flux-server-side-apply-reverts-ack-reference-fields-that-the-controller-rewrote-according-to-issue-2361]]), and issue 3131 says referenced kinds are not watched so a referencing resource waits on backoff ([[findings/ack-referencing-resources-wait-on-backoff-after-the-referenced-resource-syncs-according-to-issue-3131]]). ACK's runtime source defines `Ready` as equivalent to `ResourceSynced`, and Argo CD's built-in ACK script maps `ACK.Terminal=True` to Degraded and `Ready=True` to Healthy. The ACK documentation's own kro guide waits for ACK resources to be ready before creating dependents, see [[examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources]]. All the issue-based claims are SECONDARY-ONLY and none was maintainer-confirmed. [[sources/research-gap-o3-gitops-provider-managed]]
