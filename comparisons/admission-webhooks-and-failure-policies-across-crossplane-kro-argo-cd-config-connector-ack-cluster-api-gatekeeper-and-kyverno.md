---
title: "Admission webhooks and failure policies across Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, Gatekeeper, and Kyverno"
type: comparison
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [admission, webhooks, failure-policy, comparison, verified]
---

# Admission webhooks and failure policies across Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, Gatekeeper, and Kyverno

## Summary

Admission differs sharply by tool. Config Connector and Cluster API ship many webhooks, all with failure policy Fail. Crossplane core ships one Fail webhook, for Usage delete protection, and moved its XRD and Composition validation to CEL. Gatekeeper ships fail-open webhooks with a documented fail-closed path. Kyverno defaults to Fail. kro and the ACK service controller ship no admission webhook in the files read. Argo CD showed none in a tree-path search only. The facts below were read on 2026-11-26. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Side by side

| Tool | Webhooks shipped | Failure policy | Evidence |
|---|---|---|---|
| Crossplane v2.5.0 | One, `crossplane-no-usages`, on DELETE of resources labelled `crossplane.io/in-use=true`; XRD and Composition webhooks removed in favor of CEL | Fail by default, Helm value can set Ignore | [findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel](../findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel.md) |
| kro v0.10.0 | None in the Helm chart; relies on the generated CRD schema and CEL | Not applicable | [findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only](../findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only.md) |
| Argo CD v3.6.3 | None found in manifests and charts paths (UNVERIFIED, tree search only) | Not applicable | same finding |
| Config Connector v1.162.0 | Ten handlers in a separate webhook-manager, HPA 2 to 20 replicas, no namespaceSelector set | Fail on every handler | [findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail](../findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail.md) |
| ACK s3-controller v1.16.0 | None; runtime has only a conversion webhook type | Not applicable | kro and ACK finding above |
| Cluster API v1.14.4 | Mutating and validating webhooks for Cluster, Machine, MachineDeployment and more, plus conversion webhooks | Fail on every entry (21 Fail, 0 Ignore) | Config Connector and Cluster API finding above |
| Gatekeeper v3.23.1 | Validating and mutating webhooks, plus a check-ignore webhook | Ignore by default (3 s and 1 s timeouts, 3 replicas); check-ignore webhook is Fail | [findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration](../findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration.md) |
| Kyverno v1.20.0 | Webhooks generated from installed policies; catch-all Ignore webhooks when auto-update is off | Fail by default per policy, 10 s timeout | [findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability](../findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability.md) |

## Notes

Fail-open examples are the Gatekeeper default and Kyverno's static fallback. Fail-closed examples are Cluster API, Config Connector, the Crossplane Usage webhook and the Kyverno default. Which side is right for a given cluster is the reader's decision, laid out as options in [decisions/failure-policy-fail-or-ignore-for-an-admission-webhook](../decisions/failure-policy-fail-or-ignore-for-an-admission-webhook.md). Namespace exclusions in the Cluster API and Config Connector manifests were not seen, but the search was not exhaustive.

## Related

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md), [comparisons/kyverno-versus-native-validating-admission-policy](kyverno-versus-native-validating-admission-policy.md), and [comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules](admission-mechanisms-webhooks-vap-map-and-crd-rules.md).
