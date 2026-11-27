---
title: A practitioner prefers a YAML-abstracted OpenTofu framework with GitLab merge requests over Crossplane and a portal
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
aliases: []
tags: [opentofu, terraform, crossplane, self-service, gitlab, platform-engineering, secondary-source, opinion]
---

# A practitioner prefers a YAML-abstracted OpenTofu framework with GitLab merge requests over Crossplane and a portal

> [!NOTE]
> **Evidence grade:** Secondary and the author's opinion. Gavin Yap, Medium, 2025-01-10, https://medium.com/@maclarensg_50191/choosing-between-terraform-opentofu-and-crossplane-3fdbacbefc68. The author says he has not used Crossplane extensively, so this shows what an experienced Terraform user chooses and why, and says little about how Crossplane behaves.

## Scenario

The author built a framework on OpenTofu with three services so far, AWS networking, AWS IAM, and AWS IAM Identity Center. It runs through Taskfile and Docker, which mount the files and execute `init`, `plan`, and `apply`. Resource definitions are short YAML documents in which the author lists only the attributes that differ from defaults, and HCL is the programmatic layer that reads the YAML and turns it into resources. [[sources/medium-terraform-opentofu-crossplane]]

## How the self-service works

Developers write the YAML in GitLab's built-in editor and open a merge request, and the merge request triggers pipelines that run the infrastructure code. The author says no custom UI is needed when definitions are simple and documented with a README, and that an LLM-powered chatbot could help with writing them. He says the Crossplane route would need a portal such as Backstage and significant effort to build. His team learned the HCL data handling for the YAML processing within about three months, by his account. [[sources/medium-terraform-opentofu-crossplane]]

## Operational stories he uses

He argues for a human fallback with two stories. A provider's official Terraform provider once planned an update and recreated the resource on apply, see [[findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data]]. A security team's service control policies once stopped the IaC runners from executing requests until an API key was recreated, and the team kept working through manual IaC operations that its tooling made easy. He says he cannot see an equally quick fallback for Crossplane unless it has a robust disaster recovery plan. [[sources/medium-terraform-opentofu-crossplane]]

## How it fits the wiki

The same pattern, a Git-backed request path in front of an infrastructure tool, is what the wiki describes for portals and for Crossplane in [[findings/crossplane-adoption-needs-a-hosting-cluster-kubernetes-skills-and-platform-team-owned-abstractions]], and the contrasting execution models are in [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]]. The author's choice is a trade-off about operating cost and review, and it is not evidence that Crossplane fails at scale, for which the wiki's adopter evidence is in [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]].
