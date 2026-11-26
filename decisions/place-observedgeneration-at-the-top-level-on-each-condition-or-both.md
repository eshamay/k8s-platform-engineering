---
title: Place observedGeneration at the top level, on each condition, or both
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [where observedGeneration should live]
tags: [observedgeneration, conditions, api-design, decision, evidence-only]
---

# Place observedGeneration at the top level, on each condition, or both

## Status

Open decision with options and evidence only. This page makes no recommendation. No source states a rule for choosing a placement, and the Kubernetes API conventions document both without ranking them. [[sources/research-gap-m3-status-conditions]]

## Context

An API author who publishes status must decide where to record the generation the controller has processed. The status-level field is described in the conventions as a way "to ensure that the reported status reflects the most recent desired status". The per-condition field on `metav1.Condition` is defined as meaning that "the condition is out of date with respect to the current state of the instance". KEP-1623, implemented and stable, makes the per-condition field a non-pointer integer because `.metadata.generation` is never zero. The `SetStatusCondition` helper in apimachinery copies a changed value into the existing condition. On the default branch the field also carries declarative-validation markers tagged `+k8s:beta(since: "1.38")`, read from the types file only and not from release notes.

## Options

### Option A: top-level only

This is the placement that kstatus and Argo CD consume. kstatus's condition struct has no per-condition field, Argo CD's docs tell health-check authors to use `status.observedGeneration`, and Config Connector's direct controllers write only the top-level value. The cost is that every condition shares one staleness marker. See [[findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field]] and [[examples/config-connector-direct-controllers-write-a-top-level-observedgeneration-and-leave-the-per-condition-line-commented-out]].

### Option B: per condition only

This is what `metav1.Condition` supports, and it lets each condition go stale independently, which matters when several writers or phases update different conditions. The ACK issue behind [[findings/missing-observedgeneration-hides-stale-status]] asks for this form. The cost is that kstatus and Argo CD cannot see the value, so their generation check is skipped. See [[findings/a-kstatus-resource-whose-controller-never-writes-status-observedgeneration-skips-the-generation-check-and-can-read-current-early]]. Cluster API's 2024 proposal moves its own conditions to this type. See [[examples/cluster-api-s-2020-conditions-proposal-had-no-observedgeneration-and-the-2024-proposal-moves-to-metav1-conditions]].

### Option C: both

The conventions permit this, and Flux does it: its setter stamps the current generation on every condition and its Kustomization status also keeps a top-level field. Simple and precise consumers then both work, at the cost of two places that must stay correct. See [[examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration]].

## Consequences

Whichever option is chosen, a consumer that reads a different placement from the one the author writes sees no staleness signal. The dossier found no incident that compares the options, and a third-party gist (SECONDARY-ONLY, read in part) describes setting `observedGeneration` even on a Stalled result. See [[comparisons/observedgeneration-top-level-versus-per-condition]], [[concepts/conditions]], and [[entities/kstatus]].
