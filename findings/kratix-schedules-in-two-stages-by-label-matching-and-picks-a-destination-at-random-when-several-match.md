---
title: "Kratix schedules in two stages by label matching and picks a Destination at random when several match"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Kratix scheduling]
tags: [kratix, destinations, scheduling, labels]
---

# Kratix schedules in two stages by label matching and picks a Destination at random when several match

## Observation

The Kratix multi-destination documentation (https://docs.kratix.io/main/reference/destinations/multidestination-management) says "scheduling happens in two stages". In the first stage, Promise dependencies go to every Destination by default, or only to Destinations whose labels satisfy the Promise's `spec.destinationSelectors`, which use equality-based `matchLabels` where all pairs must match. A Destination with `strictMatchLabels: true` accepts only Promises whose selectors match its labels. In the second stage, a Resource request triggers the `resource.configure` workflow and its outputs go to a matching Destination. "When multiple Destinations match, Kratix will by default randomly select a registered Destination". [[sources/research-gap-o6-platform-landscape]]

## Precedence

A workflow can write `/kratix/metadata/destination-selectors.yaml`. With a `directory` key, the selectors target that output subdirectory and Kratix will "ignore the Promise `spec.destinationSelectors` entirely" for it. Without a `directory` key, the selectors are added to the Promise selectors. On conflict, the order is Promise `spec.destinationSelectors`, then the Promise workflow file, then the Resource workflow file. [[sources/research-gap-o6-platform-landscape]]

## Limits

Only the documentation and the API type files were read. The scheduler and work-creator Go code was not, so how matching is implemented is unverified. The PCI-style routing in [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]] is consistent with these rules, but the vendor's illustration did not say whether it relied on `strictMatchLabels` to keep ordinary workloads off the PCI cluster. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/kratix]], [[findings/a-kratix-destination-writes-dependencies-and-resources-directories-and-its-filepath-mode-is-immutable]], [[findings/the-kratix-gitstatestore-insecure-field-defaults-to-true-when-unset-in-the-go-type]]
