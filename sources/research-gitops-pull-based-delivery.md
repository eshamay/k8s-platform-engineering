---
title: "Research dossier: GitOps Pull-Based Delivery"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [gitops, pull-based-delivery, research-dossier, flux, argo-cd, pitfalls]
---

# Research dossier: GitOps Pull-Based Delivery

> [!NOTE]
> **Raw file:** `raw/research-gitops-pull-based-delivery.md` (sha256 prefix 335ba8f50b2b)<br>
> **Kind:** Research dossier summarizing 15 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several quotes reached the dossier through a fetch tool that returns a summary, so wording should be re-verified against the live pages. The dossier itself flags the Flux components quote as partly paraphrased, and it read only the first 100,000 characters of the Kubernetes controller page.

## Summary

The dossier defines GitOps as operating a system from declarative desired state held in a versioned, immutable store (usually Git, increasingly an OCI registry) and applied by software agents instead of humans or pipelines. The OpenGitOps principles say the state is declarative, versioned and immutable, pulled automatically, and continuously reconciled, and the dossier treats the last two as what separates GitOps from CI/CD that merely reads YAML from Git.

Pull means the agent runs in or next to the target, fetches desired state, and applies it with in-cluster identity, whereas a push pipeline holds credentials to every target. The dossier's central teaching point is a two-layer loop: GitOps controllers reconcile Git into the Kubernetes API, and domain controllers (Crossplane, Config Connector, Cluster API, kro) reconcile the API into reality. Most pitfalls occur at the seams between the layers: health assessment of custom resources, pruning, drift against controllers that mutate fields, and credentials. The dossier found no named production adopters and no postmortems of GitOps-caused outages.

See [[concepts/gitops-pull-based-delivery]] for the synthesized concept.

## Key claims

### Principles and security

- The OpenGitOps working group, under the CNCF, defines four principles: declarative desired state, versioned and immutable storage with full history, automatic pulling by agents, and continuous reconciliation. A pipeline that pushes once and never reconciles fails the fourth principle. URL: https://opengitops.dev/. Quote: "Software agents automatically pull the desired state declarations from the source." See [[concepts/gitops-pull-based-delivery]].
- GitOps is a pattern, not a Kubernetes feature: Git is the interface for an agent managing any target, and the hard part is continuous reconciliation. A push CI server accumulates credentials for every environment, so one compromise is broad, while a pull operator runs inside the target. Operators in cloud environments need tightly scoped permissions. URL: https://www.innoq.com/en/articles/2025/01/gitops-kubernetes/. Quote: "The pull-based approach of GitOps ensures that the operator executes the deployment process exclusively within the target environment." See [[comparisons/push-versus-pull-delivery]] and [[examples/gitops-agent-on-non-kubernetes-targets]].
- A GitOps controller is the ordinary Kubernetes controller pattern pointed at a Git or OCI source, which means Flux, Argo CD, Crossplane, and kro are all instances of one pattern. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "Each controller tries to move the current cluster state closer to the desired state." See [[concepts/reconciliation-loop]].

### Flux

- Flux is built from GitOps Toolkit controllers: source controllers fetch from Git, OCI, Helm repositories, and buckets; the Kustomize and Helm controllers apply artifacts; the notification controller handles alerts and webhooks; image automation controllers update manifests when new images appear. Each controller watches its own custom resources. URL: https://fluxcd.io/flux/components/. The quote in the dossier is partly paraphrased and should be verified. See [[entities/flux]] and [[comparisons/flux-versus-argo-cd-architecture]].
- Flux Kustomizations reconcile by default every 5 minutes and revert manual changes unless suspended. Sources include GitRepository, OCIRepository, HelmRepository, and Bucket, and bootstrap commits Flux's own manifests so Flux manages itself. URL: https://fluxcd.io/flux/concepts/. Quote: "having an automated process that ensures that the deployed environment matches the state specified in one or more Git repositories."
- The Kustomize controller provides manifest generation, SOPS and KMS decryption, health assessment, service-account impersonation for multi-tenant RBAC isolation, `dependsOn` ordering, garbage collection (pruning), drift detection, and event reporting. URL: https://fluxcd.io/flux/components/kustomize/. Quote: "Reconciles the cluster state from multiple sources (provided by source-controller)". See [[findings/blast-radius-and-privilege-centralization]].
- The Flux D2 reference architecture splits a fleet across three repositories (fleet, infra, apps), builds and signs them in CI, and pushes them as OCI artifacts. The Flux Operator supplies FluxInstance and ResourceSet resources, and the design removes direct cluster-to-Git connections for regulated environments. This is a vendor write-up, not independent evidence. URL: https://control-plane.io/posts/d2-reference-architecture-guide/. Quote: "We've decoupled source control from deployment control, while improving auditability and reducing risk." See [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]] and [[decisions/git-versus-oci-as-the-canonical-source]].

### Argo CD

- Argo CD has three components: an API server (UI, CLI, CI, RBAC, credentials, webhooks), a repository server that caches Git and renders manifests, and an application controller that diffs live against target state, flags OutOfSync, optionally corrects, and runs PreSync, Sync, and PostSync hooks. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/. The dossier gives no quote. See [[comparisons/flux-versus-argo-cd-architecture]].
- Automated sync polls Git about every 120 seconds plus up to 60 seconds of jitter. Self-heal re-syncs on drift, prune is off by default, allow-empty guards against pruning an application to zero resources, and retries use exponential backoff. Syncs only occur when OutOfSync, rollback is blocked while automation is on, and a repeated sync of the same commit is not retried unless self-heal applies. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. Quote: "By default (and as a safety mechanism), automated sync will not delete resources when Argo CD detects the resource is no longer defined in Git." See [[findings/unintended-deletion-through-prune]] and [[findings/rollback-is-blocked-while-automated-sync-is-on]].
- Best practices recommend separate repositories for config and application source (cleaner audit trail, different access control, no CI loops), pinning Helm and Kustomize remote references to tags or SHAs, and leaving fields such as replica counts out of Git when another controller (the HPA) owns them. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/. Quote: "The developers who are developing the application, may not necessarily be the same people who can/should push to production environments". See [[findings/mutable-remote-references-change-what-a-commit-renders]] and [[findings/controllers-fighting-over-fields-cause-revert-loops]].

### Domain controllers beneath the GitOps agent

- Crossplane's guide for Argo CD requires annotation-based resource tracking, custom Lua health checks for crossplane.io and upbound.io resources (Ready, Synced, async operation status), exclusion of noisy ProviderConfigUsage objects, and a Kubernetes client QPS of 300 because of the many CRDs. URL: https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/. Quote: "End users of Crossplane don't need to interact with this resource". See [[examples/crossplane-resources-hosted-by-argo-cd]] and [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]].
- kro lets a platform team define a ResourceGraphDefinition that becomes a new CRD, and users create one instance that kro expands into underlying resources. It composes with ACK, Config Connector, and Azure Service Operator. URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator. Quote: "kro introduces a Kubernetes-native, cloud-agnostic way to define groupings of Kubernetes resources." See [[entities/kro]].
- The kro project site describes SimpleSchema for the user-facing API, generated CRDs, an in-cluster dynamic controller with continuous reconciliation and drift detection, and CEL expressions validated at creation time, so the abstraction layer brings its own reconcile loop alongside the GitOps agent's. URL: https://kro.run/. Quote: "Build declarative, secure, and verifiable Kubernetes abstractions." See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]].
- Cluster API runs on a management cluster whose providers reconcile Cluster, Machine, MachineDeployment, and KubeadmControlPlane resources into workload clusters, replacing machines rather than patching them. That makes fleets natural GitOps targets with the hub pulling cluster definitions from Git. URL: https://cluster-api.sigs.k8s.io/user/concepts. Quote: "Similar to how you can use StatefulSets or Deployments in Kubernetes to manage a group of Pods". See [[entities/cluster-api]] and [[examples/cluster-fleet-lifecycle-with-cluster-api]].
- Config Connector installs CRDs and controllers that reconcile Kubernetes objects into Google Cloud resources asynchronously, using the controller's own IAM service account instead of individual developer identities. That centralizes cloud authorization behind Kubernetes RBAC, the same credential concentration that GitOps agents raise. URL: https://docs.cloud.google.com/config-connector/docs/overview. Quote: "reducing the complexity and cognitive load for developers." See [[entities/config-connector]].

### Pitfalls the dossier names

- Accidental deletion, drift against legitimate controllers, custom-resource health, rollback friction, mutable references, credential concentration, two reconcile loops, and secrets (Flux decrypts SOPS and KMS secrets in the controller; Argo CD's secret page was not read). See [[findings/unintended-deletion-through-prune]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]], [[findings/rollback-is-blocked-while-automated-sync-is-on]], [[findings/mutable-remote-references-change-what-a-commit-renders]], [[findings/blast-radius-and-privilege-centralization]], and [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]].

## Limits of the dossier

The dossier found no named end-user production case studies or scale figures, so the use-case pages built from it describe documented designs and not adopters. The AWS multi-cluster GitOps article returned only site navigation, so hub-and-spoke pull versus push in Argo CD is uncovered. ACK specifics, Config Connector deletion and abandon behavior, Argo CD secret handling, and ApplicationSets were not covered. Interval figures (Flux 5 minutes, Argo CD about 3 minutes) differ by tool and version.
