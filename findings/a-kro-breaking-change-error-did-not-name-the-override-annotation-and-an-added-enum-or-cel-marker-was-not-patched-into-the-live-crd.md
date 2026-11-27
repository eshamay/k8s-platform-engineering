---
title: A kro breaking-change error did not name the override annotation and an added enum or CEL marker was not patched into the live CRD
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [kro, schema, breaking-changes, crd, rgd, pitfall]
---

# A kro breaking-change error did not name the override annotation and an added enum or CEL marker was not patched into the live CRD

## Observation

kro v0.8.0 added schema diffing that "blocks incompatible changes (like removing fields, changing types, or adding required properties) by default", and the `kro.run/allow-breaking-changes` annotation overrides the block. Two open user reports describe the edges of that gate. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md)

## The error did not point to the override

In issue 1395 (2026-09-04, JacobGabrielson) the reporter says the block error did not name the annotation. They write that "Operators reasonably conclude the only way forward is to delete and recreate the RGD", and the reporter said recreation was unsafe because the RGD drove per-AZ ENIConfig. See [examples/kro-issue-1395-a-user-on-a-live-cluster-was-pushed-toward-deleting-a-resource-graph-definition-by-an-unhelpful-breaking-change-error](../examples/kro-issue-1395-a-user-on-a-live-cluster-was-pushed-toward-deleting-a-resource-graph-definition-by-an-unhelpful-breaking-change-error.md). URL: https://github.com/kubernetes-sigs/kro/issues/1395

## Tightening an existing field is not detected as a change

Issue 1391 (2026-09-03) says that adding an `enum=` or CEL `validation=` marker to an existing field is accepted and the RGD reports Ready, but kro "never patches the live CRD's `openAPIV3Schema` to add the constraint". The CRD then keeps accepting values the RGD now forbids. The report carries a code reference and the dossier verified the issue text, not the behavior. The reporter's handle suggests a Splunk affiliation, which the issue does not state. URL: https://github.com/kubernetes-sigs/kro/issues/1391

## Evidence limits

Both items are single-reporter claims and both issues were open when read. Neither is a production outage. The practical reading is that a Ready RGD does not prove the generated CRD matches it, so compare the live CRD schema after tightening validation. See [findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion](platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion.md).

## Related

[entities/kro](../entities/kro.md), [comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators](../comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators.md), [decisions/conversion-webhook-versus-new-xrd-for-breaking-changes](../decisions/conversion-webhook-versus-new-xrd-for-breaking-changes.md)
