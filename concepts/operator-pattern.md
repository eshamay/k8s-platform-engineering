---
title: Operator Pattern
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Operator, Kubernetes operator]
tags: [controllers]
---

# Operator Pattern

## Definition

Packaging domain-specific operational knowledge, such as how to create, back up, upgrade, and delete a resource, into a custom controller paired with one or more CRDs. [[sources/krm-platform-vocabulary]]

## Why it matters

Operators turn runbooks into software. A [[concepts/provider]] in Crossplane is an operator whose domain is an external API. The pattern combines [[concepts/custom-resource-definition]] and [[concepts/reconciliation-loop]].

## Definition in the Kubernetes docs

The Kubernetes documentation says "Operators are clients of the Kubernetes API that act as controllers for a Custom Resource." Its SampleDB example has a user edit a custom resource while the operator creates PVCs, StatefulSets, and Jobs. [[sources/research-declarative-vs-imperative]] See [[examples/database-operator-encodes-runbooks]] and [[entities/kubebuilder]].

## Related

[[concepts/finalizers]], [[concepts/conditions]], [[entities/crossplane]]

## To research

Operator maturity models, frameworks (Operator SDK, Kubebuilder), and anti-patterns such as operators that hide too much.

## Custom resource plus custom controller

The CRD dossier states the operator pattern as a custom resource paired with a custom controller that reconciles the declared `spec` and reports in `status`, following the API conventions. [[sources/research-custom-resource-definition]] See [[examples/postgrescluster-custom-resource-reconciled-into-child-objects]] and [[concepts/custom-resource-definition]].

## Definition and the two-domain idea

The research dossier defines an operator as a Kubernetes controller that understands two domains: Kubernetes and something else, such as a database, a cloud API, or cluster lifecycle. The pattern pairs a CRD that adds a new Kind with a controller that watches instances of that Kind and drives the world toward the declared spec, so that the runbook knowledge of a human operator (install, upgrade, backup, failover) runs as code continuously. The Kubernetes documentation puts it as "software extensions to Kubernetes that make use of custom resources to manage applications and their components." [[sources/research-operator-pattern]] See [[examples/stateful-data-services-run-on-postgres-and-elastic-operators]] and [[examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects]].

## Mechanics

The pattern is the ordinary Kubernetes control loop applied to custom types. A controller observes desired state (the spec) and current state, computes the difference, acts through the API server or an external API, and writes results to status. Some controllers act through the API server, as the Job controller does, and others touch external systems directly, as the cluster autoscaler does. The upstream guidelines require controllers to be level-driven, to read from shared informer caches, to process keys from rate-limited workqueues, to be idempotent, and never to mutate objects from shared caches. [[sources/research-operator-pattern]] See [[examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/informers-reflectors-and-workqueues]], and [[concepts/idempotency]].

## Ecosystem and maturity

Kubebuilder and the Operator SDK, both built on controller-runtime, scaffold Go projects, and frameworks exist for Python, Java, Rust, and .NET. The Operator SDK capability model grades operators from Level 1 (Basic Install) through Seamless Upgrades, Full Lifecycle, and Deep Insights to Level 5 (Auto Pilot), which gives teams a shared maturity vocabulary. See [[entities/operator-sdk]], [[entities/kubebuilder]], [[entities/controller-runtime]], and [[examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator]]. Platform tools are the same pattern specialized to a domain: Flux for GitOps delivery, Crossplane for cloud resource composition, Cluster API for cluster lifecycle, ACK for AWS resources, and kro for runtime-generated APIs. See [[comparisons/how-flux-ack-and-cluster-api-split-controllers]] and [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]].

## Design guidance and pitfalls

The dossier's guidance is consistent across the Kubernetes docs, Kubebuilder, Google Cloud, and the CNCF white paper. Keep one controller per Kind, design declarative APIs, report state through status conditions, use finalizers carefully, run with least privilege, and make removal of the operator safe for the workloads it manages. Not every automation needs a custom resource. The pitfalls are collected in these pages.

- [[findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down]]
- [[findings/mutating-objects-from-a-shared-cache-or-reading-an-unsynced-cache-corrupts-reconcile-input]]
- [[findings/multi-kind-controllers-break-encapsulation-and-scale-poorly]]
- [[findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object]]
- [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]]
- [[findings/operators-that-publish-no-standard-status-or-metrics-leave-their-state-opaque]]
- [[findings/operator-privileges-and-removal-behavior-set-the-blast-radius]]
- [[findings/hand-written-operators-duplicate-what-composition-could-express]]

The decision pages are [[decisions/build-a-custom-operator-or-compose-existing-resources]] and [[decisions/one-controller-per-kind-or-one-multi-kind-controller]]. [[sources/research-operator-pattern]]

## Limits of the evidence

The dossier found no named-organization postmortem, so the failure modes above rest on documentation, not incident reports. The quotes came from tool digests that read at most the first 100 KB of each page. No source gives criteria for choosing a language or framework, and it is unclear how strictly the capability levels apply to composition-based operators. See [[open-knowledge-gaps]].


## Correction from the operator loop dossier (2026-11-26)

The statement above that the failure modes rest on documentation and not incident reports needs a qualifier. A later dossier found no formal organization-authored operator postmortem, which still holds, but it did find issue-level reports with root causes for operator failures, such as a reconcile storm in Cluster API provider RKE2 and a retry loop that grew Longhorn's controller memory about 25 times. Their figures are self-reported. See [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]], [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], and [[findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage]]. Source: [[sources/research-gap-g1-operator-loop-failures]].
