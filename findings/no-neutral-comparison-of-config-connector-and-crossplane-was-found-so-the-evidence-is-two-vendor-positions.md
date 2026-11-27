---
title: "No neutral comparison of Config Connector and Crossplane was found, so the evidence is two vendor positions"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, crossplane, comparison, vendor-bias, evidence-gap]
---

# No neutral comparison of Config Connector and Crossplane was found, so the evidence is two vendor positions

## Observation

The dossier searched for a side-by-side comparison of Config Connector and Crossplane on Google Cloud and found only partisan or adjacent material. [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)

The Crossplane position comes from its lead maintainer. A 2021-02-02 blog post groups Config Connector, ASO, and ACK as add-ons and says "Where Crossplane differs is in how we expose cloud provider APIs", through Composition. In provider-gcp issue 283 the maintainer wrote that "a purpose built Crossplane provider offers a better experience for our community" because of API consistency, and that Config Connector through the Kubernetes provider is not "sufficient as a replacement for a \"true\" Crossplane provider" ([examples/crossplane-provider-gcp-issue-283-a-crossplane-maintainer-says-config-connector-through-the-kubernetes-provider-is-not-a-replacement-for-a-provider](../examples/crossplane-provider-gcp-issue-283-a-crossplane-maintainer-says-config-connector-through-the-kubernetes-provider-is-not-a-replacement-for-a-provider.md)).

The Google side is thinner. The issue author in thread 283 (association none) said Config Connector is open source and could be used in compositions through the Kubernetes provider, which is SECONDARY-ONLY. Google's 2023 blog compares Config Connector with Terraform and Cloud Build and does not name Crossplane. A 2024 question in provider-gcp issue 518 asked "what's better about provider-gcp?" and had no comments ([examples/crossplane-provider-gcp-issue-518-asked-why-provider-gcp-is-needed-when-config-connector-exists-and-had-no-comments](../examples/crossplane-provider-gcp-issue-518-asked-why-provider-gcp-is-needed-when-config-connector-exists-and-had-no-comments.md)).

## Structural differences visible in first-party sources

- Scope: Config Connector covers Google Cloud only. Crossplane covers many clouds through installable providers.
- Composition: Crossplane adds Composition, XRDs, and packages, and no composition layer was found in the Config Connector documentation read.
- Scoping: Config Connector resources are namespaced and tied to a project through namespace annotations. Crossplane managed resources were cluster scoped in the 2021 post, and the current docs show a namespaced `.m.` API group example, so the post is dated for Crossplane v2, see [comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md).
- Resource model: Crossplane providers use `forProvider`, `atProvider`, and `crossplane.io/external-name`. Config Connector uses spec and status with `resourceID` and the `state-into-spec` annotation.
- Drift cadence: the Crossplane runtime default poll is 1 minute with a per-resource `crossplane.io/poll-interval` annotation, while Config Connector's mean re-enqueue is 10 minutes with a per-kind or per-resource override. A Crossplane provider may set a different default through its own flag, which was not read.
- Cost: no Crossplane cost-of-ownership statement or measurement was found.

## What is not settled

Whether any Crossplane GCP provider matches Config Connector's resource coverage was not checked, and the dossier did not read the controlplane.com and encore.dev results or LibHunt. No test of both tools on one scenario exists in the wiki. The choice is laid out without a recommendation in [decisions/use-config-connector-directly-wrap-it-in-crossplane-through-the-kubernetes-provider-or-use-a-crossplane-gcp-provider](../decisions/use-config-connector-directly-wrap-it-in-crossplane-through-the-kubernetes-provider-or-use-a-crossplane-gcp-provider.md).

## Related

[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso](../comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso.md), [entities/config-connector](../entities/config-connector.md), [entities/crossplane](../entities/crossplane.md), [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md)
