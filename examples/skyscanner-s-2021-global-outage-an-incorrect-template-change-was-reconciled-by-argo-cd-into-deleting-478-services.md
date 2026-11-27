---
title: Skyscanner's 2021 global outage, an incorrect template change was reconciled by Argo CD into deleting 478 services
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
aliases: [Skyscanner outage, Skyscanner namespace deletion]
tags: [postmortem, gitops, argo-cd, skyscanner, templating, global-outage, recovery]
---

# Skyscanner's 2021 global outage, an incorrect template change was reconciled by Argo CD into deleting 478 services

## Scenario

Skyscanner runs its services in a cells architecture on AWS: each cell is in one region and has several Kubernetes clusters per availability zone, with services deployed in an n+2 configuration so the site survives one cluster failing and another being drained. Cluster configuration is generated from a templating system, and Argo CD reconciles each cluster to what the configuration describes. [sources/skyscanner-namespace-deletion-postmortem](../sources/skyscanner-namespace-deletion-postmortem.md)

## What happened

On 25 August 2021, at about 1530 GMT, an engineer merged a change to the templating system that was meant to change no behavior. The change was reviewed by a peer, merged to master, and rolled out automatically. The edited file sat at the root of the cells configuration and rolled out regional configuration, so the system pushed it to every region at once. Because the change left out the `{{ }}` template markers, templating stopped applying and the namespaces that used the file, which was all of them, were reapplied and corrupted. At 1600 GMT Argo CD reconciled the clusters against a configuration that listed no valid namespaces and began deleting every service, 478 in all, across every availability zone and region. The post's summary is that Argo CD did this "ultimately because we told it to". [sources/skyscanner-namespace-deletion-postmortem](../sources/skyscanner-namespace-deletion-postmortem.md)

## How they recovered

Because clusters pull their state, the fix was to put correct configuration back and let each cluster reconcile itself into the right state. The team followed its backup and restoration process, focused on one region and the critical services first, and had skyscanner.net serving travelers from a single region by about 2030 GMT. Engineers rested, and the remaining regions and non-critical services came back over the following two days. An IAM policy change had made the backups harder to obtain at the critical moment, which the team counted among its lessons. [sources/skyscanner-namespace-deletion-postmortem](../sources/skyscanner-namespace-deletion-postmortem.md)

## What this example teaches

The failure shows both sides of pull-based GitOps. The reconciler faithfully enforced a bad desired state at global scale within roughly half an hour of the merge, and the same reconciler made recovery routine once the desired state was fixed. The enabling mistakes were process mistakes: a configuration file that had grown logic without tests or linting, a rollout path that applied a rarely changed root file to every region immediately, and runbooks that had not rehearsed a worldwide deletion. See [findings/templated-configuration-that-looks-like-config-is-code-and-needs-tests-and-a-regional-rollout-before-a-gitops-controller-applies-it-globally](../findings/templated-configuration-that-looks-like-config-is-code-and-needs-tests-and-a-regional-rollout-before-a-gitops-controller-applies-it-globally.md) and [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md).

## What is not established

The post does not say which Argo CD sync options were set, whether pruning was automated, or why resource deletion was not stopped by any guard. It also gives two durations for the outage, four and four and a half hours. The wiki therefore records the deletion as the documented behavior and does not claim a specific Argo CD misconfiguration. Related guardrails are compared in [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](../comparisons/flux-versus-argo-cd-drift-and-prune-defaults.md) and [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md).
