---
title: "Upjet"
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
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

## Poll interval override in generated providers

A provider generated with Upjet can override the Crossplane default poll interval. provider-upjet-aws sets `--poll` to 10m, `--sync` to 1h, and `--max-reconcile-rate` to 100, with poll jitter of 5 percent of the interval, against a 1 minute default in crossplane-runtime and core. [[sources/research-gap-g3-reconcile-defaults]] See [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]].

## External name configuration (m7 dossier)

A name initializer sets the external-name annotation to `metadata.name` when none is given, and each resource configuration can disable it. `IdentifierFromProvider` disables it for provider-assigned IDs such as an AWS VPC, `NameAsIdentifier` and `ParameterAsIdentifier` keep a name-based default, and `TemplatedStringAsIdentifier` builds a full ID from the name. See [[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]], [[examples/provider-upjet-aws-maps-s3-buckets-to-a-bucket-parameter-and-vpcs-to-provider-assigned-ids]], and [[examples/provider-upjet-azure-and-provider-upjet-gcp-template-resource-ids-from-a-user-chosen-name]]. [[sources/research-gap-m7-operators-idempotency]]
