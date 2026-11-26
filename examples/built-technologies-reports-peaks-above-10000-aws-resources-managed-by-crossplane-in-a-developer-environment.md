---
title: Built Technologies reports peaks above 10,000 AWS resources managed by Crossplane in a developer environment
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [Built Technologies Crossplane adopter entry]
tags: [crossplane, adopters, built-technologies, self-reported, scale]
---

# Built Technologies reports peaks above 10,000 AWS resources managed by Crossplane in a developer environment

## Scenario

Built Technologies lists itself in the Crossplane ADOPTERS file and gives the largest measured-sounding resource count in the file for a single environment. [[sources/research-gap-g1-named-adopters]]

## What the entry says

The entry says "at times it has exceeded over 10,000 AWS resources managed by Crossplane", and the context is a developer environment and not production. It is undated and self-reported. URL: https://raw.githubusercontent.com/crossplane/crossplane/main/ADOPTERS.md.

## How to read it

The figure is a peak, with no statement of how many Crossplane instances held the objects, how long reconciliation took, or what memory the providers used. It shows that counts in the tens of thousands are attempted, which is the range where the scale findings about CRD count and polling cost matter. See [[findings/etcd-scale-limits-of-the-shared-store]].

## Related

[[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]], [[entities/crossplane]], [[concepts/scale-and-sharding]]
