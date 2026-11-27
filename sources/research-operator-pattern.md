---
title: "Research dossier: Operator Pattern"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [operators, controllers, kubebuilder, operator-sdk, research-dossier]
---

# Research dossier: Operator Pattern

> [!NOTE]
> **Raw file:** `raw/research-operator-pattern.md` (sha256 prefix eab72eca2e1b)<br>
> **Kind:** Research dossier summarizing 17 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several fetches were summarized by a tool that read only the first 100 KB of each page, and the quotes come from those summaries, so wording needs checking against the live pages. The dossier found no named-organization postmortem. Argo CD and Config Connector were not covered by any fetched page, and one Crossplane documentation path returned 404.

## Summary

The dossier defines an operator as a Kubernetes controller that understands two domains: Kubernetes and some other system such as a database, a cloud API, or cluster lifecycle. The pattern pairs a custom resource definition that adds a new Kind with a controller that watches instances of that Kind and drives the world toward the declared spec. The goal is to encode the runbook knowledge of a human operator, such as install, upgrade, backup, and failover, as code that runs continuously.

Mechanically the pattern is the ordinary Kubernetes control loop applied to custom types. The controller reads desired and current state, computes the difference, acts through the API server or an external API, and writes results to status. The upstream guidelines require controllers to be level-driven, to read from shared informer caches, to process keys from rate-limited workqueues, and to be idempotent. The dossier then shows Flux, Crossplane, Cluster API, ACK, and kro as the same pattern specialized to GitOps delivery, cloud resource composition, cluster lifecycle, AWS resources, and runtime-generated APIs. Its pitfall guidance is consistent: one controller per Kind, declarative APIs, status conditions, careful finalizers, least privilege, and an operator that can be removed without harming the workloads it manages.

## Key claims

Claims are grouped by the page they came from. Each URL below is a page the dossier read, and none is rich enough here to justify a separate source page.

### Definition and mechanics

- The Kubernetes operator page (https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) defines operators as "software extensions to Kubernetes that make use of custom resources to manage applications and their components."
- The same page walks through a hypothetical SampleDB operator that creates PVCs, StatefulSets, and Jobs and handles backups, upgrades, schema migrations, and cleanup on delete. See [examples/database-operator-encodes-runbooks](../examples/database-operator-encodes-runbooks.md).
- The same page lists implementation frameworks: kubebuilder, Operator Framework, Kopf, Java Operator SDK, kube-rs, KubeOps, and Metacontroller.
- The Controllers page (https://kubernetes.io/docs/concepts/architecture/controller/) says "Each controller tries to move the current cluster state closer to the desired state" and illustrates it with a thermostat and the Job controller.
- The Controllers page distinguishes controllers that act through the API server from those that touch external systems directly, such as the cluster autoscaler. See [examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly](../examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly.md).
- The Controllers page prefers several small controllers over one monolith.
- The Custom Resources page (https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) says custom resources combined with custom controllers "provide a true declarative API."
- The same page compares CRDs with aggregated API servers: CRDs need no extra server, and aggregated APIs give more control at the cost of running your own API server. See [decisions/crd-versus-aggregated-api](../decisions/crd-versus-aggregated-api.md).
- The same page says a custom resource suits a declarative API of small, infrequently updated objects with CRUD semantics and human-readable configuration. See [decisions/build-a-custom-operator-or-compose-existing-resources](../decisions/build-a-custom-operator-or-compose-existing-resources.md).
- The Red Hat introduction (https://www.redhat.com/en/blog/operators-over-easy-introduction-kubernetes-operators) describes an operator as "a Kubernetes controller that understands 2 domains: Kubernetes and something else," made of a CRD, a resource controller, and domain-specific operations.
- The Red Hat introduction presents an observe, analyse, act loop and lists configuration management, stateful app automation, HA and scaling, and lifecycle automation as use cases.

### Controller correctness

- The sig-api-machinery guide (https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md) says "Your controller may be off for an indeterminate amount of time before running again," so controllers must be level-driven. See [findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down](../findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down.md).
- The same guide requires SharedInformers for cached reads, rate-limited workqueues that process one key at a time, waiting for secondary caches to sync, and never mutating objects from shared caches. See [findings/mutating-objects-from-a-shared-cache-or-reading-an-unsynced-cache-corrupts-reconcile-input](../findings/mutating-objects-from-a-shared-cache-or-reading-an-unsynced-cache-corrupts-reconcile-input.md).
- Kubebuilder good practices (https://book.kubebuilder.io/reference/good-practices) recommend idempotent reconcile, status conditions that follow API conventions, and Kubernetes logging conventions.
- The same page says "Each controller should ideally have only one job." See [findings/multi-kind-controllers-break-encapsulation-and-scale-poorly](../findings/multi-kind-controllers-break-encapsulation-and-scale-poorly.md).
- The Google Cloud blog (https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps) advises one operator per application, SDKs such as Kubebuilder, declarative APIs, features compartmentalized across controllers, and asynchronous sync loops that do not block on errors. See [findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object](../findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object.md).
- The same blog covers monitoring through aggregated logs, well-labelled metrics, and metrics exposed on pod endpoints.
- The Finalizers page (https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) says finalizers "alert controllers to clean up resources the deleted object owned." Objects stick in Terminating because of failing cleanup logic, a controller that is not running, or blocked dependencies, and the page warns against manually stripping finalizers. See [findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](../findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md).

### Frameworks and maturity

- The Kubebuilder CronJob tutorial (https://book.kubebuilder.io/cronjob-tutorial/cronjob-tutorial) covers API types, markers, reconcile, webhooks, and tests for a Go operator built on controller-runtime. See [examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator](../examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator.md).
- The Operator SDK capability page (https://sdk.operatorframework.io/docs/overview/operator-capabilities/) defines five levels: Basic Install, Seamless Upgrades, Full Lifecycle, Deep Insights, and Auto Pilot. See [entities/operator-sdk](../entities/operator-sdk.md).
- The SDK page describes Level 5 as work to "significantly reduce/eliminate any remaining manual intervention" and treats metrics, alerts, and insights as Level 4. See [findings/operators-that-publish-no-standard-status-or-metrics-leave-their-state-opaque](../findings/operators-that-publish-no-standard-status-or-metrics-leave-their-state-opaque.md).
- The CNCF white paper (https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md) says "An operator provides a way to encapsulate the required activities, checks and state management of an application."
- The white paper lists stateful apps, upgrades, backup and DR, auto-remediation, and day-2 operations as use cases.
- The white paper advises one operator per application type, established frameworks, documented scope and RBAC, least privilege, provenance checks, and a design in which removing the operator does not disrupt applications. See [findings/operator-privileges-and-removal-behavior-set-the-blast-radius](../findings/operator-privileges-and-removal-behavior-set-the-blast-radius.md).
- The CNCF explainer (https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/) names Prometheus Operator, cert-manager, the Istio operator, Crossplane, Elastic's operator, and Postgres operators, and points to Artifact Hub and OperatorHub. See [examples/stateful-data-services-run-on-postgres-and-elastic-operators](../examples/stateful-data-services-run-on-postgres-and-elastic-operators.md) and [examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects](../examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects.md).

### Platform tools as operators

- Cluster API (https://cluster-api.sigs.k8s.io/user/concepts) manages clusters as custom resources from a management cluster, with pluggable infrastructure providers, and says "Extensibility is at the core of Cluster API." See [examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers](../examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers.md).
- Flux (https://fluxcd.io/flux/components/) is built from specialized controllers for source, kustomize, helm, notification, and image automation. See [examples/flux-splits-gitops-into-single-purpose-controllers](../examples/flux-splits-gitops-into-single-purpose-controllers.md).
- Crossplane compositions (https://docs.crossplane.io/latest/composition/compositions/) let platform teams define composite APIs that a function pipeline maps to managed resources, so controller logic is configured, not hand-coded. See [examples/crossplane-composition-replaces-a-hand-written-controller-for-composed-apis](../examples/crossplane-composition-replaces-a-hand-written-controller-for-composed-apis.md).
- kro (https://kro.run/docs/overview) says it "parses the expressions, infers the dependency graph, generates a CRD, and stands up a controller - all at runtime." See [examples/kro-generates-a-crd-and-controller-at-runtime-in-place-of-a-bespoke-operator](../examples/kro-generates-a-crd-and-controller-at-runtime-in-place-of-a-bespoke-operator.md).
- ACK (https://aws-controllers-k8s.github.io/community/docs/community/overview/) ships one controller image per AWS service, supports adopting existing AWS resources, and exports fields to ConfigMaps or Secrets. See [examples/ack-ships-one-controller-per-aws-service](../examples/ack-ships-one-controller-per-aws-service.md).
- The dossier compares these tools in [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md) and [comparisons/how-flux-ack-and-cluster-api-split-controllers](../comparisons/how-flux-ack-and-cluster-api-split-controllers.md).

### Dossier-level claims and absences

- The dossier found no named-organization postmortem, so stuck finalizers, reconcile storms, and CRD upgrade breakage are documented only as guidance. See [open-knowledge-gaps](../open-knowledge-gaps.md).
- Argo CD and Config Connector were not covered by any fetched page. The Crossplane page at `/latest/concepts/composition/` returned 404, so current documentation paths need checking.
- The whitepaper favors Go while the Kubernetes page lists many languages, and no source gives criteria for choosing.
- It is unclear how strictly the capability levels apply to non-Go or generic-composition operators such as kro and Crossplane.

## Related

[concepts/operator-pattern](../concepts/operator-pattern.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md), [concepts/finalizers](../concepts/finalizers.md), [entities/kubebuilder](../entities/kubebuilder.md)
