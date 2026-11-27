---
title: Crossplane import of an existing GCP database observes first and then takes control
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, import, adoption, management-policies, brownfield]
---

# Crossplane import of an existing GCP database observes first and then takes control

## Scenario

A team already runs a Cloud SQL instance that was created by hand or by another tool, and it wants Crossplane to manage the instance without recreating it. The official import guide uses a GCP DatabaseInstance as its worked case. [sources/research-managed-resource](../sources/research-managed-resource.md)

## Steps

The team first writes a [concepts/managed-resource](../concepts/managed-resource.md) whose `spec.managementPolicies` is `["Observe"]`. It adds the `crossplane.io/external-name` annotation set to the provider-side name of the existing instance, chooses a Kubernetes object name, and, if the same name exists in more than one region, adds a disambiguating `forProvider` field such as the region. After the manifest is applied, the provider reads the real instance and fills in `status.atProvider`. The guide says that "Crossplane imports observe only resources but never changes or deletes the resources." The team then inspects `status.atProvider`, copies the values it wants to own into `spec.forProvider` by hand, and finally changes the policies to `["*"]` so that the controller may create, update, and delete. URL: https://docs.crossplane.io/latest/guides/import-existing-resources/.

## Lesson

Import is a two-phase move, with a safe read-only phase that proves the object maps to the right external resource and a second phase that grants write authority. The guide labels management policies a beta feature that providers must support, so the recipe depends on provider support. The manual copy step and the ambiguous-name case are covered in [findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation](../findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation.md). The choice of which policies to end with is framed in [decisions/choose-management-policies-for-an-imported-resource](../decisions/choose-management-policies-for-an-imported-resource.md). For the same idea in other tools see [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](../comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md) and [examples/ack-adopt-or-create-brings-existing-aws-resources-under-management](ack-adopt-or-create-brings-existing-aws-resources-under-management.md).
