---
title: Continuous loops override intentional changes
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: [Fighting humans and other controllers]
tags: [pitfall, drift, operations, level-triggered]
---

# Continuous loops override intentional changes

## Observation

A continuous reconcile loop reverts any change that disagrees with the declared state, including intentional manual changes made during an incident and changes made by other controllers. The dossier calls this the main operational lesson for platform teams: decide who owns each field. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md)

## Interpretation

Every tool in the dossier ships an off-switch, which confirms the problem is common. Flux has `suspend`, which stops both applying and drift detection. Argo CD has a self-heal toggle. Crossplane has a pause annotation and management policies such as Observe-only. Config Connector accepts a reconcile interval of "0" to disable periodic reconciliation. See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## Mitigations

Document which system owns each field, use [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md) so writers do not clobber each other, and pause reconciliation deliberately and briefly during incident work. See [findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md).

## Related

[concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md), [examples/gitops-reverts-a-hand-edited-deployment](../examples/gitops-reverts-a-hand-edited-deployment.md)

## Staged adoption as the mitigation

Teams reduce surprise reverts by observing drift before correcting it. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md) and [findings/controllers-fighting-over-fields-cause-revert-loops](controllers-fighting-over-fields-cause-revert-loops.md).
