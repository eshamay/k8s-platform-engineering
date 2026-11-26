---
title: "Research dossier: Idempotency"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [idempotency, controllers, external-resources, crossplane, ack, config-connector, research-dossier]
---

# Research dossier: Idempotency

> [!NOTE]
> **Raw file:** `raw/research-idempotency.md` (sha256 prefix 4704ffd77903)<br>
> **Kind:** Research dossier summarizing 15 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The dossier read the server-side apply page only for its field-management sections and the AWS Builders' Library article without its later sections. The kro documentation sub-pages returned empty content, no readable Cluster API source was found, and there is no postmortem or conference talk among the sources, so the failure evidence comes from GitHub issues.

## Summary

The dossier explains idempotency at three layers. At the controller loop, a reconciler reads desired state, observes actual state, and closes the gap, so a second run after a retry or restart finds nothing to do. At the Kubernetes API, deterministic names turn a duplicate create into an explicit error, and server-side apply makes repeated writes safe while recording field ownership. At the cloud-API layer, creation is not naturally idempotent: a controller that crashes after a create call but before it records the returned identifier cannot tell on the next pass whether the resource exists.

The dossier then compares the answers that tools give to that third layer. Crossplane keeps a stable external name in an annotation and writes an `external-create-pending` marker before a create, and it stops and asks a human when the outcome is unknown. SAP's Crossplane provider adds a bounded recovery that matches by a business key inside a creation-time window. ACK and Config Connector adopt or acquire an existing resource by name or identifier, so a retried create converges on it. The AWS Builders' Library describes the server-side half, a caller-supplied client token that lets the API recognize a retry. The dossier's unresolved questions concern where the external name should live, how to recover from ambiguous creates at scale, and whether adopt-or-create is a safe default.

## Key claims

Each URL below is a page the dossier read. None is rich enough here to justify a separate source page, so all are cited through this page.

### Controller loop and API machinery

- The Kubernetes Controllers page (https://kubernetes.io/docs/concepts/architecture/controller/) uses a thermostat to explain desired versus current state, says controllers act through the API server or on external systems, and states that "controllers can fail, so Kubernetes is designed to allow for that." It also says the cluster may never reach a stable state, which is acceptable while controllers keep making useful changes.
- The Kubebuilder good-practices page (https://book.kubebuilder.io/reference/good-practices) says "the controller's reconciliation loop needs to be idempotent," and says logic keyed to specific events goes against the operator pattern and can leave resources stuck. It also recommends one controller per Kind and status conditions. See [[findings/event-specific-logic-in-reconcilers]].
- The controller-runtime FAQ (https://raw.githubusercontent.com/kubernetes-sigs/controller-runtime/main/FAQ.md) says "Reconcile functions should be idempotent, and should always reconcile state by reading all the state it needs, then writing updates." It recommends deterministic names so the API server rejects a duplicate create, notes that StatefulSet appends an ordinal and Deployment hashes the pod template, and says that when names must be generated the controller should track its actions and requeue, as the ReplicaSet controller does. It recommends envtest assertions on resulting state and not on which API calls were made. The dossier read the raw GitHub copy because the rendered page was empty. See [[examples/built-in-controllers-use-deterministic-names-to-avoid-duplicate-children]].
- The Server-Side Apply page (https://kubernetes.io/docs/reference/using-api/server-side-apply/) says the API server tracks field ownership in `managedFields`, that reapplying the same configuration is safe, that a conflicting value owned by another manager returns a conflict unless forced, and that forcing transfers ownership. Appliers that set the same value share ownership.

### GitOps tools as repeated apply

- The Flux Kustomization reference (https://fluxcd.io/flux/components/kustomize/kustomizations/) says the Kustomization runs a server-side apply dry-run on each interval to detect and correct drift, handles a new revision or generation immediately, garbage-collects with `.spec.prune`, protects objects with a `prune: disabled` annotation, retries failures on `.spec.retryInterval`, and can add jitter. The quoted example reads "every ten minutes, the Kustomization runs a server-side apply dry-run to detect and correct drift inside the cluster," which is an example interval and not a stated default. See [[entities/flux]].
- The Argo CD automated sync page (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) says self-heal is off by default, that pruning is blocked from leaving an application empty unless `allowEmpty` is set, and that "Argo CD can automatically retry a failed sync operation using exponential backoff" with `limit`, `duration`, `factor`, and `maxDuration`. In multi-source applications, disabling self-heal does not guarantee live changes persist. See [[entities/argo-cd]].

### Crossplane, external names, and ambiguous creates

- The Crossplane managed resources page (https://docs.crossplane.io/master/managed-resources/managed-resources/) says "Crossplane considers the `forProvider` field of a managed resource the \"source of truth\" for external resources." It shows the external name (a VPC named `my-test-vpc` has external name `vpc-01353cfe93950a8ff`), three ways to reference other resources (external name, `nameRef`, selector), late initialization, `initProvider` for settings applied only at creation, `managementPolicies` over Observe, Create, Update, Delete, and LateInitialize (an empty list pauses), and the `crossplane.io/paused` annotation. It says Crossplane deletes an external resource only when its managed resource is deleted. See [[examples/crossplane-initprovider-lets-an-autoscaler-own-node-group-size]].
- Crossplane issue 1863 (https://github.com/crossplane/crossplane/issues/1863) explains that `crossplane.io/external-name` carries a name from claims to managed resources, defaults to `metadata.name`, and can hold a cloud-assigned identifier. AWS API Gateway APIs have both a name and an ID (and `GetApi` needs the ID), IAM policies use the full ARN, and security groups choose the ID. One side proposed documented `spec.forProvider` fields, the other a single consistent place. A stale bot closed it in 2022 without a decision. See [[findings/external-identity-takes-different-forms-across-cloud-apis]] and [[decisions/external-name-annotation-or-spec-field]].
- Crossplane issue 3037 (https://github.com/crossplane/crossplane/issues/3037) says a provider writes `external-create-pending` before a cloud create call and `external-create-succeeded` or `external-create-failed` afterward, all within one reconcile. If the provider restarts in between, the managed resource is blocked with "cannot determine creation result - remove the crossplane.io/external-create-pending annotation if it is safe to proceed." A maintainer explains that Crossplane once looked the resource up by identifier on the next reconcile, but many cloud APIs return a generated ID, so a lost response could leak the first resource on a second create. Tag or label lookup needs per-resource code and fails where tagging is unsupported. Reporters hit it after provider restarts during failing creates, with an SQS queue on provider-aws and IAM errors. It was closed as not planned. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]] and [[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]].
- The SAP Crossplane provider ADR (https://sap.github.io/crossplane-provider-docs/docs/crossplane-provider-btp/docs/contribution-notes/external-name-handling/) says an explicitly set external name signals that the resource should already exist, so SAP removes the default initializer to prevent accidental adoption. Compound keys use `/` with a 512 character limit. Recovery applies only when `external-create-pending` is present: search by a semantic key such as subdomain or name plus parent ID, require the resource's `created_at` to fall inside a bounded window around the pending timestamp, patch the external name, and requeue. Matches outside the window emit a refused-brownfield warning. The ADR states "This is **not** an import mechanism: brownfield resources are refused." See [[entities/crossplane-provider-btp]] and [[examples/sap-btp-provider-recovers-lost-ids-by-business-key-and-creation-window]].

### ACK and Config Connector adoption

- The ACK adoption guide (https://aws-controllers-k8s.github.io/docs/guides/adoption/) describes two policies set through the `services.k8s.aws/adoption-policy` annotation. `adopt-or-create` "adopts the resource if it exists in AWS, or creates it if it doesn't," and the manifest becomes the source of truth. `adopt` imports strictly, without changing the resource, and fills the spec from AWS. The `adoption-fields` annotation says how to find the resource (VPC ID, queue URL, SNS ARN, bucket name, table name). Deleting the Kubernetes object deletes the AWS resource unless `deletionPolicy: Retain`. The page labels adoption Beta. See [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]] and [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].
- The ACK announcement (https://aws.amazon.com/blogs/containers/aws-controllers-for-kubernetes-ack/, 2020) says resources are managed directly through AWS APIs rather than CloudFormation so that "Kubernetes [is] the single 'source of truth' for a resources desired state." The launch list included S3, SQS, SNS, DynamoDB, ECR, and API Gateway V2, and the team asked the community whether ACK should adopt existing resources, which led to the adoption feature. It says little about idempotency mechanics directly.
- The Config Connector page on managing and deleting resources (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources) says "If a resource with the same name already exists, Config Connector acquires that resource and starts managing it." Resources with service-generated IDs can be acquired only through the `resourceID` field. Deleting the Kubernetes object deletes the cloud resource unless `cnrm.cloud.google.com/deletion-policy: abandon` is set. See [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]].

### Server-side contract and kro

- The AWS Builders' Library article (https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/, Malcolm Featonby) says "An idempotent operation is one where a request can be retransmitted or retried with no additional side effects." It rejects hash-based duplicate detection because two identical requests may be intentional, prefers a unique caller-supplied client request identifier such as EC2's `ClientToken` stored with the mutation in one atomic operation, and argues for returning a semantically equivalent response on retry instead of "already exists." Created resources can be labeled with the token for tracing. See [[examples/ec2-client-token-makes-a-retried-runinstances-call-safe]] and [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]].
- The kro home page (https://kro.run/) supports only the claim "Continuous reconciliation with automatic drift detection." Its instances and reconciliation sub-pages returned empty content, so kro's handling of repeated reconciliation and partial failure of a resource graph is not covered. See [[entities/kro]].

## Open questions in the dossier

- Whether the external name should be an annotation or a documented spec field. See [[decisions/external-name-annotation-or-spec-field]].
- How controllers should recover from an ambiguous create at scale. See [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]].
- Whether adopt-or-create is safe as a default. See [[decisions/adopt-or-create-or-require-explicit-import]].
- How kro and Cluster API handle idempotent provisioning, which no readable source covered.
- Whether any postmortem or talk documents a leaked resource from an ambiguous create.

## Pages this source informed

[[concepts/idempotency]], [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]], [[entities/crossplane]], [[entities/ack]], [[entities/config-connector]], [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]]
