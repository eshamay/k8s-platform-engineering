---
title: "kro and ACK ship no admission webhook and rely on CRD schema and CEL validation, and no Argo CD webhook was found in a tree search only"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [kro, ack, argo-cd, webhooks, admission, verified]
---

# kro and ACK ship no admission webhook and rely on CRD schema and CEL validation, and no Argo CD webhook was found in a tree search only

## Observation

The kro v0.10.0 Helm chart has no webhook template; its templates are the deployment, services, RBAC, service account and service monitor (tree listing, VERIFIED). kro's docs say instances are validated by Kubernetes: "Kubernetes validates them against the generated CRD schema before kro processes them." The SimpleSchema validation marker is "A CEL validation rule evaluated by the API server against the field's value, available as `self`." https://github.com/kubernetes-sigs/kro/tree/main/helm/templates, https://raw.githubusercontent.com/kubernetes-sigs/kro/main/website/docs/docs/concepts/rgd/02-schema.md and https://raw.githubusercontent.com/kubernetes-sigs/kro/main/website/docs/api/specifications/simple-schema.md [[sources/research-gap-m6-admission-crds]]

The ACK runtime package defines only a conversion webhook type, with the comment "TODO(a-hilaly) add validating and defaulting types", and the s3-controller v1.16.0 chart has no webhook template or deployment reference, so ACK relies on CRD schema validation plus controller-side checks. https://raw.githubusercontent.com/aws-controllers-k8s/runtime/main/pkg/webhook/webhook.go

For Argo CD v3.6.3 the dossier found no admission webhook configuration under the manifests and charts paths, but that is a negative result from a tree-path search with no file contents read, so it is UNVERIFIED. The sync-options document does name a failure mode that is admission-adjacent: "Resource is too big to fit in 262144 bytes allowed annotation size." See [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]].

## Related

[[entities/kro]], [[entities/ack]], [[entities/argo-cd]], and [[examples/kro-integration-test-reports-a-third-party-webhook-denial-in-instance-status-and-recovers]].
