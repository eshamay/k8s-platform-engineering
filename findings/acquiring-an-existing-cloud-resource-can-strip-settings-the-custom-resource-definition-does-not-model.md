---
title: Acquiring an existing cloud resource can strip settings the custom resource definition does not model
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [config-connector, acquisition, adoption, unmodeled-fields, storagebucket]
---

# Acquiring an existing cloud resource can strip settings the custom resource definition does not model

## Observation

Config Connector issue 14236 (2026-10-21, v1.117.0, open) reports that acquiring an existing StorageBucket removed its CSEK `FullyRestricted` enforcement configuration, because the custom resource definition has no field for it. The reporter expected undeclared fields to stay externally managed. The text reads "The encryption enforcement config is removed during acquisition." The report also says the setting is absent from bulk-export, so a diff of exported Kubernetes manifests would not reveal the change. The dossier labels this the reporter's reproduction and read no maintainer confirmation. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/14236

## Why it matters

Adoption is usually discussed as a risk of taking over a look-alike resource. This case is a risk even for the intended resource, because the declared spec is only a subset of the live settings and the controller's write can drop the rest. The change is also invisible in the usual review step. See [[examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config]] and [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].

## Mitigation

The evidence supports reading the live resource's full configuration before acquisition and comparing it with what the CRD can express. Crossplane's Observe-first import flow, which reads `status.atProvider` before management, gives a review step, and its import path has its own hazards in [[findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation]]. The dossier found no accidental-adoption report for Crossplane.

## Related

[[entities/config-connector]], [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]], [[decisions/adopt-or-create-or-require-explicit-import]]
