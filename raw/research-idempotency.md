# Research dossier: Idempotency

Research date: 2026-11-25

## Overview

Idempotency means that doing an operation again leaves the system in the same end state as doing it once. In Kubernetes platform work the idea shows up at three layers. The first is the controller loop. A reconciler reads the desired state in `spec`, observes actual state, and closes the gap. If the same reconcile runs twice, or runs after a restart, the second run finds nothing to do. The Kubernetes controller docs frame this with the thermostat analogy: the controller keeps nudging current state toward desired state rather than replaying a script of events. The Kubebuilder book and the controller-runtime FAQ turn that into a rule. Reconcile functions must be idempotent, must read all the state they need, and must not branch on whether the trigger was a create, update, or delete.

The second layer is the Kubernetes API itself. Deterministic object names give optimistic locking, because a second create of the same name fails loudly instead of duplicating. Server-side apply gives declarative, repeatable writes with per-field ownership. Flux's kustomize-controller and Argo CD both build on repeated apply. Flux runs a server-side apply dry-run on every interval to find and fix drift. Argo CD offers self-heal and retry with exponential backoff. Re-running the same apply is safe by design, and conflicts show up as explicit errors instead of silent overwrites.

The third layer is the hard one: controllers that call cloud APIs. Creating a cloud resource is not naturally idempotent. If a controller calls a create API and crashes before it records the returned ID, the next reconcile cannot tell whether the resource exists. The sources describe several answers. Crossplane keeps a stable external name in an annotation and uses it for Observe, Update, and Delete. It also writes an `external-create-pending` marker before a create and stops to ask a human when the outcome is ambiguous. Config Connector and ACK "acquire" or "adopt" a same-named or explicitly identified resource, so a retried create converges on the existing object. AWS's Builders' Library describes the server-side half of the contract: a caller-supplied client token so retried requests are recognized as duplicates and get a semantically equivalent response.

Taken together, the sources show a layered strategy. Make the loop level-based and stateless. Make names deterministic wherever the cloud API allows it. Persist the external identity as early as possible, and when that is impossible, record intent before acting and fail safe when the result is unknown. Tools differ mostly in how they deal with the unknown-result case and with adopting pre-existing resources. Crossplane chooses to stop and require human action. Config Connector and ACK choose adoption by name or ID. Terraform-style tools are only mentioned for contrast. Every source assumes a reconciler runs again and again, so tutorials should teach the loop first and the cloud-API problems second.

## Sources

### 1. Kubernetes Controllers (concepts)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: The canonical explanation of the control-loop pattern. It uses a thermostat to introduce desired versus current state, and says controllers watch a resource's `spec` and act to bring the world closer to it. It separates controllers that act through the API server (the Job controller creating Pods) from controllers that act on external systems, and notes the loop reports current state back to the API server so other loops can react. The page also says the cluster may never reach a stable state and that this is fine as long as controllers keep making useful changes. It is the best starting point for explaining why repeating a reconcile is safe, because the loop is a convergence process and not a sequence of one-shot commands. The design section favors many small controllers over one monolith, since controllers can fail.
- Quote: "controllers can fail, so Kubernetes is designed to allow for that."

### 2. Kubebuilder Book: Good Practices
- URL: https://book.kubebuilder.io/reference/good-practices
- Title: Good Practices - The Kubebuilder Book
- Publisher: Kubernetes SIG API Machinery (kubebuilder)
- Kind: Official framework documentation
- Summary: States directly that a controller's reconcile loop must be idempotent, and explains why. Idempotent reconcilers handle unexpected events, startup, and upgrades correctly. Writing logic keyed to specific events goes against the operator pattern and controller-runtime design, and can leave resources stuck needing manual fixes. The page also recommends one controller per Kind for error isolation and scalability, status conditions for observable state, and Kubernetes logging conventions. Useful for tutorials as the short, authoritative "why idempotent" statement aimed at operator authors.
- Quote: "the controller's reconciliation loop needs to be idempotent."

### 3. controller-runtime FAQ
- URL: https://raw.githubusercontent.com/kubernetes-sigs/controller-runtime/main/FAQ.md
- Title: FAQ (controller-runtime)
- Publisher: kubernetes-sigs/controller-runtime maintainers
- Kind: Framework FAQ and design guidance (source repository)
- Summary: Gives the practical rules behind idempotent reconcilers. Do not write different logic for create, update, and delete events. Read all needed state, then write updates, so the reconciler copes with skipped or coalesced events and with startup. It also covers stale caches. When possible use deterministic names for created objects so the API server rejects a duplicate create (optimistic locking). The StatefulSet controller appends an ordinal and the Deployment controller hashes the pod template. When names must be generated (`generateName`), track the actions taken and requeue to repeat them if they have not appeared, as the ReplicaSet controller does. It also recommends testing against envtest and asserting on resulting state, not on which API calls were made. Note: I read this through the raw GitHub copy, since the rendered page returned empty content.
- Quote: "Reconcile functions should be idempotent, and should always reconcile state by reading all the state it needs, then writing updates."

### 4. Kubernetes Server-Side Apply
- URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/
- Title: Server-Side Apply
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Describes how the API server tracks field ownership in `managedFields`. Applying the same configuration again is safe, and applying a conflicting value owned by another manager returns a conflict unless forced. Forcing overrides the value and transfers ownership. When several appliers set the same value they share ownership. This is the mechanism under Flux's drift correction and a key reason declarative apply stays repeatable while multiple controllers or humans touch the same object. Only the portions on field management and conflicts were read closely; the page is long.
- Quote: none taken; the page's key point is that writes to fields owned by another manager conflict unless forced.

### 5. Flux Kustomization API reference
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomizations
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary: Documents how the kustomize-controller applies manifests repeatedly. On each `.spec.interval` the Kustomization runs a server-side apply dry-run to detect and correct drift. A new Git revision or a generation change is handled immediately outside the interval. `.spec.prune` garbage-collects objects dropped from Git, and a `prune: disabled` annotation protects individual objects. `.spec.retryInterval` retries failures on a separate schedule, and the controller can add jitter to avoid load spikes when many objects share an interval. It also explains that conflicting field ownership is the signal that another actor changed the object. Good example of idempotency as a scheduled, repeated apply.
- Quote: "every ten minutes, the Kustomization runs a server-side apply dry-run to detect and correct drift inside the cluster."

### 6. Argo CD Automated Sync Policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy
- Publisher: Argo project (CNCF)
- Kind: Official documentation
- Summary: Explains automated sync, prune, self-heal, and retry. Self-heal is off by default, so live-cluster changes do not trigger a sync unless enabled. Pruning has a safety check that blocks syncs that would leave an application with no resources unless `allowEmpty` is set. Failed syncs can retry with exponential backoff using `limit`, `duration`, `factor`, and `maxDuration`. The page also warns that in multi-source applications, disabling self-heal does not guarantee live changes persist. Useful for comparing how a GitOps tool retries and re-converges versus a cloud-resource controller.
- Quote: "Argo CD can automatically retry a failed sync operation using exponential backoff."

### 7. Crossplane Managed Resources
- URL: https://docs.crossplane.io/master/managed-resources/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: Defines the managed resource (MR) as the Kubernetes object for an external resource. It treats `spec.forProvider` as the source of truth and says Crossplane reverts out-of-band changes. The page shows the EXTERNAL-NAME column (a VPC named `my-test-vpc` has external name `vpc-01353cfe93950a8ff`) and three ways to reference other resources: by external name, `nameRef`, and selector. It explains late initialization (filling unset fields from provider-assigned values), `initProvider` (settings applied only at creation so autoscalers are not fought), `managementPolicies` (grant any subset of Observe, Create, Update, Delete, LateInitialize; an empty list pauses), and the `crossplane.io/paused` annotation. It also notes Crossplane only deletes an external resource when its MR is deleted, unlike Terraform's replace-on-immutable-change behavior.
- Quote: "Crossplane considers the `forProvider` field of a managed resource the \"source of truth\" for external resources."

### 8. Crossplane issue 1863: Rethink external-name annotation
- URL: https://github.com/crossplane/crossplane/issues/1863
- Title: Rethink external-name annotation #1863
- Publisher: Crossplane maintainers (muvaf, negz) on GitHub
- Kind: Design discussion
- Summary: Explains why `crossplane.io/external-name` exists and what it costs. It was introduced to carry a name from claims to managed resources and to default the external name to `metadata.name`. The maintainers note it also gives a place to store a cloud-assigned identifier that differs from the Kubernetes name. The discussion shows the real difficulty: AWS API Gateway `API` has both a name and an AWS-assigned ID, and `GetApi` needs the ID; IAM policy uses the full ARN; security groups choose ID. Users cannot tell what the annotation holds until they try. One side proposes keeping IDs in `spec.forProvider` with documented fields; the other wants to keep a single consistent place. The issue was closed by a stale bot in 2022 without a decision, so it remains an unresolved design tension.
- Quote: "the place to look to discover the actual external name may not be as consistent as a known annotation."

### 9. Crossplane issue 3037: external-create-pending
- URL: https://github.com/crossplane/crossplane/issues/3037
- Title: Reconcile blocked by `crossplane.io/external-create-pending` annotation #3037
- Publisher: Crossplane users and maintainer negz on GitHub
- Kind: Issue thread and maintainer explanation (failure-mode write-up)
- Summary: The clearest source on the "ambiguous create" problem. A provider writes `external-create-pending` before calling a cloud create API, then `external-create-succeeded` or `external-create-failed` afterward, all within one reconcile iteration. If the provider is restarted in between, the MR is blocked with the event "cannot determine creation result - remove the annotation if it is safe to proceed". The maintainer explains that Crossplane originally just looked up the resource by identifier on the next reconcile, but many cloud APIs return a generated ID (the AWS VPC example), so a lost response means a second create could leak the first resource. Workarounds are lookup by tags or labels, which needs per-resource code and fails when tagging is unsupported. Proposed mitigations were documenting this and letting resources with deterministic identifiers opt out. Reporters hit it after a provider restart during a failing create (IAM errors). Closed as not planned.
- Quote: "cannot determine creation result - remove the crossplane.io/external-create-pending annotation if it is safe to proceed"

### 10. SAP Crossplane provider docs: External Name Handling (ADR)
- URL: https://sap.github.io/crossplane-provider-docs/docs/crossplane-provider-btp/docs/contribution-notes/external-name-handling/
- Title: External Name Handling
- Publisher: SAP (crossplane-provider-btp contributors)
- Kind: Architecture decision record from a real provider team
- Summary: A concrete, recent design for handling external names across providers. It restates the default (crossplane-runtime sets external name to `metadata.name` if unset) and the official import flow (Observe policy, set external-name, read `status.atProvider`, then switch to full management). SAP's approach: an explicitly set external name signals user intent that the resource should already exist, which prevents accidental adoption, and so they remove the default initializer. Compound keys use `/` with a 512 character limit. For lost-ID creates they add a narrow recovery path: only when `external-create-pending` is present, search by a semantic key (for example subdomain or name plus parent ID), require the resource's `created_at` to fall inside a bounded window around the pending timestamp, then patch the external name and requeue. Matches outside the window emit a refused-brownfield warning. This shows a practical way to make ambiguous creates recoverable without blindly adopting look-alike resources.
- Quote: "This is **not** an import mechanism: brownfield resources are refused"

### 11. ACK Resource Adoption guide
- URL: https://aws-controllers-k8s.github.io/docs/guides/adoption/
- Title: Resource Adoption
- Publisher: AWS Controllers for Kubernetes project
- Kind: Official documentation
- Summary: Explains two adoption policies set through the `services.k8s.aws/adoption-policy` annotation. `adopt-or-create` adopts an existing resource or creates it, and the manifest becomes the source of truth, which is the declarative and retry-friendly option. `adopt` imports strictly, without changing the resource, and populates the spec from AWS. The `adoption-fields` annotation tells the controller how to find the resource (VPC ID, queue URL, SNS ARN, bucket name, table name). After adoption the annotations are no longer needed, and deleting the Kubernetes object deletes the AWS resource unless `deletionPolicy: Retain`. The page labels adoption a Beta feature. Useful for contrasting with Crossplane's more cautious approach.
- Quote: "adopts the resource if it exists in AWS, or creates it if it doesn't."

### 12. Introducing AWS Controllers for Kubernetes (ACK)
- URL: https://aws.amazon.com/blogs/containers/aws-controllers-for-kubernetes-ack/
- Title: Introducing the AWS Controllers for Kubernetes (ACK)
- Publisher: AWS Containers blog
- Kind: Vendor announcement and architecture overview (2020)
- Summary: Introduces ACK's tenets: resources are managed directly through AWS APIs rather than CloudFormation, so Kubernetes is the single source of truth for desired state; controllers and CRDs are generated from the AWS Go SDK. The launch list included S3, SQS, SNS, DynamoDB, ECR, and API Gateway V2. At the time, the team asked the community whether ACK should adopt existing AWS resources and how destructive operations should behave, which later became the adoption and deletion-policy features in source 11. Useful historically; it contains little on idempotency mechanics directly, and I read only the portions covering tenets, the S3 example, and next steps.
- Quote: "This allows Kubernetes to be the single 'source of truth' for a resources desired state."

### 13. Config Connector: Create, acquire, and delete resources
- URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources
- Title: Managing and deleting resources
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Describes Config Connector's built-in idempotent create. If the resource does not exist it is created; if one with the same name already exists in the organization, project, or folder it is acquired and managed. Resources with service-generated IDs can only be acquired through the `resourceID` field. By default, deleting the Kubernetes object deletes the cloud resource, and `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. The page walks through acquiring an empty BigQuery dataset. This is the same-name-means-same-resource strategy, which works well when the cloud API accepts caller-chosen names and poorly when it assigns IDs.
- Quote: "If a resource with the same name already exists, Config Connector acquires that resource and starts managing it."

### 14. Amazon Builders' Library: Making retries safe with idempotent APIs
- URL: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/
- Title: Making retries safe with idempotent APIs
- Publisher: Amazon Web Services (author Malcolm Featonby)
- Kind: Engineering article from a major cloud provider
- Summary: The server-side view of safe retries. Retries fix transient faults but can duplicate side effects, such as launching two EC2 instances. Hash-based duplicate detection is rejected because two identical requests might be intentional. The preferred contract is a unique caller-supplied client request identifier (EC2's `ClientToken`), stored along with the mutation in one atomic, ACID operation so the token and the resource cannot diverge. It also argues for returning a semantically equivalent response on retry instead of "already exists", since the latter changes the caller's control flow, and it labels created resources with the token so they can be traced. For controller authors this explains what to look for in a cloud API when deciding whether create can be retried blindly. The article's later sections on late-arriving requests and token reuse with different parameters were not read in detail.
- Quote: "An idempotent operation is one where a request can be retransmitted or retried with no additional side effects"

### 15. kro (Kube Resource Orchestrator) home page
- URL: https://kro.run/
- Title: Kube Resource Orchestrator | kro
- Publisher: kro project (Kubernetes SIG Cloud Provider)
- Kind: Official project page
- Summary: A short overview. kro runs as an in-cluster controller, works with any CRD, and states "continuous reconciliation with automatic drift detection". A `ResourceGraphDefinition` defines a new API with SimpleSchema, and CEL expressions wire values between resources. The docs sub-pages for instances and reconciliation returned empty content through the scraper, so this entry supports only the claim that kro is a continuously reconciling composition layer, not detailed idempotency mechanics. ACK's docs list a "Using ACK with kro" guide that I did not read.
- Quote: "Continuous reconciliation with automatic drift detection."

## Real-world use cases

Operator authors using Kubebuilder and controller-runtime are the most common practitioners. The Kubebuilder good-practices page and the controller-runtime FAQ (https://book.kubebuilder.io/reference/good-practices, https://raw.githubusercontent.com/kubernetes-sigs/controller-runtime/main/FAQ.md) apply to any operator that owns child objects. The built-in controllers are the reference cases. The Deployment controller hashes the pod template into a deterministic ReplicaSet name, the StatefulSet controller appends an ordinal, and the ReplicaSet controller tracks expected creations and requeues. Each avoids duplicate creates after a restart or stale cache read.

GitOps delivery is the second large use case. Flux's kustomize-controller applies a Git revision every interval with a server-side apply dry-run to correct drift (https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD offers self-heal, prune with a no-empty-application safety check, and retry with backoff (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). Both depend on apply being safe to repeat, which the server-side apply field-ownership model supports (https://kubernetes.io/docs/reference/using-api/server-side-apply/).

Managing cloud infrastructure from Kubernetes is the third. Crossplane providers for AWS, GCP, and Azure create VPCs, queues, node groups, and databases, using external names to find them again (https://docs.crossplane.io/master/managed-resources/managed-resources/). The Crossplane issue reports in 3037 involve an SQS queue on provider-aws and a GCP resource blocked after provider restarts (https://github.com/crossplane/crossplane/issues/3037). SAP's BTP provider (Subaccount, ServiceInstance, ServiceBinding and others) shows a vendor-built recovery design for a platform without deterministic IDs (https://sap.github.io/crossplane-provider-docs/docs/crossplane-provider-btp/docs/contribution-notes/external-name-handling/). ACK targets AWS services such as S3, SQS, SNS, DynamoDB, EKS and VPC, and its adoption feature lets teams bring existing resources under management (https://aws-controllers-k8s.github.io/docs/guides/adoption/, https://aws.amazon.com/blogs/containers/aws-controllers-for-kubernetes-ack/). Config Connector does the same for Google Cloud resources such as BigQuery datasets and Spanner instances (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources).

Autoscaled resources are a typical scenario for `initProvider`. A Crossplane EKS NodeGroup sets an initial `desiredSize` and Crossplane does not revert later autoscaler changes (https://docs.crossplane.io/master/managed-resources/managed-resources/). The cloud providers' own APIs, such as EC2 `RunInstances` with `ClientToken`, are what controllers sit on top of (https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

## Pitfalls and how tools address them

Event-specific logic. Reconcilers that branch on "was this a create or an update" miss skipped or coalesced events and break on restart. The Kubebuilder book says this can leave resources stuck, and the controller-runtime FAQ says plainly to avoid it. Fix: re-derive everything from current state on each run (sources 2 and 3).

Ambiguous creates. If a controller crashes after a cloud create call but before recording the returned ID, a naive retry creates a duplicate and leaks the first. Crossplane writes `external-create-pending` before the call and refuses to continue if the result is unknown, requiring a human to remove the annotation (https://github.com/crossplane/crossplane/issues/3037). That is safe but does not scale, as the reporter noted. SAP's provider adds bounded semantic recovery that matches by a business key and a creation-time window (https://sap.github.io/crossplane-provider-docs/docs/crossplane-provider-btp/docs/contribution-notes/external-name-handling/). Config Connector and ACK sidestep the problem for resources with caller-chosen names or IDs by acquiring whatever already exists (source 13 and source 11). On the API side, a client token makes the cloud itself deduplicate (source 14).

Unclear external identity. The external name could be a human name, a GUID, an ARN, or a compound key, and users cannot tell which until they see it. The Crossplane issue shows API Gateway APIs and IAM policies using different choices (https://github.com/crossplane/crossplane/issues/1863). SAP proposes a compound key format with `/` as delimiter and a length limit. Config Connector restricts service-generated-ID resources to `resourceID` acquisition.

Accidental adoption versus intentional import. Adopt-or-create is convenient, but it can take over a resource that happens to share a name, then update it to match the manifest. ACK documents that adopt-or-create overwrites to match the spec, and offers strict `adopt` for inspection first. SAP argues that an explicitly set external name should be required to adopt and removes the defaulting initializer. Crossplane's official import flow uses an Observe-only management policy, then promotes. The sources do not agree on the best default.

Deletion surprises. In ACK and Config Connector, deleting the Kubernetes object deletes the cloud resource unless a retain or abandon policy is set. Crossplane's `managementPolicies` can omit Delete, and an empty list pauses the resource. Tutorials should present these as part of safe adoption and migration.

Fighting other writers. Declarative tools overwrite drift by design, which conflicts with autoscalers, other controllers, or operators. Crossplane offers `initProvider` and late initialization controls. Kubernetes server-side apply surfaces conflicts through field ownership. Argo CD's self-heal is off by default, and its docs caution that multi-source applications can still trigger syncs.

Load and retry storms. Many objects with the same interval can spike API load. Flux adds optional jitter and a separate `retryInterval`, and Argo CD caps backoff with `maxDuration`. A related point in the AWS article is that blind retry is only safe when the target API is idempotent (source 14).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/controller/ : the thermostat explanation of desired versus current state, best first read.
- https://book.kubebuilder.io/reference/good-practices : short, direct justification for idempotent reconcilers and one-controller-per-Kind.
- https://raw.githubusercontent.com/kubernetes-sigs/controller-runtime/main/FAQ.md : practical answers on events, stale caches, and deterministic names.
- https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ : clearest write-up of client tokens and semantic equivalence.
- https://github.com/crossplane/crossplane/issues/3037 : the maintainer comment is the best plain explanation of why cloud creates are hard to retry.
- https://sap.github.io/crossplane-provider-docs/docs/crossplane-provider-btp/docs/contribution-notes/external-name-handling/ : worked design for external names and recovery.
- https://docs.crossplane.io/master/managed-resources/managed-resources/ : the reference for external names, management policies, and late initialization.
- https://aws-controllers-k8s.github.io/docs/guides/adoption/ : concrete adoption YAML for several AWS services.
- https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources : acquire-by-name walkthrough with a deletion-policy example.
- https://fluxcd.io/flux/components/kustomize/kustomizations/ : how a GitOps controller schedules repeated, drift-correcting applies.

## Open questions

- Should the external name be an annotation or a documented spec field? Crossplane issue 1863 was closed by a stale bot with no decision, and SAP's ADR notes there is no unified guideline across providers.
- How should controllers recover from an ambiguous create at scale? Crossplane stops and asks a human, SAP uses bounded semantic lookup, and tag-based lookup does not work for resources without tags. The sources did not show a general solution.
- Is adopt-or-create safe as a default? ACK treats it as a supported policy, whereas SAP argues for explicit intent. The sources do not compare outcomes in production.
- I could not read kro's instance and reconciliation pages (empty scrape), so how kro handles repeated reconciliation and partial failure of a resource graph is not covered.
- I found no readable Cluster API source on idempotent infrastructure provisioning (the search returned irrelevant results), so Cluster API behavior is not covered.
- There were no postmortems or conference talks among the sources; the failure evidence comes from GitHub issues. A source with an incident write-up would strengthen the pitfalls section.
- Source 4 (server-side apply) was read only for field-management sections, and the AWS article's later sections were not read, so their finer points may be missing.
