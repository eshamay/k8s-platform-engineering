---
title: Admission Webhooks and CEL
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: [Admission control, Common Expression Language, ValidatingAdmissionPolicy, Dynamic admission control]
tags: [api-machinery, admission, webhooks, cel]
---

# Admission Webhooks and CEL

## Definition

Admission control is the stage of the kube-apiserver request path that runs after authentication and authorization and before an object is persisted to etcd. Its job is to mutate defaults or to validate rules, so that an object is accepted, rejected, or rewritten no matter which client or GitOps tool made the request. Validation is increasingly handled natively with CEL (Common Expression Language) rules, either embedded in a CRD schema or declared as a policy object, instead of an external webhook. [[sources/krm-platform-vocabulary]] [[sources/research-admission-webhooks-and-cel]]

## Mechanisms

Built-in admission plugins run inside the API server. Dynamic admission control adds two extension routes. The first is the admission webhook, an HTTPS callout in which the API server sends an AdmissionReview request and expects an AdmissionReview response. Mutating webhooks run first and may return patches, then the object passes schema validation, then validating webhooks run and may only allow or deny. One source reports that mutating webhooks are called serially while validating webhooks run in parallel. [[sources/research-admission-webhooks-and-cel]]

A webhook configuration says which requests match, using `rules`, `namespaceSelector`, `objectSelector`, `matchPolicy`, and CEL `matchConditions`, and how to behave on trouble. `failurePolicy` defaults to `Fail` for `v1`, `timeoutSeconds` defaults to 10 seconds, `sideEffects` declares whether dry-run requests are safe, and `reinvocationPolicy` lets a mutating webhook be called again after later mutations. The API server authenticates to a webhook with kubeconfig-based credentials and mutual TLS.

The second route is in-process CEL. ValidatingAdmissionPolicy, stable since v1.30, splits the work into a policy that holds the CEL `validations`, a binding that sets scope and `validationActions` (`Deny`, `Warn`, `Audit`), and an optional parameter resource that supplies configuration. MutatingAdmissionPolicy extends the same shape to mutation using `ApplyConfiguration` or `JSONPatch`; the digest of the Kubernetes docs reports it as stable since v1.36, but that is unverified. CRD validation rules (`x-kubernetes-validations`) put CEL directly in the schema, with `self` and `oldSelf` for transition rules. See [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].

## Why it matters

Webhooks add a network dependency to every matching write, and an unavailable webhook can block cluster operations, including the writes needed to repair the webhook. In-schema and in-process CEL removes that dependency for many validation needs, which matters for platform APIs published through [[concepts/custom-resource-definition]]. KEP-3488 frames the CEL policy as an alternative for most validating use cases, and the Kubernetes docs now steer authors toward CEL when logic is simple enough and toward webhooks only when external data, complex code, or side effects are needed. [[sources/research-admission-webhooks-and-cel]]

The result is a division of labor and not a replacement. Webhooks stay the general escape hatch and are what controller frameworks and projects such as cert-manager scaffold for defaulting, validation, and conversion of their own CRDs. CEL is favored for declarative, cheap, in-process rules. Policy engines such as Kyverno layer reporting, exceptions, and background scans on top of CEL and can generate native policy objects. GitOps tools are not admission systems, but their server-side dry-runs hit admission behavior, so webhook configuration is a GitOps concern too. See [[concepts/server-side-apply-and-field-ownership]].

## Pitfalls

- A fail-closed webhook can block the writes needed to repair it. See [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]] and [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- A webhook that does not declare dry-run safety breaks server-side dry-run clients. See [[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]].
- Mutating webhooks can run more than once and in no guaranteed order. See [[findings/mutating-webhooks-can-run-repeatedly-and-in-no-guaranteed-order]].
- Certificates, the CA bundle, and network paths leave a startup window and a connectivity risk. See [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]].
- API evolution can break webhooks that drop unknown fields. See [[findings/api-evolution-breaks-webhooks-that-drop-unknown-fields]].
- CEL cannot reach external data and has bounded cost. See [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].
- A down conversion webhook can stall garbage collection. See [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].

## Tool and operator treatment

Flux surfaces webhook problems as reconcile failures and does not prevent them ([[entities/flux]]). Kubebuilder scaffolds webhooks into the manager binary ([[entities/kubebuilder]]). cert-manager is the best documented operator that uses all three webhook roles ([[entities/cert-manager]]). Kyverno compiles its CEL policies into native policy objects to reduce dependence on its own webhook ([[entities/kyverno]]). The dossier found no primary material on admission for Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, or Gatekeeper, so this wiki makes no claim about them; see [[open-knowledge-gaps]].

## Choosing between them

See [[decisions/validate-with-cel-rules-or-a-validating-webhook]] for where validation should run, [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]] for how a webhook should fail, [[comparisons/cel-validation-rules-versus-validating-webhooks]] for the CRD-level comparison, and [[comparisons/kyverno-versus-native-validating-admission-policy]] for the engine question.

## Additions from the CRD dossier

CEL rules in `x-kubernetes-validations` let a CRD express cross-field validation without a webhook, with per-rule cost limits protecting the apiserver. That dossier also shows that webhook outages recur as a failure class and that a down conversion webhook can stall garbage collection. [[sources/research-custom-resource-definition]] See [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]] and [[examples/cel-transition-rules-enforce-crd-immutability]].

## Examples

[[examples/vap-minimum-replicas-policy-with-per-environment-parameters]], [[examples/cel-transition-rules-enforce-crd-immutability]], [[examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks]], [[examples/kyverno-validatingpolicy-generates-native-vap-objects]], [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]], and [[examples/kubebuilder-operator-scaffolds-defaulting-and-validating-webhooks]].

## Related

[[concepts/composite-resource]], [[concepts/spec-status-split]], [[concepts/gvk-and-gvr]], [[concepts/crd-versioning-and-storage-migration]]
