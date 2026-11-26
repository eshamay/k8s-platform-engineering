---
title: "Research dossier: operators and idempotency gaps (m7-operators-idempotency)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [operators, idempotency, external-name, config-connector, kro, cluster-api, backstage, operator-sdk, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: operators and idempotency gaps (m7-operators-idempotency)

> [!NOTE]
> **Raw file:** `raw/research-gap-m7-operators-idempotency.md` (sha256 prefix 6c986668a6dc)<br>
> **Kind:** Verified research dossier for gap cluster m7-operators-idempotency, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the operator, idempotency, external-name and conflict-handling pages<br>
> **Caveat:** Provider configuration files were read on default branches (main) and can be ahead of the release tags named. The dossier marks its own interpretive sentences as carrying no status, and so does this page.

## Summary

The dossier covers seven open gaps. Two are answered from primary text. The per-provider external-name gap is answered at the mechanism level: the Crossplane documentation says providers name external resources like the Kubernetes object by default, and the upjet source shows that a name initializer implements this and that each resource configuration can switch it off or override it. The Config Connector conflict gap is answered by the "Managing conflicts" page, which describes a namespace-scoped lease with a default of no conflict prevention.

The kro and Cluster API gap is answered for kro (labels, ApplySet tracking, intent recorded before apply, server-side apply without force, bounded retries) and at contract level for Cluster API (provider-owned tags, deterministic hashed names), but not at provider-implementation level. The Argo CD and Config Connector gap is answered for failure handling and not for the one-controller-per-concern question. The Backstage gap is partly answered, because the custom resource integration is documented and no Backstage document describes an operator pattern. The framework-choice gap has no source that gives selection criteria, and the capability-levels gap has one directly relevant sentence and no mention of composition tools.

Latest releases seen on 2026-11-26: Argo CD v3.6.3, Backstage v1.57.3, Cluster API v1.14.4, Crossplane v2.5.0, kro v0.10.0, Config Connector v1.162.0, Kubebuilder v4.16.0, Operator SDK v1.42.3, Java Operator SDK v5.7.0, Kopf 1.45.2, shell-operator v1.21.5, Metacontroller v4.17.11.

## Key claims

### Operator framework choice

- No source read gives selection criteria; the evidence is each project's self-description. VERIFIED (absence after searching READMEs and the Kubebuilder book introduction). See [[comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller]] and [[decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition]].
- The Operator SDK "provides workflows to develop operators in Go, Ansible, or Helm" and is a "framework that uses the controller-runtime library to make writing operators easier". VERIFIED.
- The Kopf maintainer writes "There is no active development of **new major** functionality for Kopf". VERIFIED. shell-operator says it is "not an operator for a _particular software product_". VERIFIED. Metacontroller asks for "a webhook (in any language)". VERIFIED.
- The CNCF white paper favors Go. UNVERIFIED in this run, so it stays an open question. kube-rs and KubeOps were not searched.

### Capability levels

- The levels page says an operator that does not manage a workload or delegates "to off-clusters orchestration services would remain at Level 1." VERIFIED. It also says the capabilities "may be independent of each other", and it does not mention Crossplane, kro, or composition. VERIFIED. See [[findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools]].

### Argo CD and Config Connector

- Argo CD retries a failed sync with exponential backoff, allows `-1` for unlimited retries, retries a self-heal sync after a 5 second default timeout, and marks a container in `CrashLoopBackOff` or `ImagePullBackOff` as Degraded. VERIFIED. Config Connector retries "with exponential backoff where maximum backoff is 2 minutes", converges in any creation order, and exposes a Ready condition and Kubernetes events. VERIFIED. See [[findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling]].
- Whether either tool follows one-controller-per-concern guidance is not answerable from the pages read. The Config Connector controller-types page was not read. UNVERIFIED.

### Backstage

- The Kubernetes feature is "designed around the needs of service owners, not cluster admins", configured custom resources are listed by group, apiVersion, and plural, entities are matched to objects by the `backstage.io/kubernetes-id` label, a missing CRD is "silently skipped", and a proxy exists for custom resource access beyond the defaults. VERIFIED. See [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]] and [[examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift]].
- Community Crossplane and Argo CD plugins exist (TeraSky-OSS and backstage/community-plugins). SECONDARY-ONLY: names seen in listings, plugin documentation not read. Software Templates as a layer above operators was not read. UNVERIFIED.

### kro and Cluster API creates

- kro labels children with `kro.run/owned` and related labels, tracks them with the ApplySet specification, sets no owner references by default, records the resources it is about to create in `status.managedResources` before applying, applies with server-side apply and rejects conflicts "rather than stealing the field", and retries with exponential backoff from one second to five minutes. VERIFIED. See [[findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force]].
- Cluster API provider best practices say "Do not use a derived infrastructure name as the sole lookup key", require "provider-owned tags or labels" as the robust mechanism, and ask for a deterministic hash when truncating names. VERIFIED. The InfraMachine contract has the provider surface `spec.providerID`, and the v1beta2 text names `status.initialization.provisioned`. VERIFIED. See [[findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm]].
- How specific Cluster API infrastructure providers recover from a lost create response was not read. UNVERIFIED. The kro.run documentation pages returned empty scrapes, so the kro claims come from the same documents in the GitHub source tree. UNREADABLE for the website.

### External-name defaults

- The Crossplane managed resources page says "By default Providers give external resources the same name as the Kubernetes object." VERIFIED. The upjet name initializer "sets external name to metadata.name if none specified" and `IdentifierFromProvider` sets `DisableNameInitializer: true` for identifiers "assigned by the remote client, such as AWS VPC". VERIFIED.
- In provider-upjet-aws, `aws_s3_bucket` uses `ParameterAsIdentifier("bucket")`, `aws_iam_role` and `aws_eks_cluster` use `NameAsIdentifier`, and `aws_vpc`, `aws_subnet`, `aws_security_group`, `aws_instance`, `aws_db_instance`, and `aws_kms_key` use `IdentifierFromProvider`. VERIFIED for the sampled kinds. Azure and GCP sample kinds use `TemplatedStringAsIdentifier("name", ...)`. VERIFIED. A complete per-kind table was not built, and provider-aws and the native Azure repositories were not read. UNVERIFIED. See [[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]], [[examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids]], and [[examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name]].
- The dossier corrected itself on release stamps: provider-upjet-aws v2.10.0 (2026-11-20), provider-upjet-azure v2.8.0 (2026-10-08), and provider-upjet-gcp v3.1.0 (2026-10-08). The files themselves were read on main.

### Config Connector conflicts

- Config Connector maps a resource by name, container annotation, and region or location, and acquires an existing same-named resource. Two objects in different namespaces managing one cloud resource is "possible, but not recommended". Conflict prevention uses the labels `cnrm-lease-holder-id` and `cnrm-lease-expiration`, a 40 minute lease, the status `ManagementConflict`, and the annotation `cnrm.cloud.google.com/management-conflict-prevention-policy` with values `resource` or `none`, where "The default value is `none`." VERIFIED. Prevention "does not work for resources that don't support labels", and `resourceID` conflicts in one namespace are ones "Config Connector cannot manage". VERIFIED. See [[findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set]] and [[examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource]].
- Behavior for two same-namespace objects with different names and no `resourceID` is not documented in the pages read. UNVERIFIED. The behavior was read from documentation and not tested.

## Corrections the dossier makes to earlier wiki text

- The wiki's comparison row said Crossplane's stable identity is an annotation "defaulting to `metadata.name`" and the managed resource page listed per-provider defaults as unknown. The dossier shows the default is real for name-based kinds and switched off for provider-assigned IDs. The comparison now carries a correction note.
- The kro page said how kro handles repeated reconciliation and partial failure was not covered, the idempotency concept said kro and Cluster API were not covered by any readable source, and the Config Connector page said nothing was found on conflict handling. These coverage statements are superseded and carry correction notes.

## Pages built from this source

Findings, examples, one comparison, and two evidence-only decisions are linked above. Open gaps received "Possible resolution" notes and none was closed.
