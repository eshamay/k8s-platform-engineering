---
title: "The GKE Config Connector add-on can lag the latest release by 12 months or more, and Google discourages it for production"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, gke-add-on, version-lag, cost, installation]
---

# The GKE Config Connector add-on can lag the latest release by 12 months or more, and Google discourages it for production

## Observation

Google's installation-types page (last updated 2026-11-19) says the GKE add-on is available on GKE Standard only and "can lag behind the latest Config Connector releases by 12 months or more". A 2023-05-31 Google Cloud blog post on how Config Connector compares for infrastructure management says "we would like to discourage you using it in production because of the significant lag", and says Config Controller may bring Anthos fees. The manual install, in namespaced or cluster mode, has an operational cost the add-on avoids. [[sources/research-gap-o4-config-connector-ack]]

Config Connector itself has no price: the pricing page says "You will incur costs for these resources", meaning the Google Cloud resources it creates.

## Why it matters

Lag matters because fixes land on the release line: the known-issues page lists version-specific regressions, see [[findings/config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0]]. The cost of ownership statement is the only one the dossier found for Config Connector, and it found none for Crossplane, see [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]]. The blog compares Config Connector with Terraform and Cloud Build and does not name Crossplane.

## Related

[[entities/config-connector]], [[findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential]]
