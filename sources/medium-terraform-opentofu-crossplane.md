---
title: "Medium post: Choosing between Terraform (OpenTofu) and Crossplane (Gavin Yap, 2025)"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
aliases: []
tags: [terraform, opentofu, crossplane, comparison, self-service, disaster-recovery, secondary-source, opinion, targeted-pass]
---

# Medium post: Choosing between Terraform (OpenTofu) and Crossplane (Gavin Yap, 2025)

> [!NOTE]
> **Raw file:** `raw/medium-terraform-opentofu-crossplane` (sha256 prefix 13ec64862460)<br>
> **URL:** https://medium.com/@maclarensg_50191/choosing-between-terraform-opentofu-and-crossplane-3fdbacbefc68<br>
> **Author and date:** Gavin Yap, 2025-01-10, listed as an eleven-minute read<br>
> **Kind:** Secondary source and the author's personal opinion. The author says the article reflects his personal perspective and that he has not used Crossplane extensively in his professional work, so the Crossplane statements are a non-user's expectations.<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Crossplane, Terraform, and comparison pages

## Summary

The author, who maintains his own OpenTofu framework, compares Terraform and OpenTofu with Crossplane on setup, disaster recovery, complexity of resources, self-service, programmatic logic, reconciliation, and operational safety. He concludes that Terraform and OpenTofu with a Git platform such as GitLab give a simpler and safer path than adopting Crossplane and an internal developer portal, and that he sees no value in investing engineering time to deviate from an existing comprehensive Git tool. He also stresses keeping a human fallback.

The post is useful as a recorded practitioner objection to Crossplane and as a source of two anonymous operational anecdotes. It is not a neutral comparison, and the wiki's open question about neutral comparisons stays open.

## Key claims

All claims are the author's account or opinion.
- Setup: Terraform has a gentle learning curve, needs a state backend, and has a chicken-and-egg problem when the backend bucket must exist first. He notes that from Terraform 1.10 the S3 backend has an experimental `use_lockfile` option and that earlier versions and OpenTofu typically use DynamoDB for locking.
- He says setting up Kubernetes is already a significant effort and Crossplane adds Day 2 work. He estimates being productive with Terraform or OpenTofu in under an hour against several days for Crossplane with a developer platform.
- Disaster recovery: he says Crossplane's default disaster recovery approach relies on Velero, which he calls another tool to manage, and that without Velero the `crossplane.io/external-name` annotation must be patched during recovery. He says Terraform needs no disaster recovery of its own because the state sits in S3, while Crossplane needs a recovery objective for the cluster running it. He restores EKS clusters with Terraform and bootstrap scripts in under 30 minutes.
- Complexity: he says provisioning an S3 bucket in Crossplane needs a separate Kind per attribute group, such as Bucket, BucketVersioning, and BucketPolicy, which he compares to C structs. He shows a Composite resource, a CompositeResourceDefinition, a KCL function, and a Pipeline Composition, and reacts to their length with an exclamation.
- Self-service: he uses GitLab as the portal for Terraform and OpenTofu, with developers editing short YAML files and a merge request triggering pipelines. He says Crossplane needs Backstage or similar for a UI, which adds a learning curve, and that organizations that boast about portal success started earlier than most.
- Programmatic logic: he says complex HCL data manipulation can be hard, and that most of his team master it within three months. He says Pulumi helps developers who prefer general-purpose languages.
- Reconciliation: he says all IaC tools align actual and desired state only for resources they manage, that organizations enforce service control policies to stop creation outside IaC, and that reconciliation should be tuned to avoid API rate limits. For Crossplane he recommends the `--max-reconcile-rate` and `--poll-interval` flags and a `ControllerConfig` resource passing `--poll=5m`. For Terraform he suggests scheduled CI jobs to reconcile.
- Operational safety: he says `terraform plan` is the crucial preview feature. He reports a case in which an official Terraform provider from one of his service providers showed an update and no recreate in `terraform plan` but recreated the resource on apply and lost its data, with the plan logs kept in CI and the provider asked to investigate. The provider is not named.
- In another anecdote, a security team's service control policies stopped the IaC runners from executing requests until an API key was recreated, and manual IaC operations served as a fallback during the outage.
- Conclusion: Git is the source of truth for the portal, code, documentation, and dashboards, and automation or AI autopilot needs a human fallback and a quick disaster recovery plan, which he cannot imagine for Crossplane.

## Entities and concepts

- Entities: [entities/terraform](../entities/terraform.md), [entities/crossplane](../entities/crossplane.md), [entities/backstage](../entities/backstage.md), [entities/upjet](../entities/upjet.md).
- Concepts: [concepts/managed-resource](../concepts/managed-resource.md), [concepts/composite-resource](../concepts/composite-resource.md), [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md).

## Limits

The author discloses that his Crossplane knowledge is limited ("Pardon me if I do not know enough"), so the Crossplane half is the opinion of a non-user and was not tested. The post gives no measurement, and its time estimates are his own. His Crossplane manifests use the v1 and Upbound provider-aws names, and the post predates Crossplane v2, in which `ControllerConfig` was removed, see [entities/crossplane](../entities/crossplane.md). The Velero statement is not backed by a Crossplane documentation link, and this wiki has not read Crossplane's backup guidance, see [open-knowledge-gaps](../open-knowledge-gaps.md). The two incident anecdotes name no organization and no provider. A section of the saved text is marked truncated by the author. The framework he describes is his own project and he has an interest in recommending it.

## Pages touched

[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply](../comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply.md), [findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated](../findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated.md), [findings/crossplane-adoption-needs-a-hosting-cluster-kubernetes-skills-and-platform-team-owned-abstractions](../findings/crossplane-adoption-needs-a-hosting-cluster-kubernetes-skills-and-platform-team-owned-abstractions.md), [entities/crossplane](../entities/crossplane.md), [entities/terraform](../entities/terraform.md), [examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane](../examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane.md), and the new [examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal](../examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal.md) and [findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data](../findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data.md).
