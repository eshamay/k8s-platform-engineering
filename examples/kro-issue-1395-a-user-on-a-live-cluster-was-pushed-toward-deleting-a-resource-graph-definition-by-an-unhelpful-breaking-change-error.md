---
title: kro issue 1395 a user on a live cluster was pushed toward deleting a resource graph definition by an unhelpful breaking-change error
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [kro issue 1395]
tags: [kro, schema, breaking-changes, rgd, user-report]
---

# kro issue 1395 a user on a live cluster was pushed toward deleting a resource graph definition by an unhelpful breaking-change error

## Scenario

On 2026-09-04 JacobGabrielson opened kro issue 1395. A schema change to an existing RGD was blocked by the breaking-change gate introduced in kro v0.8.0. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/kubernetes-sigs/kro/issues/1395

## What the reporter says

The error did not name the `kro.run/allow-breaking-changes` annotation. The reporter writes that "Operators reasonably conclude the only way forward is to delete and recreate the RGD". Recreation was unsafe on their live cluster because the RGD drove per-AZ ENIConfig, so a delete could have affected the instances and the resources behind them.

## Status and limits

It is a user report from one reporter, open when read, and the dossier did not confirm whether the error text changed in later releases. A related report, issue 1391, says tightened validation markers are not patched into the live CRD. See [[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]].

## Related

[[entities/kro]], [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]
