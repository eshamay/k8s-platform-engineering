# Research dossier: Admission Webhooks and CEL

Research date: 2026-11-25

Method note: pages were read through WebFetch, which returns a model-generated digest of each page. For several long Kubernetes pages only the first ~100,000 characters were covered. web_scrape output was too large for direct reading, and a few other sites failed (listed under Open questions). Verbatim quotes below were passed through that digest step, so check them against the live pages before reusing them.

## Overview

Admission control is the stage of the kube-apiserver request path that runs after authentication and authorization and before an object is persisted to etcd. Built-in admission plugins run inside the API server. Dynamic admission control lets cluster operators add their own checks in two ways. Admission webhooks are HTTPS callouts. The newer in-process option is CEL, the Common Expression Language, used in ValidatingAdmissionPolicy, MutatingAdmissionPolicy and CRD validation rules. Together these decide whether an object is accepted, rejected, or rewritten, and they are how platform teams enforce guardrails and defaults on every API write, no matter which client or GitOps tool made it.

Webhooks come in two kinds. Mutating webhooks run first and may return patches. Validating webhooks run after mutation and schema validation and may only allow or deny. The API server sends an AdmissionReview request and expects an AdmissionReview response. Each webhook configuration says which requests it matches (rules, namespaceSelector, objectSelector, matchPolicy, CEL matchConditions) and how to behave on trouble (failurePolicy, timeoutSeconds, sideEffects, reinvocationPolicy). Because the API server blocks on these calls, a slow or unreachable webhook becomes a control-plane availability problem. Most of the operational guidance in the sources is about containing that blast radius.

CEL-based mechanisms were introduced to remove the external server for the common cases. KEP-3488 frames ValidatingAdmissionPolicy as a webhook alternative for most validating use cases, with a three-resource model: a policy (the logic), a binding (the scope and enforcement action), and an optional parameter resource (the configuration). CRD validation rules (x-kubernetes-validations) put CEL directly in the schema, with `self` and `oldSelf` for transition rules. MutatingAdmissionPolicy, which the Kubernetes docs list as stable since v1.36, extends the idea to mutation with ApplyConfiguration or JSONPatch expressions. The project docs now steer authors toward CEL policies when logic is simple enough, and toward webhooks only when external data, complex code, or side effects are needed.

The sources present a division of labor rather than a replacement. Webhooks remain the general escape hatch and are what controller frameworks like kubebuilder and projects like cert-manager scaffold for defaulting, validation and conversion of their own CRDs. CEL is favored for declarative, cheap, in-process rules. Policy engines such as Kyverno layer reporting, exceptions, background scans and richer CEL libraries on top, and can generate native VAP objects for resilience. GitOps tools (Flux, Argo CD) are not admission systems themselves, but they hit admission behavior through server-side dry-run, which makes webhook configuration (sideEffects, availability) a GitOps concern.

## Sources

### 1. Dynamic Admission Control
- URL: https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/
- Title: Dynamic Admission Control
- Publisher: Kubernetes project documentation
- Kind: official reference documentation
- Summary: The canonical description of mutating and validating admission webhooks. It covers the order of execution (mutating, then schema validation, then validating), the AdmissionReview contract, request matching through rules, namespaceSelector, objectSelector, matchPolicy and CEL matchConditions, and failure behavior through failurePolicy (Fail by default for v1) and timeoutSeconds (default 10 seconds). It explains sideEffects (None, NoneOnDryRun, Some) and why dry-run requests need it, reinvocationPolicy (Never or IfNeeded), and how the API server authenticates to a webhook (kubeconfig-based credentials, mutual TLS). Essential first read; later tutorials should link to it for field-level detail. Only the first ~100k of ~154k characters were covered by my digest.
- Quote: "Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy should use a validating admission webhook"

### 2. Validating Admission Policy
- URL: https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/
- Title: Validating Admission Policy
- Publisher: Kubernetes project documentation
- Kind: official reference documentation
- Summary: Explains the declarative, in-process alternative to validating webhooks. A policy holds matchConstraints, matchConditions, validations (CEL expressions over `object`, `oldObject`, `request`, `params`), variables, auditAnnotations and failurePolicy. A binding selects scope, supplies parameters via paramKind/paramRef, and sets validationActions (Deny, Warn, Audit). Type checking is informational. Stable since v1.30. Useful for tutorials because the policy/binding/param split mirrors how platform teams separate rule authors from cluster operators. Only the first ~100k of ~137k characters were covered.
- Quote: "Deny and Warn may not be used together since this combination needlessly duplicates the validation failure."

### 3. Admission Webhook Good Practices
- URL: https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/
- Title: Admission Webhook Good Practices
- Publisher: Kubernetes project documentation
- Kind: official operational guidance
- Summary: A checklist for webhook authors and cluster operators. It stresses low latency and short timeouts, tight match scoping, high availability behind a load balancer, patching only the fields you need, idempotent mutation (webhooks can be invoked more than once and ordering is not guaranteed), avoiding self-triggering loops and dependency loops between webhooks, excluding system namespaces, testing across minor upgrades (the Pod API gained sidecar containers in v1.29), and listing existing webhook configurations with kubectl. It also recommends CEL-based admission policies where they suffice. The best single source for pitfalls. Only the first ~100k of ~127k characters were covered.
- Quote: "Ensure that the mutating webhooks in your cluster are idempotent"

### 4. Kubernetes 1.30: Validating Admission Policy Is Generally Available
- URL: https://kubernetes.io/blog/2024/04/24/validating-admission-policy-ga/
- Title: Kubernetes 1.30: Validating Admission Policy Is Generally Available
- Publisher: Kubernetes blog
- Kind: release announcement / explainer
- Summary: Announces GA of VAP and states the motivation: a declarative, built-in mechanism that avoids running and securing a webhook service. It shows policy and binding examples and points to ecosystem projects (for example Kubescape) that use VAP. Good as a narrative bridge from the webhook model to CEL for readers new to API machinery. Only part of the page was covered by my digest.
- Quote: "Validating Admission Policy provides a declarative alternative to validating admission webhooks" (digest wording; verify)

### 5. Explore Validating and Mutating Admission Policies
- URL: https://kubernetes.io/docs/tutorials/cluster-management/admission-policies/
- Title: Explore Validating and Mutating Admission Policies
- Publisher: Kubernetes project documentation
- Kind: official tutorial
- Summary: A hands-on walkthrough. It creates a ValidatingAdmissionPolicy requiring Deployments to have at least two replicas, binds it, and tries the three enforcement actions (Audit, Warn, Deny). A second part builds a MutatingAdmissionPolicy using ApplyConfiguration or JSON Patch with optional parameters. It notes that new policies do not retroactively affect existing objects. A good lab for a ramp-up tutorial. Only the first ~100k of ~113k characters were covered.

### 6. Kubernetes 1.25: CustomResourceDefinition Validation Rules Beta
- URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/
- Title: Kubernetes 1.25: CustomResourceDefinition Validation Rules Beta (page title as returned by search, truncated)
- Publisher: Kubernetes blog
- Kind: feature announcement / explainer
- Summary: Introduces `x-kubernetes-validations` in CRD OpenAPI schemas. Rules are CEL expressions evaluated by the API server with `self` for the value at that schema node and `oldSelf` for transition rules on updates. The post positions them as a webhook replacement for most CRD validation, with no network hop and no extra deployment, and notes that rule cost is bounded to protect the API server (a schema with unbounded lists or strings can be rejected at CRD creation). Useful for explaining how CRD authors, including Crossplane and kro-style abstractions, can validate without webhooks. Only part of the page was covered.

### 7. Enforce CRD Immutability with CEL Transition Rules
- URL: https://kubernetes.io/blog/2022/09/29/enforce-immutability-using-cel/
- Title: Enforce CRD Immutability with CEL Transition Rules
- Publisher: Kubernetes blog
- Kind: tutorial blog
- Summary: Shows concrete patterns: `self == oldSelf` for immutable fields, `self.all(x, x in oldSelf)` for append-only lists, and key-immutable maps. It explains that transition rules run only on updates where an old value exists. Highly reusable examples for a tutorial on CRD guardrails (for example an immutable region or storage class on a managed-resource claim). Only part of the page was covered.

### 8. CEL for Admission Control (KEP-3488)
- URL: https://www.kubernetes.dev/resources/keps/3488/
- Title: CEL for Admission Control
- Publisher: Kubernetes Contributors site (SIG API Machinery KEP)
- Kind: KEP / design document
- Summary: The design rationale. Webhooks add infrastructure, latency and reliability burden, so the KEP proposes an in-process alternative. Goals include covering most validating use cases and robust type checking under version skew. Non-goals include mutation (later handled by a separate KEP), full webhook parity, and building a whole policy framework. It describes the policy/binding/param model, the CEL variables, phased delivery, and risks such as policies matching admission-control resources themselves, which is prevented. Only the first ~100k of ~138k characters were covered.
- Quote: "CEL expressions have comparatively small impact on latency and are in-process" (digest wording; verify)

### 9. K8s API Admission Control and Policy
- URL: https://www.zeng.dev/post/2023-k8s-api-admission/
- Title: K8s API Admission Control and Policy
- Publisher: ZengXu's blog
- Kind: source-code walkthrough
- Summary: Traces a request through the kube-apiserver filter chain, aggregator, decoding and conversion, the admission plugin chain, and storage. It highlights that mutating webhooks are called serially while validating webhooks run in parallel, and shows the AdmissionReview patch and allow/deny shapes plus where the ValidatingAdmissionPolicy CEL evaluation plugs in (v1.26 alpha era). Helpful for readers who need a mental model of where admission sits.
- Quote: "Matching webhooks are called in serial; each one may modify the object if it desires." (digest-rendered)

### 10. How to Configure Webhook FailurePolicy for High Availability
- URL: https://oneuptime.com/blog/post/2026-02-09-webhook-failurepolicy-ha/view
- Title: How to Configure Webhook FailurePolicy for High Availability
- Publisher: OneUptime blog
- Kind: engineering blog / how-to
- Summary: Practical guidance for choosing Fail versus Ignore based on how critical a policy is, and for making webhook backends resilient: multiple replicas, pod anti-affinity, circuit breakers, namespace exemptions, sensible timeouts and monitoring. Vendor blog, so treat as secondary advice that agrees with the official good-practices page.
- Quote: "Security-critical validations should use Fail, while nice-to-have mutations can use Ignore."

### 11. ValidatingPolicy (Kyverno)
- URL: https://kyverno.io/docs/policy-types/validating-policy/
- Title: ValidatingPolicy | Kyverno
- Publisher: Kyverno project (CNCF) documentation
- Kind: official project documentation
- Summary: Describes Kyverno's CEL-first policy type as a superset of Kubernetes ValidatingAdmissionPolicy. Extras include background scanning, policy exceptions, extended CEL libraries, PolicyReports, messageExpressions, and an evaluation mode for non-Kubernetes JSON payloads such as Terraform plans. A ValidatingPolicy can generate native ValidatingAdmissionPolicy objects so enforcement runs in the API server rather than in Kyverno's webhook. Shows how the ecosystem is moving from webhook-based engines toward CEL.

### 12. Mutating Admission Policy
- URL: https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/
- Title: Mutating Admission Policy
- Publisher: Kubernetes project documentation
- Kind: official reference documentation
- Summary: The mutation counterpart of VAP. It has a policy, an optional parameter resource and a binding. Mutations use patchType ApplyConfiguration (server-side-apply-style CEL objects) or JSONPatch. It supports matchConstraints, matchConditions, failurePolicy and reinvocationPolicy. The page reports the feature as stable from v1.36, enabled by default (digest-reported; verify in the live page, since I could not cross-check release notes). Good for explaining sidecar injection or default-label use cases without a webhook. Only the first ~100k of ~110k characters were covered.

### 13. Troubleshooting cheatsheet
- URL: https://fluxcd.io/flux/cheatsheets/troubleshooting/
- Title: Troubleshooting cheatsheet | Flux
- Publisher: Flux project (CNCF) documentation
- Kind: official troubleshooting guide
- Summary: Flux applies manifests with server-side dry-run first, so webhooks that do not declare sideEffects of None or NoneOnDryRun cause reconciliation failures. The cheatsheet tells users to locate the offending Validating or MutatingWebhookConfiguration and fix sideEffects. It also covers health-check timeouts (default five minutes) and the `disableWait` option. A concrete example of GitOps meeting admission.
- Quote: "admission webhook does not support dry run"

### 14. Kubebuilder book: implementing defaulting/validating webhooks
- URL: https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation
- Title: Implementing defaulting/validating webhooks (Kubebuilder book, CronJob tutorial)
- Publisher: Kubernetes SIGs / Kubebuilder project
- Kind: framework tutorial
- Summary: Shows how controller-runtime based operators implement webhooks: scaffold with `kubebuilder create webhook`, implement `Default()` and `ValidateCreate/Update/Delete`, and let markers generate webhook manifests (paths, failure policies, resources, admission review versions). Shows the "plain controller" path, where webhooks ship in the same binary as the controller. Pairs well with CEL rules for the declarative portion of validation.

### 15. cert-manager: Webhook
- URL: https://cert-manager.io/docs/concepts/webhook/
- Title: Webhook | cert-manager
- Publisher: cert-manager project (CNCF) documentation
- Kind: official architecture documentation
- Summary: A real operator that uses all three webhook roles on its own CRDs: validation, defaulting, and conversion. The page lists failure modes seen in practice: API server to webhook connectivity on GKE private clusters and EKS with custom CNIs, and initial unavailability after install while the webhook waits for leader election, certificate generation and CA bundle injection. It also describes the self-signed CA and serving-certificate renewal. Valuable for explaining the TLS/caBundle bootstrapping problem every webhook owner faces.
- Quote: "The webhook automatically renews its serving certificate before it expires."

## Real-world use cases

Policy guardrails on Deployments are the canonical VAP example: the Kubernetes tutorial requires a minimum replica count, and the VAP reference shows replica-limit policies parameterized by a custom resource (sources 2 and 5, https://kubernetes.io/docs/tutorials/cluster-management/admission-policies/). Platform teams use that parameter pattern to give each environment different limits without duplicating the policy.

Kyverno is a named CNCF project that started as a webhook-based policy engine and now offers CEL-based ValidatingPolicy objects, which it can compile into native VAP resources for in-API-server enforcement, while keeping reporting and exceptions (https://kyverno.io/docs/policy-types/validating-policy/). Kubescape is cited in the Kubernetes GA announcement as using VAP (https://kubernetes.io/blog/2024/04/24/validating-admission-policy-ga/). Gatekeeper is the other widely deployed engine in this space; I did not read a primary Gatekeeper source, so its details are not covered here.

Operators that ship their own CRDs use webhooks for defaulting, validation and conversion. cert-manager is the best documented example (https://cert-manager.io/docs/concepts/webhook/), and the Kubebuilder book documents the pattern every controller-runtime operator follows (https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation). Immutability and append-only constraints on CRD fields, such as immutable identifiers on a managed resource, are the typical CEL transition-rule use case (https://kubernetes.io/blog/2022/09/29/enforce-immutability-using-cel/). Sidecar injection and default labels or resources are the standard mutation use cases that MutatingAdmissionPolicy targets (https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/).

GitOps users encounter admission when Flux reconciles into a cluster that runs policy webhooks, where dry-run behavior decides success (https://fluxcd.io/flux/cheatsheets/troubleshooting/). I did not find primary Crossplane, kro, Argo CD, Config Connector, ACK or Cluster API documentation on admission specifics in this pass, so claims about those stacks are limited to the general mechanisms above.

## Pitfalls and how tools address them

Availability and deadlock. Because the API server calls webhooks synchronously, an unreachable backend with failurePolicy Fail blocks every matching write, including writes needed to repair the webhook (for example the Deployment or ConfigMap that runs it). The official guidance is to scope matches narrowly, exclude kube-system and similar namespaces, keep timeouts short, run multiple replicas, and pick Fail only for security-critical checks (https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/ and https://oneuptime.com/blog/post/2026-02-09-webhook-failurepolicy-ha/view). I searched for incident write-ups (a Venafi/Jetstack GKE webhook outage post, an InfraForge ConfigMap deadlock post, a Kyverno/Talos disaster-recovery note) but could not read them, so no named postmortem is summarized here.

Connectivity and TLS bootstrap. cert-manager's page documents API-server-to-webhook network problems on private GKE clusters and EKS with custom CNIs, and a startup window where the webhook is not ready until certificates and the CA bundle are in place (https://cert-manager.io/docs/concepts/webhook/). Tools address this with self-generated CAs and automatic renewal.

Side effects and dry run. Flux and other server-side-apply or dry-run clients fail against webhooks that do not declare sideEffects None or NoneOnDryRun (https://fluxcd.io/flux/cheatsheets/troubleshooting/; field semantics in https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/). The fix is on the webhook configuration, not the GitOps tool.

Mutation hazards. Mutating webhooks can run more than once, in no guaranteed order, and can loop on their own changes. The good-practices page recommends idempotence, minimal patches, merging rather than overwriting arrays, and validating the final state in a validating stage (source 3). Reinvocation is opt-in via reinvocationPolicy IfNeeded (source 1). API evolution can break webhooks that drop unknown fields, as with Pod sidecar support in v1.29.

CEL-specific limits. CEL rules have bounded cost, so CRD schemas need maxItems and maxLength where rules iterate (source 6). VAP type checking is informational because of version skew (KEP, https://www.kubernetes.dev/resources/keps/3488/). CEL policies cannot call external services, so checks needing outside data (registry lookups, signature verification) still need a webhook or an engine that provides it. VAP failurePolicy applies to evaluation errors, and Deny plus Warn together is disallowed.

Tool stack differences. Kyverno compiles to native VAP to reduce dependence on its own webhook. Plain controllers built with Kubebuilder carry their webhooks in the manager and must manage certificates (source 14). Flux surfaces webhook problems as reconcile failures rather than preventing them. I found no sourced details for Crossplane, kro, Argo CD, Config Connector, ACK or Cluster API in this pass.

## Tutorial and explainer links

- https://kubernetes.io/docs/tutorials/cluster-management/admission-policies/ — hands-on lab for validating and mutating CEL policies.
- https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/ — the reference to learn webhook fields and flow.
- https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/ — the pitfalls checklist.
- https://kubernetes.io/blog/2022/09/29/enforce-immutability-using-cel/ — concrete CRD CEL transition-rule patterns.
- https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/ — why and how CRDs get CEL validation.
- https://www.kubernetes.dev/resources/keps/3488/ — design rationale for readers who want the why.
- https://www.zeng.dev/post/2023-k8s-api-admission/ — source-level view of the admission chain.
- https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation — building a webhook in an operator.
- https://cert-manager.io/docs/concepts/webhook/ — a production operator's webhook and its failure modes.

## Open questions

- Incident evidence is thin. The Venafi/Jetstack GKE outage post (https://blog.jetstack.io/blog/gke-webhook-outage), the InfraForge deadlock post, and a Kyverno/Talos recovery note returned empty or unreachable results, so real postmortems still need a second pass.
- Mutating Admission Policy status: the digest of the Kubernetes docs reports stable in v1.36. This was not cross-checked against release notes, and earlier knowledge has it at beta. Confirm before writing it into a tutorial.
- No primary-source material was obtained for Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API or Gatekeeper behavior around admission. Crossplane's own conversion/validation webhooks and CRD-level CEL in composed APIs, and kro's handling of generated CRD validation, remain unexplored.
- Gap in Kyverno failure modes: Kyverno's docs on webhook failurePolicy and its own availability were not read.
- The comparison articles (jorijn.com, devopsness.com, kubernetesinterviewquestions.com, hogin.pro) could not be used: one returned unrelated content and another was unreachable.
- Exact CEL cost-limit numbers and per-request budget values were not captured.
