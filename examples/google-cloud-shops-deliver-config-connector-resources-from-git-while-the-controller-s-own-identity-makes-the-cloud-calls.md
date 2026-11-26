---
title: "Google Cloud shops deliver Config Connector resources from Git while the controller's own identity makes the cloud calls"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, config-connector, gitops, gcp]
---

# Google Cloud shops deliver Config Connector resources from Git while the controller's own identity makes the cloud calls

## Scenario

A team on Google Cloud wants cloud resources managed through the same Git workflow as application manifests. [[sources/research-landscape]]

## How it works

Argo CD or Flux delivers Config Connector custom resources from Git into the cluster. Config Connector then "reconciles the configured state against Google Cloud APIs asynchronously" using its own IAM service account and not the identity of the developer or the delivery tool (https://docs.cloud.google.com/config-connector/docs/overview). This decouples developer permissions from cloud resource rights, because authorization is centralized in the controller's service account.

## What goes wrong

The same design means the delivery tool's ordering is the only ordering, and a practitioner reports that Argo CD deletion has no ordering for Config Connector children, see [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]. It also means anyone who can create a resource gains the controller's rights, see [[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]].

## Related

[[entities/config-connector]], [[entities/argo-cd]], [[entities/flux]], [[examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts]]
