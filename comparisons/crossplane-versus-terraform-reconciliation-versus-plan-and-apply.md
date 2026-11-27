---
title: Crossplane versus Terraform, reconciliation versus plan and apply
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
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

## Neutral evidence check (o6 dossier)

A later search for neutral comparisons found none that is both independent and current. The most independent source is a 2022 SuperOrbital post that reports no `terraform plan` equivalent and recreate-forcing field changes that may be ignored while the provider reports in sync, and it predates Crossplane v2, see [[examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane]]. The Spacelift article is a vendor of Terraform orchestration, and the VSHN post comes from a Crossplane-using integrator. Crossplane is CNCF graduated per the landscape file. The "no plan preview" row above therefore rests on a dated secondary source. See [[findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated]] and [[decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane]]. [[sources/research-gap-o6-platform-landscape]]

## A practitioner's objection from a Terraform user (secondary)

A Medium post by Gavin Yap (2025-01-10) is one more individual opinion and, by the author's own words, comes from someone who has not used Crossplane extensively. He argues for Terraform or OpenTofu with GitLab merge requests on four grounds: setup time (under an hour against several days), the cost of a portal for Crossplane self-service, disaster recovery of the cluster that runs Crossplane, and the value of `terraform plan` before changes to production data. It agrees with the table above on the review step and on the prerequisite of a running cluster, and it adds the disaster recovery point, which the wiki had not recorded. It does not change the table. A related anecdote shows a plan can mislead when a provider is faulty, see [[findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data]]. See [[examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal]]. The post is not the neutral comparison the evidence-check section above says is missing. [[sources/medium-terraform-opentofu-crossplane]]
