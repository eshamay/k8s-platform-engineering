---
title: "Config Connector issue 2894 a reporter says KCC lacks Terraform's dependency graph and owner-reference cleanup left ghost tag bindings"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [Config Connector issue 2894]
tags: [config-connector, ordering, owner-references, tag-bindings, issue, single-source]
---

# Config Connector issue 2894 a reporter says KCC lacks Terraform's dependency graph and owner-reference cleanup left ghost tag bindings

## Scenario

Issue 2894 was opened on 2024-10-10 against KCC 1.123.1 in cluster mode by a reporter with no repository association. The reporter characterizes the tool this way: "KCC does not have the same dependency graph that Terraform has", and says that cleanup driven by owner references left ghost tag bindings in Google Cloud. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/2894 [[sources/research-gap-o4-config-connector-ack]]

## Evidence strength

SECONDARY-ONLY. It is the reporter's characterization, and the dossier recorded no maintainer confirmation. It supports, but does not independently prove, the claim in [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]. Owner references delete without ordering, a point kro makes in [[findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets]].

## Lesson

Owner-reference garbage collection is not a substitute for dependency-ordered teardown against an external API, see [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
