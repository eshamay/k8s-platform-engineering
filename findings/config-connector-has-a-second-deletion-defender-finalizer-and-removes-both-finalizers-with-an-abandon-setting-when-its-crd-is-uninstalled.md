---
title: "Config Connector has a second deletion-defender finalizer and removes both finalizers with an abandon setting when its CRD is uninstalled"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [config-connector, finalizers, deletion, abandon, crd-uninstall]
---

# Config Connector has a second deletion-defender finalizer and removes both finalizers with an abandon setting when its CRD is uninstalled

## Observation

Config Connector defines two finalizers in `pkg/k8s/constants.go`: `cnrm.cloud.google.com/finalizer`, the controller finalizer, and `cnrm.cloud.google.com/deletion-defender`. A separate deletion-defender controller removes only the deletion-defender finalizer when a resource is being deleted, so the main controller can then delete the Google Cloud resource and remove its own finalizer. [[sources/research-gap-m1-finalizers]]

When the resource's CRD is being uninstalled, the deletion defender takes a different path. A code comment says it removes both Config Connector finalizers and sets the resource to abandon. The effect is that uninstalling a CRD does not delete the Google Cloud resources of the custom resources that the CRD defines, because the abandon setting keeps them. [[sources/research-gap-m1-finalizers]]

## Evidence limits

Only the removal side was read. Where the deletion-defender finalizer is added, for which resources, and in which versions, was not found in the constants, the lifecycle handler, or the deletion-defender controller. The direct controllers were not read individually. The effect on resources is a reading of one code comment and was not tested on a cluster. The finding that the abandon setting does not release direct-controller resources stuck behind a deleted parent is a separate reported case, see [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]]. [[sources/research-gap-m1-finalizers]]

## Related

[[entities/config-connector]], [[findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup]], [[concepts/finalizers]]
