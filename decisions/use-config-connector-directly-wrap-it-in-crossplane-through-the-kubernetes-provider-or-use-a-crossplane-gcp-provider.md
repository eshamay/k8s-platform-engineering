---
title: "Use Config Connector directly, wrap it in Crossplane through the Kubernetes provider, or use a Crossplane GCP provider"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [decision, config-connector, crossplane, google-cloud, evidence-only]
---

# Use Config Connector directly, wrap it in Crossplane through the Kubernetes provider, or use a Crossplane GCP provider

## Status

Proposed, with no recommendation. The evidence is two vendor positions and no neutral comparison, see [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]].

## Context

A platform team on Google Cloud needs Kubernetes-native management of Google Cloud resources. Config Connector and Crossplane are both candidates, and the Kubernetes provider for Crossplane can manage arbitrary Kubernetes objects, including Config Connector custom resources. Whether a Crossplane GCP provider matches Config Connector's resource coverage was not checked. [[sources/research-gap-o4-config-connector-ack]]

## Options

### Option A: Config Connector directly

Resources are namespaced, use the namespaced-mode identity model, and carry a project through namespace annotations ([[findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential]]). No composition layer was found in the documentation read, so abstractions come from another tool such as kro ([[examples/self-service-gke-cluster-with-kro]]). The tool has no price of its own, the manual install carries operational cost, and the GKE add-on can lag releases by 12 months or more ([[findings/the-gke-config-connector-add-on-can-lag-the-latest-release-by-12-months-or-more-and-google-discourages-it-for-production]]). Drift re-enqueue averages 10 minutes. Deletion deletes the cloud resource unless `abandon` is set, and no documented ordering exists ([[findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown]]).

### Option B: Config Connector wrapped in Crossplane compositions through the Kubernetes provider

Compositions give a platform API over Config Connector objects. A Crossplane maintainer accepts the pattern but says it is not "sufficient as a replacement for a \"true\" Crossplane provider" ([[examples/crossplane-provider-gcp-issue-283-a-crossplane-maintainer-says-config-connector-through-the-kubernetes-provider-is-not-a-replacement-for-a-provider]]). The wiki found no worked example of Crossplane composing Config Connector or ACK, and the readiness gates in a composition depend on the provider `Ready` condition ([[findings/crossplane-function-auto-ready-and-kro-readywhen-gate-on-the-provider-ready-condition-and-no-worked-example-of-crossplane-composing-ack-or-config-connector-was-found]]).

### Option C: A Crossplane GCP provider

Managed resources follow the Crossplane resource model with `forProvider`, `atProvider`, and `crossplane.io/external-name`, plus `managementPolicies` (beta, provider-dependent) and a per-resource poll-interval annotation. The runtime default poll is 1 minute, and a provider may override it. Composition, XRDs, and packages are built in. Resource coverage against Config Connector is unchecked.

## Evidence summary

| Question | Evidence | Strength |
|---|---|---|
| Is Crossplane's model better? | Maintainer opinion | Vendor opinion |
| Can Config Connector be composed? | Commenter assumption, maintainer acceptance | Secondary |
| Cost of ownership | Config Connector add-on lag and install cost only | One side only |
| Coverage | Not checked | Unknown |

## Consequences

The decision is not settled by the evidence in the wiki. A test of both on one scenario, as the open gap suggests, would be the missing input. See [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]] and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].
