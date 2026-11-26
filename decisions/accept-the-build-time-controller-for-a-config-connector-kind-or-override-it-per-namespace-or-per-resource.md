---
title: "Accept the build-time controller for a Config Connector kind or override it per namespace or per resource"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: []
tags: [decision, config-connector, controllers, direct, terraform, dcl, evidence-only]
---

# Accept the build-time controller for a Config Connector kind or override it per namespace or per resource

## Status

Draft. This records a decision point and the evidence for each option. It makes no recommendation, because the dossier found no adopter report of overriding a controller and did not test any override. [[sources/research-gap-o9-cadence-and-staleness]]

## Context

110 of the 814 kinds in the static table list more than one supported controller (66 Terraform-default and 15 DCL-default kinds also support Direct, and 29 Direct-default kinds also support Terraform). For those kinds an operator can leave the build-time default or pick a controller. [[findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them]]

## Options

**Option 1, accept the build-time default.** The table sets the controller and "existing resources are migrated regularly", so the default moves toward direct across releases. Evidence: the controller-types page. The cost is that the controller for a kind can change with an upgrade, and the dossier read no release notes on which kinds moved.

**Option 2, override per namespace.** Set `experiments.controllerOverrides` in the ConfigConnectorContext, which the page lists as the first routing step. Evidence: the controller-types page. See [[findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs]].

**Option 3, override per resource.** Set the annotation `alpha.cnrm.cloud.google.com/reconciler` to `direct`, `tf` or `dcl`. Evidence: the controller-types page, which does not state a support level beyond the `alpha.` prefix in the name.

## Evidence that bears on the choice

The page says direct controllers avoid translation overhead, report structured diffs in logs and populate `status.observedState`. The failure backoff ceiling is tunable only on direct controllers from 1.160.0 ([[findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0]]). The success cadence does not depend on the controller kind by default ([[findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence]]), though a kind with a Terraform service mapping may keep the mapping interval when run direct, which is untested.

## Consequences

Whichever option a team picks, the live CRD labels show the controller in use, so the choice can be audited. The dossier did not test switching a running resource between controllers.

## Related

[[entities/config-connector]], [[examples/config-connector-alloydbcluster-and-billingbudgetsbudget-show-kinds-that-support-more-than-one-controller]]
