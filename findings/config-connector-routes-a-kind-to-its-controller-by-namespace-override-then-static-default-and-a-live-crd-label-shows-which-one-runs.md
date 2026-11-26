---
title: "Config Connector routes a kind to its controller by namespace override then static default, and a live CRD label shows which one runs"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector controller routing, reconciler annotation]
tags: [config-connector, controllers, routing, labels, annotations]
---

# Config Connector routes a kind to its controller by namespace override then static default, and a live CRD label shows which one runs

## Observation

The controller-types page gives a two-step routing precedence for the parent controller. A namespace override in the ConfigConnectorContext (`experiments.controllerOverrides`) wins, and otherwise the kind uses "the build-time reconciler defined in the Config Connector static mapping config". The same page documents a per-resource annotation `alpha.cnrm.cloud.google.com/reconciler` with the values `direct`, `tf` and `dcl`. [[sources/research-gap-o9-cadence-and-staleness]] https://docs.cloud.google.com/config-connector/docs/concepts/controller-types

At registration time the controller switches on the kind's `SupportedControllers` list and builds a Terraform, DCL, direct or IAM reconciler for each CRD, so an override can only select a controller that the table lists as supported for that kind. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/registration/registration_controller.go

## How to tell which controller a kind uses

Read the labels on the live CRD. `cnrm.cloud.google.com/tf2crd: "true"` means the Terraform-based controller, `cnrm.cloud.google.com/dcl2crd: "true"` means the DCL-based controller, and the page says "Absence of these labels: The direct controller manages the resource." For the build-time default of every kind see [[findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them]].

## Limits

The page does not state the support level of the `alpha.`-prefixed annotation beyond its name, and the dossier did not test an override. The statement that an override is limited to supported controllers is the dossier's reading of the registration loop.

## Related

[[entities/config-connector]], [[decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource]]
