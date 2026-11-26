---
title: "Research dossier: kro and abstraction models"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [kro, crossplane, helm, kustomize, kpt, score, radius, abstraction, research-dossier]
---

# Research dossier: kro and abstraction models

> [!NOTE]
> **Raw file:** `raw/research-kro-and-abstraction-models.md` (sha256 prefix d43d3775cbbd)<br>
> **Kind:** Research dossier summarizing 14 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several pages (the kro instances page, the Coding Protocols comparison, the dev.to tutorial, the Crossplane XRD page, the Helm charts page, the Kustomize issue, and the kpt README) were read through a summarizing fetch, and the primary Radius documentation could not be read at all. Quotes and field names are a digest and should be checked against the live pages before they are reused in a tutorial.

## Summary

The dossier asks how a platform team hides many Kubernetes and cloud resources behind an interface that application teams can use. It sorts the answers into two families. Render-time or client-side tools (Helm, Kustomize, KRM functions and kpt, and Score) produce manifests once and leave continuous correction to a GitOps tool such as Flux or Argo CD. Server-side, controller-driven tools (Crossplane Compositions, kro ResourceGraphDefinitions, and Radius) make the abstraction a Kubernetes API, so a controller keeps reconciling the children, writes status back to the parent, and handles deletion order.

Within the second family the dossier concentrates on kro. A single ResourceGraphDefinition holds a SimpleSchema that becomes the user-facing API and a list of resource templates wired together with CEL expressions. kro infers the dependency order from those references, generates a CRD, starts a dedicated controller, and propagates status. Crossplane splits the same job into an XRD, a Composition that runs a function pipeline, and providers, packaged as OCI Configuration packages. The sources agree on the central trade-off: kro is more compact and adds no runtime beyond its own controller, but it orchestrates only Kubernetes objects and is still `v1alpha1`, while Crossplane is more expressive and reaches cloud APIs through its own providers at a higher cost to operate and learn. Several sources treat the two as complementary, and Helm stays the packaging standard in most combinations.

The evidence is mostly official documentation plus three blog comparisons and one tutorial. The dossier found no named production postmortem or scale benchmark for kro.

## Key claims

### kro model and behavior

- "CEL always terminates, has no side effects, and is type-checked at apply time." A ResourceGraphDefinition has a `schema` section in SimpleSchema shorthand (for example `image: string | default=nginx`) and a `resources` section of templates that use `${...}` CEL expressions. kro parses the expressions, infers the dependency graph, generates a CRD, and runs a controller. It can wait for status fields that do not exist yet, such as an ACK bucket ARN, and it supports `includeWhen` conditionals and `forEach` collections (https://kro.run/docs/overview). See [[entities/kro]].
- "kro's API is currently at `v1alpha1`." The RGD controller creates a CRD and then deploys a dedicated "microcontroller" per generated API. The newer alpha `Graph` object is a namespaced bundle that creates no new kind and is disabled by default (https://kro.run/docs/faq). See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]].
- For Argo CD, add an owner reference and an `argocd.argoproj.io/tracking-id` annotation to each templated resource so Argo CD can track kro children. The Helm-style checksum trick that restarts a Deployment when a ConfigMap changes can be done with CEL hash functions (https://kro.run/docs/faq). See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]] and [[examples/kro-cel-hash-functions-restart-a-deployment-when-a-configmap-changes]].
- "If any of the resources in your ResourceGraphDefinition reference any fields in `schema.spec`, they must have a value." Instances move through ACTIVE, IN_PROGRESS, DELETING, and ERROR, and the loop is observe, compare, act, report. kro avoids default Kubernetes owner references because they cause out-of-order deletion and cannot link namespaced to cluster-scoped objects, and it uses ApplySet and reverse-topological deletion instead. Reactive reconciliation restores drift (https://kro.run/docs/concepts/rgd/instances, read through a summarizing fetch). See [[findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets]].
- AWS offers kro as a fully managed EKS Capability, positioned as "removing the need for 'glue' operators in your cluster", to compose workloads with ACK-managed AWS resources into building blocks with default and immutable organizational settings, and Argo CD (also an EKS capability) can deploy kro custom resources across clusters (https://docs.aws.amazon.com/eks/latest/userguide/kro.html). See [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].

### Comparisons of kro, Crossplane, and Helm

- "kro is markedly more compact and has no external runtime to install besides its own controller." The side-by-side table lists Crossplane as XRD plus Composition (a function pipeline using patch-and-transform, KCL, Go templating, or Python) plus managed resources, shipped as an OCI Configuration package that pins providers and functions, with an optional namespaced Claim. kro is one RGD file with CEL, inferred ordering, Kubernetes objects only, and distribution through Git, Helm, or Kustomize. Upjet generates Crossplane providers from Terraform providers and kro has no equivalent. The post calls Crossplane CNCF Incubating, and kro a Kubernetes SIG Cloud Provider subproject announced jointly by AWS, Google Cloud, and Microsoft Azure in January 2025 (https://kubernetesinmyhead.net/deployment/crossplane-vs-kro/, a July 2026 individual blog). See [[comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog]].
- "kro is pre-1.0, not marked production-ready." The post frames Helm as render-once packaging with no drift correction, kro as lightweight reconciled platform APIs over existing Kubernetes resources, and Crossplane as the control plane for external cloud infrastructure, and says mature platforms layer all three (https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm, read through a summarizing fetch). See [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]].
- "make the platform-side definitions easier to read and write." A hands-on tutorial builds the same `StorageApp` API twice, as a kro RGD on top of Crossplane managed resources and as a pure Crossplane XRD with `function-go-templating`. Outcomes were equivalent (app, S3 bucket, IAM role, data preserved on deletion, permission failures reflected in readiness), but the template-based Composition needs hand-written logic for creation order and for avoiding deletion when a dependency is briefly unavailable (https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8). See [[examples/build-the-same-storageapp-api-with-kro-and-with-a-crossplane-go-templating-composition]] and [[findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards]].
- "Composite resources can use any schema version set as `served: true`." In Crossplane v2 the default XRD scope is Namespaced, so an XR can only compose resources in its own namespace, with Cluster and LegacyCluster (v1-style claims) as alternatives. Several API versions are allowed but only one is referenceable, and breaking schema changes need a new XRD or a conversion webhook (https://docs.crossplane.io/latest/composition/composite-resource-definitions/, read through a summarizing fetch). See [[concepts/composite-resource]].

### Render-time tools

- "A chart is a collection of files that describe a related set of Kubernetes resources." Helm renders Go templates with values, aggregates the objects, and installs them as one tracked release. The abstraction surface is the values file, which is free-form and not a real API schema unless a values schema is added (https://helm.sh/docs/topics/charts/, read through a summarizing fetch). See [[entities/helm]] and [[findings/helm-values-and-kustomize-patches-leak-the-underlying-manifests-into-the-abstraction]].
- "Kustomize introduces a template-free way to customize application configuration." It customizes plain YAML through bases, overlays, and patches, is built into `kubectl apply -k`, integrates with Argo CD and Flux, and encourages a fork, modify, and rebase workflow instead of parameterization, so it exposes no custom API to users (https://kustomize.io/). See [[entities/kustomize]].
- "We require kustomize to be run on various end user devices that won't have docker installed." Maintainers proposed moving Kustomize's built-in Helm inflation toward KRM functions, and users objected that KRM functions need a container runtime missing on many laptops, CI runners, and Argo CD, and that private chart repository authentication had long been broken. Helm v4 support arrived in kustomize v5.8.1 and no deprecation date was set (https://github.com/kubernetes-sigs/kustomize/issues/4401, read through a summarizing fetch). See [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]].
- "Configuration as Data is an approach to management of configuration which makes configuration data the source of truth." kpt is a package-centric toolchain, a CNCF Sandbox project, where KRM functions are idempotent programs, run in containers, that read and write lists of Kubernetes objects in any language. Crossplane's composition functions and Kustomize's plugin system echo the model (https://github.com/kptdev/kpt, read through a summarizing fetch). See [[entities/kpt]].

### Developer-facing workload abstractions

- "the 'how' becomes an environment specific implementation detail". Score is a developer-centric, platform-agnostic workload spec in which one `score.yaml` declares containers, ports, and abstract resources such as `type: postgres`, and the CLIs `score-compose` and `score-k8s` generate Docker Compose or Kubernetes manifests. It generates output and runs no controller. The site describes it as a CNCF Sandbox project that originated at Humanitec and quotes testimonials from Mineiros, Frontside Software, and BAUHAUS Deutschland (https://score.dev/). See [[entities/score]] and [[examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec]].
- "The developer asks for 'a Redis cache.'" A third-party review describes Radius as an application-definition platform, originated at Microsoft and a CNCF Sandbox project since 2024 according to that source, where platform engineers supply Recipes that decide what a resource type becomes per environment. The listed strengths are the connection model, dev and prod parity, and the dependency graph, and the listed limits are the Bicep dependency, an Azure lean, its own control plane, and early maturity (https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026). The primary Radius docs page returned an empty scrape and then a 404, so every Radius claim here is secondary. See [[entities/radius]] and [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]].

### Adoption evidence

- AWS is the clearest named kro adopter, through the managed EKS capability, and the kro overview uses a `WebApp` API that creates a ConfigMap, an ACK `Bucket`, a Deployment, and a Service, noting that Azure Service Operator and Config Connector work equally well. The dossier found no detailed named production postmortem for kro, and it describes the layered Helm plus Crossplane plus kro pattern as typical and not tied to named companies. The Score testimonials are vendor-site statements and not independent case studies.

## Cross-source synthesis

The render-time versus controller-driven split is the useful organizing idea of this dossier, and it is laid out in [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]]. Three recurring pitfalls cut across both families: maturity and API churn (kro `v1alpha1`, Radius early-stage), where code runs (containers for KRM and Crossplane functions, in-process CEL for kro), and abstraction leakage (Helm values and Kustomize patches expose the manifests, while Score and Radius move higher at the cost of a translation or control-plane layer).

## Discrepancies and open questions

- The Kubernetes in my head post calls Crossplane CNCF Incubating, while [[sources/research-crossplane-deep-dive]] records the project's own announcement and InfoQ saying it graduated. The blog is dated July 2026 and is likely stale on this point, so the wiki treats graduation as established and records the blog's label as a dated claim. See [[entities/crossplane]].
- The same post says kro is not a CNCF project and sits under SIG Cloud Provider, whereas kro.run says only that it is a SIG Cloud Provider subproject. The two are compatible, and the wiki records the question as a gap.
- Radius and Score status and lineage come only from a third-party review and from Score's own site respectively. The Crossplane concepts pages, the KRM function specification, and primary pages for Flux, Cluster API, and Config Connector were not read in this run.
- How the alpha `Graph` API will affect RGD stability, and the scaling limits of one dedicated controller per RGD, are not covered. These are tracked in [[open-knowledge-gaps]].
