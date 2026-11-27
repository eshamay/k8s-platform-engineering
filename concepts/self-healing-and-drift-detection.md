---
title: Self-Healing and Drift Detection
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Drift correction]
tags: [architecture, principle]
---

# Self-Healing and Drift Detection

## Definition

Self-healing is the continuous process by which a controller compares declared desired state with observed state and acts to close the gap, automatically reverting out-of-band changes such as a manual `kubectl edit` or a cloud console change. Drift is the gap itself: someone or something changed a live object or external resource away from what the source of truth says. The vocabulary note describes this as polling external APIs to make sure live infrastructure matches what is stored in etcd. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

The mechanism is the non-terminating Kubernetes control loop. It is level-triggered, so it reacts to the current state of an object and not to a particular event, which means a missed event does not cause permanent divergence because the next reconcile reads the latest state. Reconcilers must be idempotent, work is deduplicated by object key in a workqueue, and informers periodically resync to catch anything a watch stream missed. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [concepts/reconciliation-loop](reconciliation-loop.md), [concepts/level-triggered-vs-edge-triggered](level-triggered-vs-edge-triggered.md), and [concepts/idempotency](idempotency.md).

## Why it matters

Drift correction turns the declared spec into an enforced contract instead of a suggestion. It also creates operational tension: a human making an emergency console fix may see it reverted, and every correction policy needs an escape hatch. Polling external APIs also costs API quota, which ties into [concepts/informers-reflectors-and-workqueues](informers-reflectors-and-workqueues.md) and scale behavior.

## Two layers of drift

For in-cluster objects, Flux and Argo CD detect drift by diffing desired manifests against live objects. Flux runs a server-side apply dry-run, and Argo CD marks the Application OutOfSync and, when `selfHeal` is on, syncs again. Server-side apply field ownership (`managedFields`) makes this tractable and is also the source of the hardest edge cases. See [concepts/server-side-apply-and-field-ownership](server-side-apply-and-field-ownership.md) and [findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md). [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

For external infrastructure such as cloud databases, buckets, and IAM, the same loop calls a provider API. Crossplane treats `spec.forProvider` as the source of truth and reverts external edits, while ACK and Config Connector do similar work and kro orchestrates graphs of resources through an instance controller. Observing now costs an API call, so frequency is a trade-off. Cluster API extends the idea to machines, where a MachineHealthCheck replaces unhealthy Machines. See [comparisons/drift-detection-mechanisms-across-tools](../comparisons/drift-detection-mechanisms-across-tools.md).

## Tool behavior and escape hatches

Flux reconciles Kustomizations on an interval and reverts manual changes unless suspended, using a server-side apply dry run (required, no default, 60 seconds recommended minimum on the Kustomization page). For Helm releases, drift detection is a per-release option whose `mode` is `disabled` by default, `warn` to emit events only, or `enabled` to correct. Argo CD reverts live changes only when self-heal is enabled, and self-heal is off by default. Flux suspend is the escape hatch for incident work. Drift correction can also fight server-defaulted values, as Config Connector's legacy Merge mode showed. See [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](../comparisons/flux-versus-argo-cd-drift-and-prune-defaults.md) and [findings/defaulting-and-drift-reconcile-loops](../findings/defaulting-and-drift-reconcile-loops.md). [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

Every stack offers a way to say "do not fight this field or resource": Argo CD `ignoreDifferences`, Flux `driftDetection.ignore` and the `ssa` annotation, Crossplane `managementPolicies` and the pause annotation, and server-side apply conflict handling. See [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md). [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Cadence and cost

Drift correction is level-triggered reconciliation applied repeatedly, so its latency and cost are set by intervals and jitter. Flux requires an explicit interval (60 seconds recommended minimum), Argo CD v3.x polls with 120 seconds plus up to 60 seconds of jitter, and Config Connector offers an interval annotation where longer intervals reduce API quota use. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) External-API controllers choose much longer periods: ACK defaults to about 10 hours with per-kind overrides, and kro's dynamic controller resyncs every 10 hours. See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md), [decisions/choosing-a-drift-check-interval-for-external-resources](../decisions/choosing-a-drift-check-interval-for-external-resources.md), [findings/cost-of-constant-reconciliation](../findings/cost-of-constant-reconciliation.md), and [findings/continuous-loops-override-intentional-changes](../findings/continuous-loops-override-intentional-changes.md). [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Drift detection latency

Flux detects drift with a server-side apply dry run each interval, Crossplane with a poll interval, and Argo CD with self-heal, which triggers a sync after a default delay of about 5 seconds. Detection latency is therefore the interval, and long intervals trade API load for slower correction. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [findings/drift-detection-latency-is-the-interval](../findings/drift-detection-latency-is-the-interval.md).

## Failure modes

The sources agree that correction is never free of policy. The main failure modes are controllers fighting each other ([findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md)), false drift from late-initialized or defaulted fields ([findings/late-initialized-fields-create-false-drift](../findings/late-initialized-fields-create-false-drift.md)), field-ownership conflicts that stop correction before it starts ([findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md)), expensive polling against rate-limited APIs, and remediation that makes an outage worse ([findings/remediation-can-amplify-an-outage](../findings/remediation-can-amplify-an-outage.md)). Safe adoption is staged: see [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md). Younger controllers have also matured recently, so verify the version before assuming self-healing ([findings/immature-abstractions-in-the-control-plane-ecosystem](../findings/immature-abstractions-in-the-control-plane-ecosystem.md)).

## Examples

[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port](../examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port.md), [examples/argo-cd-app-of-apps-out-of-sync-from-image-updater](../examples/argo-cd-app-of-apps-out-of-sync-from-image-updater.md), [examples/incremental-gitops-adoption-with-manual-sync-and-self-heal](../examples/incremental-gitops-adoption-with-manual-sync-and-self-heal.md), [examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources](../examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources.md), [examples/ack-resync-period-tuning-for-stateful-resources](../examples/ack-resync-period-tuning-for-stateful-resources.md), [examples/cluster-api-machine-health-check-replaces-failed-nodes](../examples/cluster-api-machine-health-check-replaces-failed-nodes.md), [examples/tofu-controller-detects-terraform-drift-without-applying](../examples/tofu-controller-detects-terraform-drift-without-applying.md), and [examples/gitops-reverts-a-hand-edited-deployment](../examples/gitops-reverts-a-hand-edited-deployment.md).

## Related

[concepts/reconciliation-loop](reconciliation-loop.md), [concepts/gitops-pull-based-delivery](gitops-pull-based-delivery.md), [concepts/provider](provider.md), [concepts/managed-resource](managed-resource.md)

## To research

Production postmortems of drift-correction incidents, per-kind Config Connector drift cadence, and current Cluster API remediation behavior. Crossplane's poll interval and Config Connector's default mean are now verified, see [findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers](../findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers.md) and [findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible](../findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible.md). See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Update from the GitOps incidents dossier

Drift correction has a documented production failure that is not a revert loop. In a customer incident reported on 2026-11-20, Argo CD self-heal ran a partial sync that, per the post's author, skipped a migration hook on two of five regional Applications, see [findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed](../findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed.md). The mechanism is the author's claim, and the customer is unnamed. Source: [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md).

## Evidence that configuration outside the API escapes drift detection

Reddit's Calico route reflector configuration lived outside the Kubernetes API and outside Git, was hand-edited through Calico's own tool, and was forgotten. A Kubernetes upgrade invalidated its label selectors and took the cluster's routing down. Drift detection and reconciliation protect only what is declared. See [findings/hand-edited-calico-route-reflector-configuration-that-was-committed-nowhere-outlived-everyone-who-knew-about-it](../findings/hand-edited-calico-route-reflector-configuration-that-was-committed-nowhere-outlived-everyone-who-knew-about-it.md).
