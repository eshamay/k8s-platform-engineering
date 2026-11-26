# Research dossier: GitOps Pull-Based Delivery

Research date: 2026-11-25

## Overview

GitOps is a way of operating systems in which the whole desired state is written down declaratively, stored in a versioned and immutable store (usually Git, increasingly OCI registries), and applied by software agents rather than by humans or pipelines running commands. The OpenGitOps working group, under the CNCF, reduces this to four principles: declarative, versioned and immutable, pulled automatically, and continuously reconciled. The sources agree that the last two are what separate GitOps from "CI/CD that happens to read YAML from Git."

"Pull" means the agent lives in or next to the target environment, fetches the desired state from the source, and applies it. A push pipeline instead holds credentials to the target and executes `kubectl apply` or `helm upgrade` from outside. The INNOQ article frames this as a security distinction: a central build server that pushes needs credentials for every environment, while a pull agent only needs read access to the source and uses in-cluster identity to write. The Flux D2 architecture goes a step further and replaces Git as the thing the cluster talks to with signed OCI artifacts ("gitless GitOps"), so the cluster never needs a connection to the Git host.

Mechanically, pull-based GitOps on Kubernetes is the ordinary controller pattern pointed at a Git or OCI source. The Kubernetes documentation describes a controller as a non-terminating control loop that moves current state toward desired state. Flux splits this into composable controllers (source, kustomize, helm, notification, image automation), while Argo CD splits it into an API server, a repo server that renders manifests, and an application controller that diffs live against target state. Both poll on an interval (Flux Kustomizations default to every 5 minutes in the concepts page; Argo CD polls roughly every 3 minutes at most) and can be nudged by webhooks.

The same pattern extends beyond workloads. Crossplane, Config Connector, Cluster API, and kro all expose cloud or cluster resources as Kubernetes custom resources reconciled by their own controllers. A GitOps agent then only has to keep those custom resources in sync from Git, and a second layer of controllers reconciles the real world. That two-layer loop is the main thing newcomers need to understand: GitOps controllers reconcile Git into the Kubernetes API, and domain controllers reconcile the Kubernetes API into reality. Pitfalls mostly occur at the seams, such as health assessment of custom resources, pruning, drift against controllers that mutate fields, and credentials.

## Sources

### 1. OpenGitOps principles
- URL: https://opengitops.dev/
- Title: OpenGitOps is a set of open-source standards and best practices (principles v1.0.0)
- Publisher: GitOps Working Group, CNCF
- Kind: Standard / principles
- Summary: Defines the four principles that make a system "GitOps": desired state is declarative; it is stored versioned and immutable with full history; agents pull it automatically; and agents continuously observe actual state and try to apply the desired state. The principles are tool-neutral and maintained in the open-gitops/documents repository. Useful as the vocabulary baseline for any tutorial, and for judging whether a given tool or workflow actually qualifies (for example, a pipeline that pushes once and never reconciles fails principle four).
- Quote: "Software agents automatically pull the desired state declarations from the source."

### 2. Flux GitOps Toolkit components
- URL: https://fluxcd.io/flux/components/
- Title: GitOps Toolkit components | Flux
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary: Lists the Flux controllers: source controllers fetch from Git, OCI, Helm repositories and buckets and expose artifacts; the Kustomize controller and Helm controller apply them; the notification controller handles alerts and webhooks; image automation controllers update manifests when new images appear. Each controller watches its own custom resources, so Flux is a set of small reconcilers composed through the Kubernetes API. Good for explaining that Flux is "controllers all the way down."
- Quote: "Flux is constructed with the GitOps Toolkit components, which is a set of specialized tools and Flux Controllers." (paraphrased in part from the page text as returned; verify wording before reuse)

### 3. Flux core concepts
- URL: https://fluxcd.io/flux/concepts/
- Title: Core Concepts | Flux
- Publisher: Flux project
- Kind: Official documentation
- Summary: Defines GitOps, sources (GitRepository, OCIRepository, HelmRepository, Bucket), reconciliation, Kustomization (reconciled by default every 5 minutes, reverting manual changes unless suspended), HelmRelease, and bootstrap. Bootstrap installs Flux and then commits its own manifests so Flux manages itself like any other resource. Notes that Flux supports pull-based operation and also push-style triggers, and highlights OCI as a source of truth ("gitless GitOps").
- Quote: "having an automated process that ensures that the deployed environment matches the state specified in one or more Git repositories."

### 4. Flux Kustomize controller
- URL: https://fluxcd.io/flux/components/kustomize/
- Title: The GitOps Toolkit Kustomize Controller
- Publisher: Flux project
- Kind: Official documentation
- Summary: Describes the controller that applies manifests from source-controller artifacts. Features include manifest generation via Kustomize, SOPS and KMS decryption, health assessment of deployed workloads, service-account impersonation for multi-tenant RBAC isolation, ordering through dependsOn, garbage collection (pruning) of objects removed from the source, drift detection, and event reporting through the notification controller. This is the best single page for seeing how pruning, ordering, and tenancy are handled in a pull agent.
- Quote: "Reconciles the cluster state from multiple sources (provided by source-controller)"

### 5. Argo CD architectural overview
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/
- Title: Architectural Overview - Argo CD
- Publisher: Argo project (CNCF)
- Kind: Official architecture documentation
- Summary: Three components. The API server serves UI, CLI, and CI systems, handles RBAC, credentials, and webhooks. The repository server caches Git and renders manifests from repo URL, revision, path, and tool settings. The application controller is a Kubernetes controller that compares live state to target state, flags OutOfSync, optionally corrects it, and runs PreSync, Sync, and PostSync hooks. Useful contrast with Flux: Argo is more centralized and UI-driven, with rendering separated into its own service.
- Quote: none (paraphrase only).

### 6. Argo CD automated sync policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy - Argo CD
- Publisher: Argo project
- Kind: Official documentation
- Summary: Automated sync polls Git about every 120 seconds plus up to 60 seconds of jitter. Self-heal re-syncs when live state drifts from Git. Prune is off by default because deleting resources is dangerous. allow-empty is a separate guard against pruning an application down to zero resources. Retries use exponential backoff. Caveats: syncs only happen when OutOfSync, rollbacks are blocked while automation is on, and a repeated sync of the same commit is not retried unless self-heal applies. Directly relevant to pitfalls around deletion and drift.
- Quote: "By default (and as a safety mechanism), automated sync will not delete resources when Argo CD detects the resource is no longer defined in Git."

### 7. Argo CD best practices
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/
- Title: Best Practices - Argo CD
- Publisher: Argo project
- Kind: Official documentation
- Summary: Recommends separate repositories for config and application source (cleaner audit trail, different access controls, avoids CI loops), pinning Helm and Kustomize remote references to tags or SHAs instead of HEAD, and leaving fields like replica counts out of Git when another controller such as the HPA owns them. Good for explaining why "Git is the only writer" needs exceptions.
- Quote: "The developers who are developing the application, may not necessarily be the same people who can/should push to production environments"

### 8. INNOQ: GitOps without Kubernetes
- URL: https://www.innoq.com/en/articles/2025/01/gitops-kubernetes/
- Title: Implementing GitOps without Kubernetes
- Publisher: INNOQ (consultancy)
- Kind: Engineering article
- Summary: Argues GitOps is a pattern, Git as the interface for an agent managing any target, and does not require Kubernetes. Makes the security case for pull over push: push CI servers accumulate credentials for all targets, so one compromise is broad, whereas a pull operator runs inside the target environment. Warns that the hard part is continuous reconciliation and that operators in cloud environments must be given tightly scoped permissions.
- Quote: "The pull-based approach of GitOps ensures that the operator executes the deployment process exclusively within the target environment."

### 9. Flux D2 reference architecture (ControlPlane)
- URL: https://control-plane.io/posts/d2-reference-architecture-guide/
- Title: Flux D2 Reference Architecture, Gitless GitOps for Secure Delivery
- Publisher: ControlPlane
- Kind: Vendor engineering write-up / reference architecture
- Summary: Describes a fleet layout split across three repositories (fleet, infra, apps), all built and signed in CI and pushed as OCI artifacts. The Flux Operator provides FluxInstance and ResourceSet resources for installation and tenant templating. Targets regulated environments by removing direct cluster-to-Git connections and adding keyless signing, registry RBAC, and admission policy. Shows where the pull model is heading for supply-chain-sensitive organizations.
- Quote: "We've decoupled source control from deployment control, while improving auditability and reducing risk."

### 10. Crossplane with Argo CD
- URL: https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/
- Title: Configuring Crossplane with Argo CD (Crossplane v2.4)
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: Lists required Argo CD configuration to host Crossplane resources: annotation-based resource tracking, custom Lua health checks for crossplane.io and upbound.io resources (Ready, Synced, async operation status), excluding noisy ProviderConfigUsage objects, and raising the Kubernetes client QPS to 300 because of the many CRDs. The key lesson is that a generic GitOps agent does not understand custom-resource health or ownership unless told.
- Quote: "End users of Crossplane don't need to interact with this resource"

### 11. Introducing kro (Google Cloud blog)
- URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator
- Title: Introducing Kube Resource Orchestrator, or kro
- Publisher: Google Cloud (jointly with AWS and Microsoft maintainers)
- Kind: Announcement blog
- Summary: kro lets platform teams define a ResourceGraphDefinition that becomes a new CRD; users create one instance and kro expands it into the underlying resources. It composes with cloud-resource controllers such as ACK, Config Connector (KCC), and Azure Service Operator, so teams avoid writing custom controllers. Useful for the "platform abstraction" layer that GitOps then delivers.
- Quote: "kro introduces a Kubernetes-native, cloud-agnostic way to define groupings of Kubernetes resources."

### 12. kro project site
- URL: https://kro.run/
- Title: Kube Resource Orchestrator | kro
- Publisher: kro project (kubernetes-sigs)
- Kind: Official project page
- Summary: Describes the ResourceGraphDefinition, SimpleSchema for the user-facing API, generated CRDs, an in-cluster dynamic controller with continuous reconciliation and drift detection, and CEL for expressions with validation at creation time. Shows that abstraction frameworks bring their own reconcile loop that coexists with the GitOps agent's loop.
- Quote: "Build declarative, secure, and verifiable Kubernetes abstractions."

### 13. Kubernetes controller pattern
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers | Kubernetes
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains the control loop: controllers watch objects, compare spec (desired) to observed state, and act mostly through the API server. Foundation for understanding that Flux, Argo CD, Crossplane, and kro are all instances of the same pattern. Only the first 100,000 characters of the page were read; the remainder was a small tail.
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 14. Cluster API concepts
- URL: https://cluster-api.sigs.k8s.io/user/concepts
- Title: Cluster API Concepts
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Official documentation
- Summary: A management cluster runs Cluster API and providers that reconcile Cluster, Machine, MachineDeployment, and KubeadmControlPlane resources into workload clusters; machines are replaced rather than patched in place. The declarative model makes cluster fleets natural GitOps targets, with the hub cluster pulling cluster definitions from Git.
- Quote: "Similar to how you can use StatefulSets or Deployments in Kubernetes to manage a group of Pods"

### 15. Config Connector overview
- URL: https://docs.cloud.google.com/config-connector/docs/overview
- Title: Config Connector overview
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Config Connector installs CRDs and controllers that reconcile Kubernetes objects into Google Cloud resources asynchronously, using the controller's own IAM service account instead of individual developers' identities. This centralizes cloud authorization behind Kubernetes RBAC, which is the same credential-concentration trade-off GitOps agents raise. I did not read details on deletion policy in this fetch.
- Quote: "reducing the complexity and cognitive load for developers."

## Real-world use cases

Cluster and platform fleets. ControlPlane's Flux D2 reference (https://control-plane.io/posts/d2-reference-architecture-guide/) targets regulated, multi-tenant fleets, with separate fleet, infrastructure, and application artifacts and a FluxInstance per cluster. Cluster API (https://cluster-api.sigs.k8s.io/user/concepts) fits the hub-and-spoke case: a management cluster holds Cluster resources in Git-managed form and produces workload clusters, which then pull their own add-ons.

Cloud infrastructure as Kubernetes objects. Crossplane (https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/) and Config Connector (https://docs.cloud.google.com/config-connector/docs/overview) let a team keep databases, buckets, and IAM in Git next to applications. The GitOps agent applies the custom resources, and the provider controllers call cloud APIs.

Platform abstractions. kro (https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator) is positioned as a way for a platform team to publish a single "application plus dependencies" API that developers commit to Git as one small manifest.

Non-Kubernetes targets. INNOQ (https://www.innoq.com/en/articles/2025/01/gitops-kubernetes/) describes applying the same agent-plus-Git model to VMs or cloud infrastructure with custom operators.

No named end-user production case studies (company names, scale figures) were found in the pages I read; the AWS multi-cluster GitOps article could not be read.

## Pitfalls and how tools address them

Accidental deletion. Argo CD disables prune by default and adds allow-empty as a second guard (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). The Flux Kustomize controller prunes by garbage collection when enabled in the Kustomization (https://fluxcd.io/flux/components/kustomize/). Neither source covers per-resource deletion policies for cloud resources.

Drift versus legitimate controllers. Something else may legitimately write to a field, such as the HPA on replica count. Argo CD's best-practices page recommends leaving such fields out of Git (https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/). Self-heal in Argo CD and Flux's default periodic reconciliation will revert manual changes otherwise.

Health and tracking of custom resources. Generic agents do not know when a Crossplane resource is ready. Crossplane's guide prescribes Lua health checks, annotation tracking, exclusions, and higher client QPS (https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/). Flux's Kustomize controller does health assessment of listed resources and supports dependsOn ordering (https://fluxcd.io/flux/components/kustomize/).

Rollback friction. Argo CD blocks rollbacks while automated sync is enabled, so the fix path is a Git revert (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/).

Mutable references. Pinning Helm and Kustomize remotes to tags or SHAs prevents the same commit from rendering differently over time (https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/).

Credential concentration. Push pipelines hold cluster credentials (https://www.innoq.com/en/articles/2025/01/gitops-kubernetes/). Pull agents shift this, but the agent itself becomes powerful: Flux counters with service-account impersonation per tenant (https://fluxcd.io/flux/components/kustomize/), and Config Connector centralizes cloud access on one controller identity (https://docs.cloud.google.com/config-connector/docs/overview). The D2 design removes the cluster-to-Git connection with signed OCI artifacts (https://control-plane.io/posts/d2-reference-architecture-guide/).

Two reconcile loops. With kro or Crossplane, GitOps and the abstraction controller both reconcile; status and drift can be reported at two layers (https://kro.run/).

Secrets. Flux decrypts SOPS and KMS secrets in the controller (https://fluxcd.io/flux/components/kustomize/). I did not read Argo CD's secret-management page.

## Tutorial and explainer links

- https://opengitops.dev/ : shortest authoritative statement of the four principles.
- https://fluxcd.io/flux/concepts/ : clearest vocabulary for sources, Kustomizations, and bootstrap.
- https://fluxcd.io/flux/components/ : map of Flux controllers.
- https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/ : one-page Argo CD component model.
- https://kubernetes.io/docs/concepts/architecture/controller/ : the control-loop prerequisite for everything else.
- https://www.innoq.com/en/articles/2025/01/gitops-kubernetes/ : readable argument for pull over push.
- https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/ : concrete example of the GitOps and domain-controller seam.

## Open questions

- Interval figures differ by tool and version (Flux 5 minutes in the concepts page, Argo CD about 3 minutes); neither default is guaranteed, so check current versions before a tutorial states them.
- The Flux components page quote was returned through a summarizer, so wording should be verified against the page. Several quotes came via WebFetch summaries, not raw text, for the same reason.
- Named production adopters, scale numbers, and postmortems of GitOps-caused outages were not found; searches returned mostly low-quality aggregator pages.
- The AWS multi-cluster GitOps article (https://aws.amazon.com/blogs/containers/part-2-multi-cluster-gitops-cluster-fleet-provisioning-and-bootstrapping/) returned only site navigation, so hub-and-spoke pull versus push in Argo CD is not covered.
- Not covered: ACK specifics, Config Connector deletion and abandon behavior, Argo CD secret handling, and Argo CD core concepts such as ApplicationSets.
- Whether Git or OCI should be the canonical source (Flux's gitless approach versus Argo CD's Git-centric docs) is framed differently by the sources and is unresolved.
