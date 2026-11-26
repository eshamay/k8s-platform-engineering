---
title: "Part 4: Platform Abstractions from Managed Resources to Resource Graphs"
type: output
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [tutorial, series-part, abstraction, crossplane, kro, platform-engineering]
---

# Part 4: Platform Abstractions from Managed Resources to Resource Graphs

> [!NOTE]
> **Audience:** Engineers with real Kubernetes operating experience (pods, deployments, services, RBAC, kubectl) who have not yet worked with controllers, API machinery, or platform abstractions in depth.<br>
> **Purpose:** Teach how platform teams publish simple, owned APIs over complex infrastructure, and how Crossplane, kro, and the surrounding tools trade flexibility, operability, and expressiveness against one another.<br>
> **Status:** Draft, part 4 of the tutorial series.<br>
> **Created:** 2026-11-25<br>
> **As of:** 2026-11-25<br>
> **Draws on:** The concept, example, finding, comparison, decision, and entity pages of this wiki listed under Further reading, which in turn rest on the research dossiers in `sources/`.

## 1. Why platforms need abstractions: the cognitive-load problem

Imagine you are an application developer who needs a PostgreSQL database for a new service. Without a platform, you must learn what the cloud calls its database offering, which subnet group it belongs to, which security group rules let your pods reach it, how the encryption key is chosen, what backup retention your company requires, which tags finance expects on every billable object, and how to wire the resulting endpoint and password into your Deployment. None of that knowledge is about your product. All of it is cognitive load, and it multiplies across every team in the company. The usual response is a platform team, a group whose job is to absorb that complexity once and let everyone else ask for what they want in a few words.

Kubernetes gives the platform team an unusually good place to do this. Earlier parts of this series explained that Kubernetes is more than a container scheduler. Its API server, with etcd behind it, is a general database and orchestration engine, and any kind of object can be registered with it through a custom resource definition, covered in [[concepts/custom-resource-definition]]. Once a kind exists, it automatically gets the machinery you already trust: authentication, RBAC, audit logging, schema validation, list and watch, and `kubectl`. A controller then watches objects of that kind and drives the real world toward what the object declares, which is the loop described in [[concepts/reconciliation-loop]] and the idea behind the [[concepts/universal-control-plane]]. This tutorial is about what happens when a platform team uses that machinery on purpose to build a product: a small, stable, versioned API that hides a large pile of infrastructure behind it.

The wiki's vocabulary note names the layers of that idea, and this tutorial follows them in order. At the bottom is the [[concepts/managed-resource]], a one-to-one Kubernetes object for one external thing such as a single VPC or IAM role. Delivered by a [[concepts/provider]], these objects teach the cluster to speak to a cloud API. Above them sits the [[concepts/composite-resource]], a higher-level, opinionated object such as a `PostgreSQLInstance` or `WebApp` that bundles many lower-level ones. The mapping from the high-level object to the low-level ones is a [[concepts/composition]]. Crossplane implements all four layers. kro, a newer project, collapses the top two into a single definition that describes a graph of resources. The tutorial then widens out to Helm, Kustomize, hand-written operators, Score, Radius, and Kratix, which attack the same cognitive-load problem from different directions and pay different prices for it ([[concepts/tooling-landscape]], [[sources/krm-platform-vocabulary]]).

One caution about evidence runs through the whole article. The wiki is built from public documentation, vendor and consultancy blogs, and adopter lists, with very few independent measurements or postmortems. Where a claim rests on one blog or a vendor's own announcement, the text below says so. Both Crossplane and kro are moving quickly, so the wiki's own pages carry a 180-day staleness window and you should check version-specific details against current documentation.

## 2. Managed resources: one Kubernetes object per external resource

The simplest abstraction is almost no abstraction at all. A managed resource is a Kubernetes object that stands for exactly one thing outside the cluster. The Crossplane documentation puts it this way: "Crossplane calls the object inside Kubernetes a managed resource and the external object inside the Provider an external resource." A provider's controller reads the real thing, compares it with what the object asks for, and creates, updates, or deletes the real thing to close the gap. The shortest mental model is a Deployment-style controller loop whose pods happen to be cloud resources ([[sources/research-managed-resource]]).

Here is an illustrative managed resource for an AWS bucket. Field names follow the pattern the wiki describes, though exact API groups and versions vary by provider and release, so treat it as a sketch and not a copy-paste manifest.

```yaml
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  name: team-a-reports
  annotations:
    crossplane.io/external-name: team-a-reports-prod
spec:
  forProvider:
    region: eu-west-1
  managementPolicies: ["*"]
status:
  atProvider:
    arn: arn:aws:s3:::team-a-reports-prod
  conditions:
    - type: Ready
      status: "True"
    - type: Synced
      status: "True"
```

Read the snippet from the top. The `spec.forProvider` block is the authoritative desired state, and the Crossplane documentation calls it the "source of truth" for the external resource, which means that someone editing the bucket in the cloud console will see the edit reverted on the next poll. The `crossplane.io/external-name` annotation says which real bucket this object maps to. The `status.atProvider` block is what the provider last observed, and it is written by the controller and not by you. Two conditions, explained in [[concepts/conditions]], diagnose different failures: `Synced` says whether the last reconcile succeeded, while `Ready` says whether the external thing is usable. A resource can be `Ready=True` and `Synced=False`, a quiet state in which the bucket exists but drift correction has stopped ([[findings/synced-false-with-ready-true-is-a-silent-failure-where-drift-correction-stops]]).

The `managementPolicies` list is the main safety lever. A value of `*` means every verb and is the default. `["Observe"]` gives read-only import or a permanent reference. A list that omits `Delete` means "manage this, but leave the real resource behind if the object is removed," and an empty list pauses reconciliation. The same feature began life as a three-value enum in a design document and shipped as a list, and the import guide labels it beta. Older advice about `deletionPolicy: Orphan` therefore needs translating ([[decisions/choose-management-policies-for-an-imported-resource]], [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]]). A related field, `spec.initProvider`, holds values applied only at creation, which lets another system own a field afterward; one documented use is letting an autoscaler own the size of a node group ([[examples/crossplane-initprovider-lets-an-autoscaler-own-node-group-size]]).

Deletion deserves its own paragraph because it is where managed resources differ most from ordinary Kubernetes objects. Deleting a Deployment removes pods you can recreate. Deleting a managed resource, by default, deletes the real database. The mechanism that makes this safe in the other direction is the finalizer, a string in `metadata.finalizers` that tells the API server not to remove the object until a controller has finished cleaning up. When you delete such an object, the API server only sets a `deletionTimestamp`; the controller sees that, deletes the external resource, removes its finalizer, and only then does the object disappear ([[concepts/finalizers]]). The price is that a missing or failing controller strands objects in `Terminating`, and forcing a finalizer off skips the cleanup it guarded, which can leave billable resources running. Crossplane, ACK (AWS Controllers for Kubernetes, Amazon's per-service controllers for AWS resources), and Config Connector (Google's equivalent for Google Cloud) all default to deleting the cloud resource, and each offers an opt-out under a different name ([[comparisons/deletion-policies-across-gitops-and-provider-tools]]).

Managed resources also handle two awkward real-world problems. The first is importing something that already exists: set the external-name annotation to the real identifier, apply with `Observe` only, read `status.atProvider`, copy the needed values into `forProvider`, and then widen the policy ([[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]]). The recipe has sharp edges, including the manual copying, names that are ambiguous across regions, and relaxed validation while observing ([[findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation]]). The second is a create call whose response is lost. Crossplane writes a create-pending annotation before calling the cloud and a succeeded or failed annotation afterward, so a provider that restarts in between cannot tell whether a resource exists and blocks until a person decides ([[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]]). That conservative stop prevents duplicate or leaked resources at the cost of manual intervention.

## 3. Providers: generated and hand-written, families versus per-service controllers

A provider is a packaged controller plus a set of CRDs that teaches a cluster to speak to a specific external API ([[concepts/provider]]). In Crossplane it is an installable OCI package, meaning a container-registry artifact in the same format as an image, which the cluster pulls and unpacks. A `Provider` object installs it, each upgrade creates a `ProviderRevision`, a `ProviderConfig` selects credentials, and a `DeploymentRuntimeConfig` customizes the pod. Every provider reuses the same shared managed reconciler, which walks the phases Connect, Observe, Create, Update, and Delete. A provider author implements a small external-client interface for those phases and must make create and delete idempotent, meaning safe to repeat with the same result; the contributing guide's sharpest rule is that delete must not return an error when asked to delete something that is already gone ([[examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler]]).

Writing hundreds of such clients by hand would be impractical, so most large catalogs are generated. Upjet generates Crossplane providers from Terraform providers, so that the generated controllers reuse Terraform's resource logic at runtime while users see only a Kubernetes API ([[examples/upjet-generates-crossplane-providers-from-terraform-providers]]). ACK generates its controllers from AWS API models, and Azure Service Operator v2 generates its CRDs from Azure Resource Manager schemas, with the documentation citing 150 or more resources ([[examples/azure-service-operator-generates-crds-from-azure-resource-manager-schemas]]). Generation explains why catalogs grow quickly, and it also explains a recurring drawback: a generated catalog inherits the behavior and the bugs of whatever generated it ([[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]]). Hand-written providers have their own pitfalls, such as treating "not found" as an error and breaking the create flow ([[findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow]]).

The most instructive operational story in this area is about counts. Because each external resource type is its own CRD, a provider for a big cloud implies hundreds of CRDs, and a multi-cloud set implies thousands. Crossplane's own blog reports that the original monolithic provider-aws passed 900 CRDs and could leave the API server unresponsive, sometimes for up to an hour during scale-up. Upbound's tests of a control plane with about 2,000 managed resources found that discovery needed around 300 HTTP requests and hit client-side throttling, while server-side OpenAPI computation consumed CPU and several MiB of memory per CRD. Several upstream fixes followed, including higher kubectl discovery limits and lazy OpenAPI computation in Kubernetes 1.23, but code-generated providers outgrew them. The figures came through digests of the posts, so check them against the originals before quoting ([[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]]). Kubernetes' own tested scalability envelope does not include CRD count as a dimension, which is why platform tools fell into this gap ([[concepts/scale-and-sharding]]).

Two packaging answers emerged. Crossplane split the monolith into provider families, scoped providers grouped under a family that share one configuration provider, so an operator installs only S3 and RDS and gets only those CRDs. The cost is more pods and memory, a trade documented in [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]]. ACK took the opposite starting point and has always shipped one controller image per AWS service ([[examples/ack-ships-one-controller-per-aws-service]]). The two converge on the same benefit, installing only what you use, from opposite directions ([[comparisons/provider-families-versus-per-service-controllers]]). Crossplane v2 adds a finer tool: each managed resource type is represented by a ManagedResourceDefinition, and a ManagedResourceActivationPolicy lists exact names or prefix patterns so that only matching types become served CRDs ([[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]]). When picking a strategy, [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]] frames the options.

A note on vocabulary will save confusion later. Cluster API also uses the word provider, but there it means an implementation of a narrow contract that lets the core controllers build whole clusters on AWS, Azure, or vSphere, not a catalog of external resources ([[comparisons/crossplane-providers-versus-cluster-api-providers]]). When someone says "provider," ask which family of tools they mean.

## 4. Composite resources, XRDs, claims and the v2 namespaced model

A managed resource is faithful to the cloud, and that is precisely its problem as a user-facing API. The application developer asked for a database, not for a subnet group, a parameter group, a security group, and an instance. The composite resource, abbreviated XR, is the answer. The Crossplane documentation defines it plainly: "A composite resource, or XR, represents a set of Kubernetes resources as a single Kubernetes object." A controller expands the small object into the lower-level objects it represents, keeps them reconciled, wires values from one child into another, reports aggregate readiness, and tears the whole set down in a sensible order. It is the ordinary controller pattern applied one level up, where the world being reconciled is a set of other API objects ([[concepts/composite-resource]], [[sources/research-composite-resource]]).

To publish such a kind, Crossplane asks the platform team to write a CompositeResourceDefinition, or XRD. It declares the group, kind, plural name, versions, scope, and a schema, and Crossplane generates a CRD from it, so the platform team never hand-writes the CRD. Here is a sketch of a small database API.

```yaml
apiVersion: apiextensions.crossplane.io/v2
kind: CompositeResourceDefinition
metadata:
  name: databases.platform.example.org
spec:
  group: platform.example.org
  names:
    kind: Database
    plural: databases
  scope: Namespaced
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                size:
                  type: string
                  enum: [small, medium, large]
                engineVersion:
                  type: string
```

The snippet shows the central design move. The developer sees a `size` of small, medium, or large and an engine version, and nothing about instance classes or storage types. The XRD name must be `<plural>.<group>`, and group and names are immutable after creation, so changing them means deleting and recreating the XRD ([[examples/xrd-and-rgd-declare-platform-gvks]]). That is why the group and kind are product decisions: they become the public contract, and [[findings/group-and-plural-names-are-effectively-permanent]] records the consequence. Treat the example's API version string as indicative, since the XRD API changed between Crossplane major versions.

The scope field leads to the v1 and v2 difference that confuses many readers of older blog posts. In Crossplane v1, a composite resource was cluster-scoped, which is awkward for tenants who work inside namespaces. The fix was the claim: the platform team set `claimNames` in the XRD, a developer created a namespaced claim, and Crossplane created a cluster-scoped XR and linked the two through `spec.resourceRef` and `spec.claimRef` ([[examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource]]). In v2, XRs are namespaced by default, claims are not available for new-style XRDs, and the tenant boundary moves onto the XR itself. v2 also removed native patch-and-transform composition, offers namespaced managed resources under `.m.` API groups, and, importantly, offers no automated tool to move v1 cluster-scoped XRs and managed resources to the new model ([[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]]). One caveat from the wiki: the dossier did not read a primary v2 XRD page that states claim support precisely, and a `LegacyCluster` scope fallback comes from a single third-party blog, so confirm both against current documentation. Because so much online content predates v2, [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]] is worth reading before you follow a tutorial. The upgrade path itself is to reach v1.20, fix deprecations with the conversion command, upgrade the core, optionally set activation policies, and then upgrade providers ([[examples/crossplane-v2-upgrade-moves-through-v1-20-the-conversion-cli-and-then-providers]]).

A composite resource also carries per-object controls. It can pick a Composition with `compositionRef` or `compositionSelector`, follow revisions automatically or pin one, be paused with the `crossplane.io/paused` annotation, and be forced to reconcile with `crossplane.io/reconcile-requested-at`. Its `Ready` condition becomes true only when the pipeline reports that all composed resources are ready ([[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]]). An alpha deletion policy chooses Background, Foreground, or Pipeline teardown, which Section 9 returns to.

Governance is the usual motive for all this. A Crossplane blog on designing compositions for organizational needs argues that the platform team should expose well understood features behind its own versioned API and not pass every provider feature through, since native provider features can break proprietary environments or weaken compliance. Inside the Composition, tags can be applied to every composed resource automatically, and namespaced tenant segregation becomes an access-control pattern ([[examples/a-platform-api-hides-provider-features-to-enforce-tagging-and-tenant-segregation]]). The post is advocacy and not a named deployment, but the pattern is clear.

## 5. Compositions and composition functions: pipelines that turn observed state into desired state

A Composition says how an instance of the XRD's API becomes composed resources. It is matched to an XR by `compositeTypeRef`, which names the XRD's group and kind. In current Crossplane, the Crossplane documentation says, "A Composition is a pipeline of composition functions." A function is installed as a package and runs as a pod. On each reconcile, Crossplane calls the steps in order over gRPC, a binary remote-call protocol. Each call carries the XR's current state, the observed state of the resources it owns, the desired state accumulated by earlier steps, per-function input, and shared context. The function returns what should exist, and the output of one step feeds the next ([[concepts/composition]], [[examples/a-composition-function-pipeline-turns-observed-state-into-desired-state]]).

A minimal pipeline looks like this.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: database-aws
spec:
  compositeTypeRef:
    apiVersion: platform.example.org/v1alpha1
    kind: Database
  mode: Pipeline
  pipeline:
    - step: render-resources
      functionRef:
        name: function-go-templating
      input:
        apiVersion: gotemplating.fn.crossplane.io/v1beta1
        kind: GoTemplate
        source: Inline
        inline:
          template: |
            # templates that emit an RDS instance, subnet group, and so on
    - step: mark-ready
      functionRef:
        name: function-auto-ready
```

The first step renders the composed resources from the developer's `size` and `engineVersion`, and the second, `function-auto-ready`, reports readiness once the composed resources are ready. The input details are elided because they depend on the function chosen, and function names and API versions should be checked against the version you run. What matters is the contract: a function's main job is to update the desired state and hand it back, and Crossplane, not the function, talks to the API server and applies the result. Functions do not run on deletion, so Crossplane itself deletes composed resources ([[sources/research-crossplane-deep-dive]]).

Why a pipeline of external programs and not a richer template language? The design document says the maintainers wanted to "avoid organically growing a new configuration Domain Specific Language." The earlier model, native patch-and-transform, was a static list of base resources plus patches. It was deliberately not Turing complete, meaning it could not express arbitrary loops or programs, and it could not branch, loop, or patch between composed resources ([[findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources]]). Imagine Learning's experience shows the cost: its patch-and-transform files for AWS RDS clusters ran past 1,000 lines, about 1,250 for a two-instance cluster, with near-duplicate files for different instance counts. After moving to a function with a loop over `instanceCount`, the duplication disappeared ([[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]]). VSHN, a Swiss provider that sells self-service databases, queues, and object storage through its AppCat marketplace, reached the same conclusion after hitting the lack of conditionals and dynamic lookups ([[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]]). Patch-and-transform survives as `function-patch-and-transform`, and the legacy `mode: Resources` was deprecated in v1.17 and removed in v2.

Functions bring their own failure modes. The sharpest is that a function returns the complete desired state, not an incremental patch, so a resource it omits is deleted. VSHN learned this during the alpha: "if an object is not explicitly specified in a request payload, it will be deleted." The discipline is to start from the incoming desired state, change only your own parts, and pass everything else through ([[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]]). Functions are also extra moving parts that must be healthy for a composite to reconcile, and mistakes appear at reconcile time and not at definition time ([[findings/composition-functions-add-moving-parts-that-must-be-healthy]]). Load scales with composite count: composites are polled every 60 seconds by default and each function step is a gRPC call, so 100 XRs with one step make 100 calls per minute. A third-party article argues that large composites can exhaust function memory, though its log excerpts are labelled as simulated, so treat that as plausible guidance and not an incident ([[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]]). Go templating adds a further burden: in a tutorial that built the same API two ways, the template-based Composition needed hand-written logic for creation order and for avoiding deletion of a resource when a dependency was briefly unavailable ([[findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards]]).

The recommended mitigation for most of this is testing before rollout: `crossplane render` runs a Composition locally, functions can be unit tested, and the Crossplane blog describes a loop using kind, Kuttl, and Skaffold in which each Kuttl run takes two to five minutes.

## 6. kro: ResourceGraphDefinitions, CEL and readiness checks

kro, short for kube-resource-orchestrator, was announced by Google on 2025-01-30 as a joint effort with AWS and Microsoft. It takes a different position on the same problem: put the schema and the implementation in one object and keep logic in a restricted expression language. Its announcement describes "a Kubernetes-native framework that lets you create reusable APIs to deploy multiple resources as a single unit." The wiki's reading of the project site shows version 0.10.0 and a `v1alpha1` API, and Google said at launch that kro was not production-ready, so kro is pre-1.0 ([[entities/kro]]).

A ResourceGraphDefinition, or RGD, has a `schema` block that declares the new kind in a lightweight "SimpleSchema" and a `resources` list of templates. kro converts the schema to OpenAPI v3 (the standard schema format the Kubernetes API server uses to validate custom resources), generates a CRD named `<plural>.<group>` (the group defaults to `kro.run`), registers a dynamic controller for it, and reconciles instances. The following sketch follows the pattern in the AWS documentation's WebApplication examples, simplified and illustrative.

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: web-app
spec:
  schema:
    apiVersion: v1alpha1
    kind: WebApp
    spec:
      name: string
      image: string
      replicas: integer | default=2
  resources:
    - id: bucket
      template:
        apiVersion: s3.services.k8s.aws/v1alpha1
        kind: Bucket
        metadata:
          name: ${schema.spec.name}-assets
        spec:
          name: ${schema.spec.name}-assets
    - id: deployment
      template:
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${schema.spec.name}
        spec:
          replicas: ${schema.spec.replicas}
          selector:
            matchLabels: { app: "${schema.spec.name}" }
          template:
            metadata:
              labels: { app: "${schema.spec.name}" }
            spec:
              containers:
                - name: app
                  image: ${schema.spec.image}
                  env:
                    - name: BUCKET_ARN
                      value: ${bucket.status.ackResourceMetadata.arn}
```

The expressions in `${...}` are CEL, the Common Expression Language. CEL is typed, has no side effects, and always terminates, which is why the wiki describes it as deliberately not Turing complete, in other words unable to express arbitrary loops or programs. The snippet shows the key mechanism: the Deployment's environment variable refers to `bucket.status.ackResourceMetadata.arn`, and from that reference kro infers that the bucket must exist first. It builds a dependency graph, creates independent resources in parallel, waits on status values that do not exist yet, and deletes in reverse order. The AWS guide stresses that "kro validates ResourceGraphDefinitions at creation time, not at runtime," so a mistyped field, a missing kind, a type error, or a cycle is rejected when the platform engineer applies the RGD, before any application team creates an instance ([[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]]). The same idea applies to Google's own example, in which a few parameters (a name, node pool, maximum node count, and location) produce a GKE cluster through Config Connector objects ([[examples/self-service-gke-cluster-with-kro]]).

Ordering and readiness are two separate mechanisms. Dependency order comes from references. Readiness comes from `readyWhen`, a list of CEL expressions per resource that defines when it counts as ready. In an RGD, dependents wait until their dependencies are ready; if `readyWhen` is omitted, kro treats a resource as ready as soon as it exists, which is a weak default for slow cloud resources. In the newer alpha `Graph` API, which is disabled by default, `readyWhen` only reports health and a dependent applies as soon as the fields it references exist, so a team moving from an RGD to a Graph could lose a safeguard it relied on ([[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]]). Authors can also define their own instance conditions with `runtime.newCondition()`; when they do, kro hides its built-in conditions, so the author must compose a summary `Ready` condition or generic tools have nothing to read ([[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]]). Crossplane's conditions are fixed by the provider, while kro's are authored, a contrast drawn in [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]].

Deletion is where kro made a deliberate departure. Default Kubernetes owner references, handled by the garbage collector in [[concepts/owner-references-and-garbage-collection]], delete dependents without honoring order among siblings, and a cluster-scoped object cannot be owned by a namespaced one. kro therefore tracks children with an ApplySet, a labeled inventory of everything applied together, keeps its instance finalizer until all children are gone, and deletes in reverse dependency waves, each fully gone before the next begins ([[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]). The cost appears where GitOps tools meet it: Argo CD decides what it owns from tracking metadata, so the kro FAQ tells Argo CD users to add an owner reference and a tracking-id annotation to each templated resource, and documents risks with doing so ([[findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets]], [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]]).

Rollout and maturity matter too. Each change to an RGD becomes an immutable GraphRevision, and the documentation states that if the latest revision fails compilation, instances stop progressing with no fallback to an older revision. Breaking schema changes, such as removing a field or adding a required one without a default, are blocked unless the `kro.run/allow-breaking-changes` annotation is set ([[findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback]], [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]). On the operational side, kro handles all instances from one shared queue with one worker by default and a ten-hour full resync, per its unreleased documentation, and a drift-reconciliation issue was reported closed as a duplicate, so check your version before relying on self-healing ([[examples/kro-shared-queue-tunes-throughput]]). The wiki also notes that the Crossplane project's `function-kro`, announced 2026-03-19, embeds kro's graph builder in a Crossplane pipeline step, which the announcement says brings revision pinning, extra pipeline steps, and `crossplane render` to kro-style graphs; its feature-parity claim is the project's own and unverified ([[entities/function-kro]]).

## 7. Other models: Helm and Kustomize render-time, hand-written operators, Score, Radius, Kratix

Crossplane and kro are not the only way to hide complexity, and a fair tutorial has to place them among their alternatives. The wiki's dossier sorts all approaches into two families. In the render-time family, a tool produces manifests once and something else, typically a GitOps tool such as Flux or Argo CD, must keep them correct afterward. In the controller-driven family, the abstraction is itself a Kubernetes API, and a live control loop reconciles children, writes status to the parent, and handles deletion order ([[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]]).

Helm is the best-known render-time tool. A chart is a collection of files describing a related set of Kubernetes resources, rendered with Go templates and values and installed as one tracked release. The abstraction surface is the values file, which is free-form and is not a real API schema unless the chart author adds a values schema. Nothing reconciles after install, and Helm has no native support for upgrading or deleting CRDs, so Flux's HelmRelease adds CRD policies to compensate ([[entities/helm]], [[findings/helm-does-not-upgrade-or-delete-crds]]). Kustomize takes the opposite approach: a base of ordinary manifests plus overlays and patches, with no templates and no parameter surface at all. Its project encourages fork, modify, and rebase. Consumers of an overlay still read and reason about the underlying manifests ([[entities/kustomize]]). The wiki states the consequence directly: an abstraction is useful when its user can ignore what is below it, and Helm values and Kustomize patches expose the manifests underneath, so users still need to understand Kubernetes ([[findings/helm-values-and-kustomize-patches-leak-the-underlying-manifests-into-the-abstraction]]). That finding is the dossier author's analytical observation supported by documentation, with no incident behind it. kpt and KRM functions run containerized programs over packages of objects and sit in the same render-time family; moving Kustomize's built-in Helm inflation to KRM functions drew user objections because they need a container runtime that laptops, CI, and Argo CD often lack ([[entities/kpt]]).

A hand-written operator, the pattern in [[concepts/operator-pattern]], sits at the other extreme of flexibility. You write a CRD and a controller in Go or another language, typically scaffolded with Kubebuilder or the Operator SDK, and the controller can do anything. That is the right tool when the runbook needs arbitrary logic such as database failover, backup, or schema migration; the wiki's example is the family of stateful data-service operators for Postgres and Elastic ([[examples/stateful-data-services-run-on-postgres-and-elastic-operators]]). The cost is that you own all the code, including its testing, upgrades, informer caches, finalizers, and RBAC. The wiki's guidance is that when a custom API is mostly a composition of existing resources, a Crossplane Composition or a kro RGD can stand in for a bespoke controller ([[findings/hand-written-operators-duplicate-what-composition-could-express]], [[decisions/build-a-custom-operator-or-compose-existing-resources]]). That guidance is documentation-based, with no measurement of maintenance saved.

Score and Radius move the abstraction higher, from a platform-defined kind to the developer's own view of a workload. With Score, a developer writes one `score.yaml` declaring containers, ports, and abstract resources such as `type: postgres`, and implementation CLIs (`score-compose`, `score-k8s`) generate Docker Compose files or Kubernetes manifests. It generates output and runs no controller, so it belongs with the render-time tools. The only adopter evidence in the dossier is testimonials on the project's own site ([[entities/score]], [[examples/score-generates-docker-compose-or-kubernetes-manifests-from-one-workload-spec]]). Radius is server-side. Developers describe an application with containers, databases, and connections, and platform engineers supply Recipes that decide what a "Redis cache" becomes in each environment. Everything the wiki knows about Radius comes from one third-party review, because the primary documentation could not be read, so its CNCF status, Azure lean, Bicep dependency, and early maturity are all unverified claims ([[entities/radius]], [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]], [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]]).

Kratix, from the vendor Syntasso, is an orchestration framework that sits behind a portal. Its central object is the Promise, which bundles a self-service API, embedded workflows, and fleet scheduling across Destinations. Syntasso's illustration schedules one request across a standard cluster, a PCI DSS cluster, and a Terraform destination so the requester does not choose the target ([[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]]). That is a vendor example and not an independent case study, and the wiki did not retrieve details of how Destinations work. The same vendor argues that a portal such as Backstage gives visibility but not provisioning, so ticket queues persist; read that as an attributed claim from a company with a stake ([[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]).

These tools combine more often than they compete. A consultancy post argues that mature platforms layer three: Helm installs components, Crossplane provisions cloud resources, and kro composes developer-facing APIs. The wiki's dossier says this is described as typical and is not tied to named companies ([[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]]).

## 8. Industry use cases: self-service databases, cluster provisioning, service catalogs, multi-cloud

Self-service infrastructure is the dominant use case the wiki found for composite resources. The Crossplane adopters list, which is self-reported and unaudited, shows organizations that put composite resources between application teams and raw cloud resources. Renault lists XRDs and compositions as an abstraction layer. Wellhub, Wildlife Studios, Splash, and Millennium bcp offer self-service provisioning to engineers. Grafana Labs and Consensys run internal developer platforms. Deutsche Kreditbank reports more than ten EKS clusters, and Continental provides self-service ephemeral vclusters, lightweight virtual clusters that run inside a host cluster, to developers ([[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]]). The entries show what organizations are building and not how it performed.

The self-service database is the classic case. VSHN's AppCat is a marketplace in which customers provision databases, message queues, and object storage by creating one small object, while the platform team owns the expansion logic, backups, and maintenance, and generalizes them across service types. This is the "each composite kind is a product" pattern: the platform team publishes a catalog of kinds and other teams consume them ([[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]]). JFrog describes a chain of four tools for self-service cloud environments: developers ask through a Jenkins-based interface, which writes custom resources into Git; Argo CD syncs them into a cluster; and Crossplane reconciles them into cloud resources. Predefined small, medium, and large size classes prevent over-provisioning, and owner and expiry tags support cost cleanup of forgotten environments ([[examples/jfrog-delivers-self-service-cloud-environments-through-jenkins-git-argo-cd-and-crossplane]]). Notice that the guardrails in that story are exactly the "few safe knobs, hide the rest" idea from Section 4.

Crossplane v2's Composition can include any Kubernetes resource, so one object can create infrastructure and application together. The Crossplane 2.0 announcement sketches a `Microservice` kind whose single namespaced object creates an RDS instance, security groups, a Deployment, a Service, an Ingress, and monitoring dashboards. The wiki notes that this is an illustration from the Crossplane authors and not a named customer ([[examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object]]). A related guide shows that an XRD can expose the `scale` subresource, so `kubectl scale`, the Horizontal Pod Autoscaler, and KEDA (an event-driven autoscaler) can scale the XR without knowing its schema, although the composition author must wire the scaling logic ([[examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource]]).

Cluster provisioning is a second major use case, and it shows that the layers overlap. Cluster API applies the same expansion idea to clusters: its ClusterClass is a reusable definition of what a cluster looks like, and a small `topology` on a Cluster object supplies the variable parts, which a controller expands into machine and infrastructure objects the framework already reconciles ([[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]]). The wiki read only a landing page under the experimental-features path of the Cluster API book, which labels the feature experimental. That label may be out of date, so confirm current ClusterClass status in the Cluster API release notes. Meanwhile the Crossplane adopters list says RTL Nederland provisions whole Kubernetes clusters on Azure and AWS with Crossplane, a self-reported entry showing that a general framework can create clusters as managed resources ([[examples/rtl-nederland-provisions-whole-kubernetes-clusters-with-crossplane-which-overlaps-with-cluster-api]]). Cozystack goes further and brings its own substrate, packaging Talos Linux (an operating system built only to run Kubernetes), Kubernetes, KubeVirt, and storage and network components into a PaaS for building a cloud on commodity hardware, with no adopter names in the dossier ([[examples/cozystack-turns-commodity-servers-into-a-cloud-with-kubernetes-databases-and-vms]]).

Scale and multi-cloud complete the picture. Adopters report counts from thousands of managed resources to, for Akamai's provider-ceph, up to 200,000, and SAP reports 100-plus KRM control planes as of February 2024 ([[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]]). These are self-reported one-liners and not verified case studies. They explain why per-type CRDs and per-resource polling matter. Domain-scoped control planes, several small Crossplane instances each owning networking or data, are proposed by one practitioner blog as an alternative to a single monolithic instance, but the dossier says explicitly that this is advice and not evidence of deployments ([[examples/domain-scoped-crossplane-control-planes-are-proposed-in-place-of-one-monolithic-instance]], [[decisions/run-one-crossplane-control-plane-or-several-domain-scoped-ones]]).

## 9. Pitfalls: oversized compositions, leaky abstractions, live-edit disruption, deletion ordering, credential blast radius

The wiki's pitfalls hub makes a general point worth remembering: serious platform failures are usually cascades in which a small change meets a controller loop, a default, or a shared dependency, and the loop amplifies it ([[concepts/pitfalls-and-case-studies]]). Three mechanisms recur, namely finalizers, field ownership, and deletion propagation, and platform abstractions inherit all three. Below are the pitfalls most specific to this part.

Oversized compositions and poorly modeled APIs come first. A Polarpoint practitioner blog lists two mistakes: the "mega-Composition" that tries to compose a whole environment in one blueprint, and an API that mirrors a particular cloud's own resource names. Its advice is to start with small Compositions, model APIs by infrastructure domain, and design for the mental model of the people who will use them. A larger Composition also means more functions that must stay healthy and a bigger blast radius for any edit. The source is opinion, citing no incident or measurement, so verify it in practice ([[findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use]]). Leaky abstractions are the same problem seen from the other end, and Section 7 covered how Helm values and Kustomize patches expose what they were meant to hide.

Editing a live Composition is the most dangerous routine operation. The Crossplane v2 upgrade guide warns that doing so could disrupt or replace resources used by existing XRs. Crossplane tracks each change as a CompositionRevision, and an XR defaults to the Automatic update policy, which adopts the latest revision, so an edit to a shared Composition propagates to every follower and each composite then reconciles toward the new desired state. Mitigations are `compositionUpdatePolicy: Manual` with a pinned revision ref or label selector, referencing functions by OCI digest, and testing with `crossplane render` ([[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]], [[decisions/choose-automatic-or-manual-composition-update-policy]]). kro's model differs. The latest GraphRevision applies to all instances and a failed compile stops them all, so rollout is a single decision and not a per-instance choice ([[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]]). Schema changes are a related contract problem. Crossplane relies on versioning and conversion webhooks, kro blocks breaking changes by default, and a down conversion webhook can stall garbage collection ([[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]]).

Deletion ordering is where abstractions meet finalizers and the garbage collector. Background deletion, the default, removes the owner immediately and cleans dependents later with no ordering, so a database and its network may be deleted together ([[findings/background-deletion-gives-no-teardown-ordering-between-dependents]]). Crossplane offers three composite deletion policies: `Background`; `Foreground`, which keeps the parent until children are gone; and `Pipeline`, in which a function removes resources from desired state step by step ([[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]]). It also offers Usage objects, which block deletion of a used resource until its users are gone and can protect a resource from accidental removal ([[examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal]]). Stateful data adds stakes, since deleting a database through a provider can lose data ([[findings/deleting-stateful-resources-through-a-provider-can-lose-data]]). Removing a Crossplane provider before its managed resources abandons the real resources, because the controller that would run their finalizers is gone; Crossplane has an alpha protection feature that blocks provider removal while managed resources exist ([[findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources]]). And a paused resource cannot be deleted until it is unpaused ([[findings/a-paused-crossplane-resource-cannot-be-deleted-until-it-is-unpaused]]). Through a GitOps tool, deletion can bypass the policy you chose; for example, Argo CD foreground deletion makes Crossplane ignore the composite deletion policy ([[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]]). Immutable fields have their own behavior: Crossplane does not delete and recreate, unlike Terraform, so an edit may quietly not apply ([[findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields]]).

Credential blast radius is the security pitfall. Reconciliation runs as the controller's cloud identity, not as the human who applied the manifest, so permission to create the Kubernetes object is effectively permission to change cloud resources with the controller's rights. Kubernetes RBAC on the platform API therefore becomes the cloud authorization boundary ([[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]], [[findings/blast-radius-and-privilege-centralization]]). The tools offer different mitigations, covered in Section 11. A subtler variant is ACK's cross-namespace references: disabling them is not tenant isolation ([[findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation]]). Adoption brings its own risks, since an adopt-or-create policy can take over a look-alike resource ([[findings/adopt-or-create-can-take-over-a-look-alike-resource]]).

Finally, two operational costs apply to the whole approach. Crossplane needs a hosting cluster and Kubernetes skills, and the platform team must own the abstractions, observability, and cross-layer troubleshooting, a conclusion that appears in a competitor's article, in the project's own Terraform comparison, and in a 2022 evaluation ([[findings/crossplane-adoption-needs-a-hosting-cluster-kubernetes-skills-and-platform-team-owned-abstractions]]). And stacking a GitOps agent over a controller-driven abstraction creates two reconcile loops that can hide status and drift at two layers, with generic agents unable to judge custom-resource health unless given checks ([[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]).

## 10. Tradeoffs across abstraction models: a decision framework

The tools in this part differ along four axes, and naming them makes the choice less mysterious. The first axis is where the abstraction surface sits. Helm values and Kustomize patches sit close to manifests and leak them. Score and Radius sit high, at the workload, and pay with a translation or control-plane layer. Crossplane and kro sit in the middle, with a typed API the platform team designs. The second axis is whether anything keeps running. Render-time tools produce output once, and continuous correction is a GitOps tool's job. Controller-driven tools reconcile forever, which gives drift correction and ordered deletion and also makes the control plane a production dependency. The third axis is where logic runs and how it can fail. Crossplane runs functions in-cluster as gRPC services, so any language works but errors may surface at reconcile time. kro runs CEL in-process, which terminates and is type-checked at apply time but cannot express logic beyond CEL ([[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]]). The fourth axis is maturity and governance. Crossplane is a CNCF graduated project with versioned XRDs; kro is `v1alpha1`; Radius is described as early-stage by a single blog.

| Model | Surface the user sees | Logic | Keeps reconciling | Best fit |
|---|---|---|---|---|
| Helm | Free-form values | Go templates | No, needs GitOps | Packaging components |
| Kustomize | Plain YAML plus overlays | Template-free patching | No, needs GitOps | Per-environment variants |
| Hand-written operator | Any CRD you design | Any code | Yes | Domain logic such as failover and backup |
| Crossplane | Platform-defined kind from an XRD | Function pipeline | Yes, including cloud APIs | Owning cloud resources behind a platform API |
| kro | Platform-defined kind from an RGD | CEL with inferred order | Yes, Kubernetes objects | Composing resources already on the cluster |
| Score | One workload spec | CLI translation | No, output only | Developer-facing workload description |
| Radius | Application with connections | Recipes per environment | Yes, own control plane | Developer-facing apps, maturity unverified |
| Kratix | Promise API | Pipelines and Destinations | Yes | Orchestration behind a portal |

The table is the wiki's synthesis of several single-source claims, and the Radius and Score rows rest on one third-party review and the project's own site respectively. Within it, the Crossplane versus kro comparison is the one most teams must make. Crossplane separates schema (XRD) from implementation (Composition) and runs logic as external functions. kro puts both in one definition and evaluates CEL inside its own controller. Crossplane reports its readiness through pipeline steps such as `function-auto-ready`, kro through `readyWhen`. Crossplane's rollout is per-instance through revisions, and kro's is global with no fallback. The execution-model difference is flexibility against checkability ([[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]]). One tutorial built the same `StorageApp` API both ways, an application plus an S3 bucket plus an IAM role, and found equivalent outcomes, with kro's reference model handling creation order and dependency-missing cases more naturally. That is a single tutorial and not production evidence ([[examples/build-the-same-storageapp-api-with-kro-and-with-a-crossplane-go-templating-composition]]).

A practical decision rule, from the consultancy post and echoed in the wiki's decision page, is to use kro when the building blocks are already Kubernetes resources, including ACK, ASO, or Config Connector objects, and Crossplane when the platform must drive cloud APIs directly. The third option is both, as separate layers or through `function-kro`. The wiki labels this an open question framed by the sources and not an outcome-tested rule, since no source gives scale numbers or incident data, so test capacity yourself ([[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]]). Before any of this, ask whether you need a controller at all: if the API is not declarative, or the automation does not need a custom resource, a script or a Helm chart may be enough, a point the Kubernetes documentation itself makes ([[decisions/build-a-custom-operator-or-compose-existing-resources]]). Finally, ordering between whole manifest sets is a different problem again. Flux `dependsOn` and Argo CD sync waves order objects that a pipeline delivers without defining a new API, so they sit beside composition and not inside it ([[comparisons/ordering-models-flux-argo-cd-kro-crossplane]]).

## 11. How cloud-vendor add-ons, Cluster API and Terraform controllers approach the same problem

The cloud vendors ship their own provisioning controllers, and they make a revealing contrast. Config Connector for Google Cloud, ACK for AWS, and Azure Service Operator for Azure each expose roughly one CRD per cloud resource. They give a direct, close-to-one-to-one view of the cloud and leave abstraction to other tools; the EKS documentation points to kro for composing ACK objects, and Google's kro announcement composes Config Connector objects ([[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]]). The comparison comes from a Crossplane maintainer's blog, so it is positioning and not neutral analysis. Crossplane is the multi-cloud option that adds Compositions and XRDs.

Each add-on handles the shared problems in its own way. For credentials, Crossplane uses a `ProviderConfig` per account, ACK uses `IAMRoleSelector` objects to map namespaces to AWS roles for cross-account management ([[examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management]]), and Config Connector's namespaced mode binds each namespace to its own Google service account and project, which also spreads API quota ([[examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts]]). The wiki's decision page frames the underlying choice ([[decisions/scope-provider-credentials-per-namespace-or-cluster-wide]]). For adoption, ACK offers `adopt-or-create` and strict `adopt` through annotations ([[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]]), Config Connector acquires an existing resource by name and requires `resourceID` when the service generates IDs ([[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]]), and Crossplane uses `Observe` plus the external-name annotation. SAP's BTP provider, where identifiers are assigned by the platform, recovers a lost ID by business key and creation window to avoid blindly adopting look-alikes ([[examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window]], [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]]). For deletion, ACK deletes the AWS resource unless the `services.k8s.aws/deletion-policy: retain` annotation is set on the object or its namespace, or the controller is started with a retain flag, and Config Connector offers an `abandon` deletion policy set by annotation. The wiki's sources spell these options inconsistently, and one dossier uses a looser `deletionPolicy` wording that matches Crossplane's older field name more than ACK's real mechanism, so check the current ACK and Config Connector documentation before relying on an exact spelling ([[comparisons/deletion-policies-across-gitops-and-provider-tools]]). Ordering is a known gap in the per-resource model: Config Connector has no Terraform-style dependency graph, and Argo CD deletes children without ordering ([[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]). That is exactly the hole a composition layer fills. A typical Google Cloud shop delivers Config Connector resources from Git with Argo CD or Flux while the controller's own identity makes the cloud calls ([[examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls]]), and single-cloud teams choose between ACK per service and ASO v2 ([[examples/single-cloud-teams-pick-ack-per-service-or-azure-service-operator-v2-with-code-generated-crds]]).

Cluster API applies the same idea to Kubernetes clusters. A management cluster reconciles Cluster and Machine objects into workload clusters through infrastructure, bootstrap, and control-plane providers, and its core controllers stay generic by relying on an agreed contract ([[entities/cluster-api]]). Its teardown uses owner references and stops on disruption budgets, attached volumes, and failing hooks ([[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]]). Centralizing authority in a management cluster also makes it a single point of failure ([[examples/cluster-fleet-lifecycle-with-cluster-api]], [[findings/blast-radius-and-privilege-centralization]]).

Terraform in a cluster is the pragmatic route for teams with large existing estates. tofu-controller, from the Flux family, and Terraform Operator wrap existing Terraform code in a CRD and run plan and apply in pods, so neither removes the need to write Terraform. The wiki records that tofu-controller keeps state in Kubernetes Secrets, can require approval through a plan ID set via Git, and couples to specific Terraform and Flux versions, with its maintenance status after Weaveworks' wind-down unchecked; the Terraform Operator side of the comparison is mostly blank because the dossier read only a short README ([[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]], [[findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions]]). tofu-controller also supports a detection-only mode, which suits infrastructure where an automatic apply could be destructive ([[examples/tofu-controller-detects-terraform-drift-without-applying]]). Compared with Crossplane, the core contrast is where the loop runs. The Crossplane blog says "Crossplane is a control plane, where Terraform is a command-line tool." Crossplane corrects drift automatically and gives each resource an independent API object with Kubernetes RBAC, but it has no built-in plan preview and requires Kubernetes expertise. Terraform shows drift at the next plan and offers a reviewable plan, but it needs state locking. Both main sources are partisan, and the wiki records the lack of a neutral comparison ([[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]]). Upjet bridges the two worlds by generating Crossplane providers from Terraform providers.

GitOps tools sit above all of these. Flux and Argo CD deliver desired state and keep it in place, and they judge health differently: Flux's kustomize-controller waits for health before marking a Kustomization ready, while Argo CD aggregates the health of children and needs Lua checks for CRDs, small scripts that tell it how to read health from a custom resource it does not understand natively. Crossplane's own Argo CD guide requires annotation-based resource tracking, Lua health checks, exclusion of `ProviderConfigUsage` objects, and a higher client rate limit because of the many CRDs ([[examples/crossplane-resources-hosted-by-argo-cd]]). Flux and Argo CD also prune what Git no longer contains, which turns a deleted manifest into a deleted cloud resource unless guarded ([[findings/unintended-deletion-through-prune]]). The wiki's landscape page adds a warning about sources: several comparisons of Argo CD, Flux, Port, and Kratix come from vendors with no independent benchmarks ([[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]]).

## 12. Design principles for good platform APIs

The preceding sections suggest a set of principles. Each is stated with its reasoning, and where the wiki's evidence is thin the text says so.

First, design the API for the consumer's mental model, not the provider's. A platform API is a product, and its group, kind, and schema become a public contract that cannot be changed lightly: XRD group and names are immutable, and kro blocks breaking schema changes unless forced. An API that mirrors a cloud's own resource names forces every user to learn the cloud, which defeats the purpose of Section 1. Expose a few safe knobs, such as size classes, and hide the rest, as JFrog's small, medium, and large classes do.

Second, keep abstractions small and composable. A mega-Composition concentrates risk and multiplies the functions that must be healthy. Smaller compositions are easier to test, review, and roll out. The wiki's evidence here is practitioner advice and not measurement, but it follows from the blast-radius argument in Section 9.

Third, make safety defaults explicit and visible. Deletion of a real resource should be a deliberate choice, expressed through `managementPolicies`, retain or abandon policies, Usages, and deletion policies, and not an accident of defaults. Where ordering matters, encode it, whether through kro's inferred reverse waves, Crossplane's Foreground or Pipeline policies, or Usages, because background deletion promises no order.

Fourth, report status truthfully. Conditions are the common language that lets GitOps tools wait, composites aggregate, and humans debug. Include `observedGeneration` so a stale status cannot look healthy, define readiness precisely instead of treating "exists" as "ready," and keep a summary `Ready` condition even when you author custom ones ([[concepts/conditions]], [[findings/missing-observedgeneration-hides-stale-status]]).

Fifth, treat RBAC on the platform API as the security boundary, and scope the identity behind it. Because controllers act with their own cloud identity, anyone who can create the object inherits those rights. Map namespaces to separate roles or accounts where the tool allows it, and keep trusted repositories as the source of manifests ([[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]]).

Sixth, choose the least expressive tool that does the job. A restricted language like CEL can be checked at apply time and always terminates, while a function in a general-purpose language can do anything and fail late. Neither is better in the abstract: the trade is checkability against flexibility, and a hand-written operator is warranted only when the runbook needs logic composition cannot express.

Seventh, make change safe. Version the schema, pin revisions where the tool allows it, test with `crossplane render` or its equivalent before changing shared definitions, and treat edits to a shared Composition or RGD as high risk, since both tools can propagate a bad change to every consumer.

Eighth, plan for scale from the beginning. Count CRDs, function calls, and reconciles. Install only the provider families or resource types you use, remember that cloud API rate limits are invisible to Kubernetes, and note that the wiki has no sourced data on how those limits constrain these controllers ([[concepts/scale-and-sharding]]).

Ninth, design the seam with GitOps deliberately. A controller-driven abstraction runs a second loop beneath the delivery tool's loop, so decide who owns which fields, how health is judged, and what deletion does at each layer before you go to production.

Finally, accept that this field is young. kro is pre-1.0, Crossplane v2 removed features without an automated migration path, and much online content is stale ([[findings/immature-abstractions-in-the-control-plane-ecosystem]]). Pin versions, read release notes, and prefer designs that can survive replacing a tool underneath a stable API. That last point is the strongest argument for the whole approach: a good platform API outlives the implementation behind it.

## Further reading

Concept pages: [[concepts/managed-resource]], [[concepts/composite-resource]], [[concepts/composition]], [[concepts/provider]], [[concepts/custom-resource-definition]], [[concepts/operator-pattern]], [[concepts/conditions]], [[concepts/finalizers]], [[concepts/owner-references-and-garbage-collection]], [[concepts/tooling-landscape]], [[concepts/scale-and-sharding]], [[concepts/pitfalls-and-case-studies]].

Comparisons and decisions: [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]], [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]], [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]], [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]], [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], [[comparisons/crossplane-providers-versus-cluster-api-providers]], [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]], [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]], [[comparisons/provider-families-versus-per-service-controllers]], [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]], [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]], [[decisions/build-a-custom-operator-or-compose-existing-resources]], [[decisions/choose-automatic-or-manual-composition-update-policy]].

Entities: [[entities/crossplane]], [[entities/kro]], [[entities/function-kro]], [[entities/upjet]], [[entities/helm]], [[entities/kustomize]], [[entities/kpt]], [[entities/score]], [[entities/radius]], [[entities/kratix]], [[entities/ack]], [[entities/config-connector]], [[entities/azure-service-operator]], [[entities/cluster-api]], [[entities/tofu-controller]], [[entities/terraform-operator]].

Source summaries: [[sources/krm-platform-vocabulary]], [[sources/research-managed-resource]], [[sources/research-composite-resource]], [[sources/research-composition]], [[sources/research-provider]], [[sources/research-kro-and-abstraction-models]], [[sources/research-crossplane-deep-dive]], [[sources/research-landscape]].

Source URLs relied on, as recorded in those summaries:

- https://docs.crossplane.io/latest/composition/compositions/
- https://docs.crossplane.io/latest/composition/composite-resources/
- https://docs.crossplane.io/latest/managed-resources/managed-resources/
- https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/
- https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md
- https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md
- https://blog.crossplane.io/function-kro-yaml-cel/
- https://blog.crossplane.io/composition-functions-in-production/
- https://blog.crossplane.io/crd-scaling-provider-families/
- https://blog.crossplane.io/announcing-crossplane-2-0/
- https://kro.run/docs/overview
- https://kro.run/docs/concepts/reconciliation/readiness
- https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html
- https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator
- https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm
- https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8
- https://helm.sh/docs/topics/charts/
- https://kustomize.io/
- https://score.dev/
- https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026
- https://docs.kratix.io/
- https://aws-controllers-k8s.github.io/community/docs/community/overview/
- https://docs.cloud.google.com/config-connector/docs/best-practices
- https://azure.github.io/azure-service-operator/
- https://cluster-api.sigs.k8s.io/user/concepts
- https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/
- https://flux-iac.github.io/tofu-controller/
- https://jfrog.com/blog/how-jfrog-delivers-self-service-cloud-environments-for-our-developers/
- https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds
