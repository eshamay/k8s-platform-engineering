---
title: "Upjet"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [upjet, crossplane, terraform, code-generation, provider]
---

# Upjet

## What it is

Upjet is a code-generation framework from the Crossplane project that produces Crossplane providers from Terraform providers. The repository describes two phases. At build time it reads Terraform schemas and generates Go types and controllers, and at runtime the generated controllers reuse Terraform's resource logic while users see only a Kubernetes API. [[sources/research-provider]]

## Where it is used

The dossier says Upjet underpins the official AWS, Azure, and GCP Crossplane providers and many community providers, for example for Grafana and GitHub. The README summary says it "bridges the gap between Terraform's vast provider ecosystem and Kubernetes-native infrastructure management," which is a paraphrase by the fetch summarizer and should be verified before quoting. [[sources/research-provider]]

## How a provider is generated

See [[examples/upjet-generates-crossplane-providers-from-terraform-providers]]. A resource is generated only if it has an external name configuration.

## Consequences and open points

Generated providers share behavior and bugs, see [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]]. Whether the runtime invokes Terraform as a subprocess or in-process, and what it costs in memory, was not confirmed. Related: [[entities/crossplane]], [[concepts/provider]], [[entities/tofu-controller]].
