---
title: Terraform
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: [OpenTofu]
tags: [tool, iac, comparison]
---

# Terraform

A command-line infrastructure-as-code tool, with OpenTofu as its open-source fork, that computes a plan against a state file and applies it when a person or a CI job runs it. In the Crossplane project's framing, "Crossplane is a control plane, where Terraform is a command-line tool — an interface to control planes." [[sources/research-crossplane-deep-dive]]

## Role in this wiki

The wiki treats Terraform mainly as the contrast case for Kubernetes-native reconciliation. It is on-demand, state-file based, and reviewable through a plan, where [[entities/crossplane]] reconciles continuously and corrects drift. The Crossplane blog concedes that Terraform is simpler and more familiar. The comparison is in [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].

## Bridges into the Kubernetes world

[[entities/upjet]] generates Crossplane providers from Terraform providers, and [[entities/tofu-controller]] runs Terraform or OpenTofu from Flux-style resources with a detection-only drift model. Encore also lists Terraform and OpenTofu, Pulumi, and AWS CDK as the main alternatives to Crossplane.

## To research

State locking details, drift behavior in practice, and neutral comparisons with Kubernetes-native tools were not covered by the dossier.
