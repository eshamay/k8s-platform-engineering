# Research dossier: Operator Pattern

Research date: 2026-11-25

## Overview

An operator is a Kubernetes controller that knows two domains: Kubernetes and some other system, such as a database, a cloud API, or a cluster lifecycle. The operator pattern pairs a custom resource definition (CRD), which extends the API with a new Kind, with a controller that watches instances of that Kind and drives the world toward what the spec declares. The goal is to encode the runbook knowledge of a human operator (install, upgrade, backup, failover) as code that runs continuously.

Mechanically, the pattern is the ordinary Kubernetes control loop applied to custom types. A controller observes desired state (the spec) and current state, computes the difference, acts through the API server or an external API, and writes results back to status. The upstream controller guidelines stress that controllers must be level-driven rather than edge-driven. They can be down for an unknown time, so they cannot rely on having seen every event. They read from shared informer caches, process work from rate-limited workqueues, and must be idempotent.

The sources frame the ecosystem in layers. Kubebuilder and Operator SDK (both built on controller-runtime) scaffold Go projects. Other frameworks exist for Python, Java, Rust, and .NET. The Operator SDK capability model grades operators from Level 1 (basic install) to Level 5 (auto pilot), which is a useful maturity vocabulary. Platform tools such as Flux, Crossplane, Cluster API, ACK, and kro are all this same pattern specialised to a domain: GitOps delivery, cloud resource composition, cluster lifecycle, AWS resources, and runtime-generated APIs.

Guidance on pitfalls is consistent. Keep one controller per Kind, design declarative APIs, report state through status conditions, use finalizers carefully, run with least privilege, and make removal of the operator safe for the workloads it manages. Not every automation needs a custom resource. The Kubernetes docs say to add one when the API is declarative.

## Sources

### 1. Operator pattern (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
- Title: Operator pattern
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: The canonical definition. Operators capture a human operator's knowledge as automation built on custom resources and control loops. The page walks through a hypothetical SampleDB operator that creates PVCs, StatefulSets, and Jobs, handles backups, upgrades, and schema migrations, and cleans up on delete. It also lists implementation frameworks: kubebuilder, Operator Framework, Kopf, Java Operator SDK, kube-rs, KubeOps, and Metacontroller. Start here for vocabulary.
- Quote: "Operators are software extensions to Kubernetes that make use of custom resources to manage applications and their components."

### 2. Controllers (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes project
- Kind: Official architecture documentation
- Summary: Explains the control loop with a thermostat analogy and uses the Job controller as the worked example: it watches Jobs, creates and removes Pods through the API server, and reports status. It distinguishes controllers that act through the API server from those that touch external systems directly, such as the cluster autoscaler. It also states that several small controllers are preferred over one monolith. This is the mechanical foundation for operators.
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 3. Custom Resources (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- Title: Custom Resources
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Describes CRDs versus aggregated API servers. CRDs are simpler and need no extra server. Aggregated APIs give more control at the cost of running your own API server. It gives criteria for when a custom resource is appropriate: a declarative API of small, infrequently updated objects with CRUD semantics and human-readable configuration. Useful for the "should this be an operator at all" decision.
- Quote: "Custom resources let you store and retrieve structured data; combined with custom controllers, they provide a true declarative API."

### 4. Finalizers (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/
- Title: Finalizers
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains how deletion sets a deletionTimestamp and the object lingers until controllers remove their finalizer keys. It lists why objects stick in Terminating: failing cleanup logic, a controller that is not running, or blocked dependencies. It warns against manually stripping finalizers. This matters because operators managing external resources depend on finalizers for cleanup.
- Quote: "Finalizers alert controllers to clean up resources the deleted object owned."

### 5. Writing Controllers (sig-api-machinery guidelines)
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md
- Title: Writing Controllers
- Publisher: Kubernetes community, SIG API Machinery
- Kind: Design and contributor guide
- Summary: Rules for building correct controllers. Be level-driven, not edge-driven. Use SharedInformers for cached reads and notifications. Use rate-limited workqueues that process one key at a time. Never mutate objects from shared caches, wait for secondary caches to sync, and handle failures consistently. It is the most direct source for why reconcile logic must be idempotent and restart-safe.
- Quote: "Your controller may be off for an indeterminate amount of time before running again."

### 6. Kubebuilder Book, CronJob tutorial
- URL: https://book.kubebuilder.io/cronjob-tutorial/cronjob-tutorial
- Title: Tutorial: Building CronJob
- Publisher: Kubebuilder / Kubernetes SIG API Machinery
- Kind: Hands-on tutorial
- Summary: Walks through scaffolding a project and building a CronJob controller step by step: API types, markers, reconcile, webhooks, and tests. Gives the end-to-end shape of a Go operator built on controller-runtime. The best first hands-on exercise.
- Quote: "The job of the CronJob controller is to run one-off tasks on the Kubernetes cluster at regular intervals."

### 7. Kubebuilder good practices
- URL: https://book.kubebuilder.io/reference/good-practices
- Title: Good Practices
- Publisher: Kubebuilder project
- Kind: Reference and best practices
- Summary: Recommends idempotent reconcile, status conditions following API conventions, one controller per Kind (multi-Kind controllers break encapsulation and scale poorly), and Kubernetes logging conventions. Directly useful for an anti-pattern list.
- Quote: "Each controller should ideally have only one job. This approach simplifies development and debugging, and makes the system more robust."

### 8. Operator capability levels (Operator SDK)
- URL: https://sdk.operatorframework.io/docs/overview/operator-capabilities/
- Title: Operator Capability Levels
- Publisher: Operator Framework (Red Hat and community)
- Kind: Maturity model documentation
- Summary: Defines five levels: Basic Install, Seamless Upgrades, Full Lifecycle (backup, restore, failover), Deep Insights (metrics, alerts), and Auto Pilot (auto-scaling, healing, tuning). It gives teams a shared way to describe how far an operator has progressed, and a roadmap for prioritising features.
- Quote: "Significantly reduce/eliminate any remaining manual intervention" (Level 5 description).

### 9. CNCF Operator White Paper
- URL: https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md
- Title: CNCF Operator White Paper
- Publisher: CNCF TAG App Delivery, Operator Working Group
- Kind: Whitepaper
- Summary: Defines operators as controllers combining Kubernetes and application knowledge. Covers CRs, CRDs, controllers, and reconciliation. It lists use cases (stateful apps, upgrades, backup and DR, auto-remediation, day-2 operations) and security guidance: document scope and RBAC, apply least privilege, verify provenance. Best practices include one operator per application type, using established frameworks, and designing so removing the operator does not disrupt applications.
- Quote: "An operator provides a way to encapsulate the required activities, checks and state management of an application."

### 10. Best practices for building Kubernetes operators and stateful apps
- URL: https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps
- Title: Best practices for building Kubernetes Operators and stateful apps
- Publisher: Google Cloud blog
- Kind: Engineering blog
- Summary: Practical advice: one operator per application, use SDKs such as Kubebuilder, design declarative APIs, compartmentalise features across controllers, and use asynchronous sync loops that do not block on errors. Also covers monitoring: aggregated logs, well-labelled metrics, and metrics exposed on pod endpoints.
- Quote: "With declarative APIs, users only need to express their desired cluster state, while letting the operator perform all necessary steps."

### 11. Kubernetes Operators: what are they, with examples
- URL: https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/
- Title: Kubernetes Operators: what are they? Some examples
- Publisher: CNCF blog
- Kind: Explainer
- Summary: Introductory explainer covering day-1 and day-2 automation and the value for stateful apps. Names well-known operators: Prometheus Operator, cert-manager, Istio operator, Crossplane, Elastic's operator, and Postgres operators. It points to Artifact Hub and OperatorHub for discovery.
- Quote: "Operators are software extensions that use custom resources to manage applications and their components."

### 12. Operators over easy (Red Hat)
- URL: https://www.redhat.com/en/blog/operators-over-easy-introduction-kubernetes-operators
- Title: Operators over easy: an introduction to Kubernetes Operators
- Publisher: Red Hat blog
- Kind: Introductory blog
- Summary: Frames an operator as a controller that understands two domains. Breaks it into a CRD, a resource controller, and domain-specific operations. It presents the observe, analyse, act loop and lists use cases: configuration management, stateful app automation, HA and scaling, and lifecycle automation.
- Quote: an operator is "a Kubernetes controller that understands 2 domains: Kubernetes and something else."

### 13. Cluster API concepts
- URL: https://cluster-api.sigs.k8s.io/user/concepts
- Title: Concepts (Cluster API Book)
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Project documentation
- Summary: Cluster API manages Kubernetes clusters themselves as custom resources, using a management cluster and pluggable providers for infrastructure (AWS, GCP, vSphere, and others). It is a large-scale example of the operator pattern applied to cluster lifecycle, with a provider model that keeps core controllers generic.
- Quote: "Extensibility is at the core of Cluster API."

### 14. Flux components (GitOps Toolkit)
- URL: https://fluxcd.io/flux/components/
- Title: Flux Components
- Publisher: Flux project (CNCF)
- Kind: Project documentation
- Summary: Flux is a set of specialised controllers (source, kustomize, helm, notification, image automation), each reconciling its own CRDs against Git or other sources. It shows the one-controller-per-concern split and composable APIs, and is a clear example of GitOps built from operators.
- Quote: "Flux is constructed with the GitOps Toolkit components, which is a set of specialized tools and Flux Controllers, composable APIs, reusable Go packages."

### 15. Crossplane compositions
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions
- Publisher: Crossplane project (CNCF)
- Kind: Project documentation
- Summary: Crossplane lets platform teams define their own composite resource APIs (XRD, XR) and map them to managed resources with a Composition that runs a pipeline of functions. The controller logic is therefore configured rather than hand-coded. Good for explaining platform abstractions on top of operators.
- Quote: "A Composition composes individual resources together into a larger, reusable, solution."

### 16. kro ResourceGraphDefinition
- URL: https://kro.run/docs/overview
- Title: kro overview
- Publisher: kro project
- Kind: Project documentation
- Summary: A ResourceGraphDefinition declares a schema and templated resources with CEL expressions. kro infers the dependency graph, generates a CRD, and starts a controller at runtime. It is a no-code route to a custom API that avoids writing a bespoke operator.
- Quote: "kro parses the expressions, infers the dependency graph, generates a CRD, and stands up a controller - all at runtime."

### 17. AWS Controllers for Kubernetes (ACK)
- URL: https://aws-controllers-k8s.github.io/community/docs/community/overview/
- Title: ACK overview
- Publisher: AWS Controllers for Kubernetes community
- Kind: Project documentation
- Summary: ACK ships one controller image per AWS service, each reconciling custom resources into AWS API calls. It supports adopting pre-existing AWS resources and exporting fields to ConfigMaps or Secrets. It is an example of per-service controllers for external systems.
- Quote: "Define and use AWS service resources directly from Kubernetes without needing to run supporting services within the cluster."

## Real-world use cases

Stateful data services are the classic case. The CNCF explainer (https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/) names Postgres operators and the Elastic operator for automating provisioning, HA, upgrades, and backups. The Kubernetes operator page (https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) uses a SampleDB scenario for the same reasons: backups, schema migrations, and version upgrades.

Cluster add-ons and infrastructure are the second group. Prometheus Operator (monitoring), cert-manager (TLS certificate issuance and renewal), and the Istio operator (mesh install and upgrade) are named in the CNCF explainer. These operators turn install and day-2 work into declarative objects.

Platform engineering is the third group. Cluster API (https://cluster-api.sigs.k8s.io/user/concepts) manages whole clusters as resources across AWS, GCP, and vSphere. Flux (https://fluxcd.io/flux/components/) reconciles cluster state from Git using several cooperating controllers. Crossplane (https://docs.crossplane.io/latest/composition/compositions/), ACK (https://aws-controllers-k8s.github.io/community/docs/community/overview/), and kro (https://kro.run/docs/overview) let teams expose cloud resources or composed stacks as Kubernetes APIs. The CNCF whitepaper (https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md) lists upgrades, DR, and auto-remediation as core scenarios. I found no named-organization postmortems among the pages I read.

## Pitfalls and how tools address them

Edge-driven logic and missed events. The controller guidelines (https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/controllers.md) say controllers may be down for an unknown time, so they must reconcile from current state, not from remembered events. Frameworks like controller-runtime provide the informer, cache, and workqueue plumbing, and Kubebuilder's good practices (https://book.kubebuilder.io/reference/good-practices) require idempotent reconcile.

Monolithic controllers. Kubebuilder, Google Cloud, and the Kubernetes controller docs all recommend a single responsibility per controller. Flux applies this by splitting source, kustomize, helm, and notification into separate controllers (https://fluxcd.io/flux/components/). ACK splits by AWS service (https://aws-controllers-k8s.github.io/community/docs/community/overview/). Cluster API splits core from provider controllers (https://cluster-api.sigs.k8s.io/user/concepts).

Deletion and cleanup. Finalizers are needed for external resources, but a missing controller or failing cleanup leaves objects in Terminating, and manually removing finalizers is risky (https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/).

Mutating shared caches and unsynced caches. Documented in the controller guidelines above. The cure is to copy objects before modifying them and to wait for caches to sync.

Opaque state. Kubebuilder recommends standard status conditions so users and tools can observe progress. The SDK maturity model (https://sdk.operatorframework.io/docs/overview/operator-capabilities/) treats metrics, alerting, and insights as Level 4.

Security and blast radius. The CNCF whitepaper recommends least-privilege RBAC, documented scope, provenance checks, and designing so that removing the operator does not disrupt the application.

Over-building. When a custom API is mostly composition of existing resources, Crossplane compositions or kro can replace a hand-written controller (https://docs.crossplane.io/latest/composition/compositions/, https://kro.run/docs/overview). The Kubernetes CRD docs suggest a custom resource only when the API is declarative (https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/). Blocking on errors inside the loop is discouraged by the Google Cloud guidance (https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/extend-kubernetes/operator/ : the shortest authoritative definition and framework list.
- https://kubernetes.io/docs/concepts/architecture/controller/ : the control-loop concept in plain terms.
- https://book.kubebuilder.io/cronjob-tutorial/cronjob-tutorial : the hands-on tutorial for a first Go operator.
- https://book.kubebuilder.io/reference/good-practices : concise dos and don'ts for reconcilers.
- https://sdk.operatorframework.io/docs/overview/operator-capabilities/ : the five-level maturity model.
- https://www.redhat.com/en/blog/operators-over-easy-introduction-kubernetes-operators : a gentle conceptual intro.
- https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/ : named examples for orientation.
- https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md : the broader design and security view.

## Open questions

- The Crossplane page at /latest/concepts/composition/ returned 404 and the sources I read did not cover Crossplane version differences, so check current doc paths before linking.
- Argo CD and Config Connector were not covered by any page I fetched. Their failure handling is a gap.
- The whitepaper favours Go, while the Kubernetes page lists many languages, so no source gives clear criteria for choosing.
- No fetched source gave a postmortem or named-company case study. Real failure stories (for example stuck finalizers, reconcile storms, or CRD upgrade breakage) still need to be sourced.
- Several fetches were summarised by a tool that read up to the first 100 KB. Quotes were taken from those summaries, not read directly, so verify wording before quoting.
- The Operator SDK page's level descriptions are fairly high level. It is unclear how strictly the levels apply to non-Go or generic-composition operators such as kro and Crossplane.
