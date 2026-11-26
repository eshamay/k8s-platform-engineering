---
title: Crossplane versus Terraform, reconciliation versus plan and apply
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [crossplane, terraform, drift, comparison, iac]
---

# Crossplane versus Terraform, reconciliation versus plan and apply

> [!NOTE]
> Both main sources are partisan. The Crossplane blog is the project's own advocacy, and the Encore article comes from a vendor of a competing product. No neutral comparison was read, and the wiki records that need in [[open-knowledge-gaps]].

## The core contrast

The Crossplane blog states the difference in one line: "Crossplane is a control plane, where Terraform is a command-line tool — an interface to control planes." Crossplane runs controllers that reconcile continuously, so a change made outside the declared state is detected and corrected without anyone running a command. Terraform and OpenTofu compute a plan and apply it when a person or a CI job invokes them, and drift shows up at the next plan. [[sources/research-crossplane-deep-dive]] See [[concepts/self-healing-and-drift-detection]] and [[concepts/declarative-vs-imperative]].

## Side by side

| Dimension | Crossplane | Terraform or OpenTofu |
|---|---|---|
| Execution model | Always-on controllers reconcile desired state | On-demand plan and apply, manual or CI-triggered |
| Drift handling | Detected and corrected automatically | Seen when the next plan runs |
| State | Each resource is an independent API object and endpoint, with no shared state-file lock | A state file that tools must coordinate and lock |
| Access control | Kubernetes RBAC on each API object | Controlled around the CLI, state, and credentials |
| Review step | No built-in plan preview, and the 2022 evaluation noted no dry run | A reviewable plan before apply |
| Prerequisites | A running Kubernetes cluster and Kubernetes expertise | A binary and a state backend |
| Familiarity | Newer, with a smaller talent pool | Simpler and more familiar, as the Crossplane blog itself concedes |

The table combines claims from the Crossplane blog, the Encore article, and the SuperOrbital evaluation, so the cells for Terraform come from sources with a stake in the answer.

## Where the two meet

Encore lists Terraform and OpenTofu, Pulumi, and AWS CDK as the main substitutes for Crossplane, along with single-cloud operators and Encore's own product. Crossplane also reuses the Terraform ecosystem through generated providers, see [[entities/upjet]], and the Flux-style [[entities/tofu-controller]] runs Terraform inside a reconcile loop. The choice is therefore partly about where the loop runs. See [[entities/terraform]], [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], and [[findings/crossplane-adoption-needs-a-hosting-cluster-kubernetes-skills-and-platform-team-owned-abstractions]].

## Open points

The dossier does not measure drift-correction latency or the cost of either approach, and it does not compare how each handles deletion safety beyond noting that Crossplane offers `managementPolicies` and Terraform has plan review. See [[decisions/choose-management-policies-for-an-imported-resource]] and [[findings/destructive-deletion-of-external-resources]].
