# Research dossier: Flux deep dive

Research date: 2026-11-25

Method note: the web_scrape tool returned oversized pages (Flux docs) that were saved to disk rather than displayed, so most Flux documentation pages were read through WebFetch, which returns a model-generated digest of the page. Only the Morgan Stanley blog post was read in full text. Treat summaries of the other pages as digests, and re-verify exact field names against the linked docs before publishing tutorials. Quotes below were taken from those digests or page text and should be checked before reuse.

## Overview

Flux is a CNCF graduated GitOps tool. It is not one monolithic server. It is a set of small Kubernetes controllers, called the GitOps Toolkit, each owning one job and talking to the others only through custom resources in the Kubernetes API. The Flux docs describe the toolkit as specialized controllers, composable APIs and reusable Go packages. For readers who do not yet know controllers: each controller watches objects of its own kinds, compares desired and actual state, and writes results into the object's status, which other controllers read.

The division of labor is as follows. source-controller fetches things (Git repositories, OCI artifacts, Helm repositories and charts, S3-compatible buckets), packages them as tar.gz artifacts and serves them inside the cluster. kustomize-controller takes an artifact, runs Kustomize on it and applies the result (the `Kustomization` kind). helm-controller renders and installs Helm charts (the `HelmRelease` kind), with retries and rollback. notification-controller sends outbound alerts (`Provider`, `Alert`) and accepts inbound webhooks (`Receiver`) so Git pushes trigger immediate reconciliation. The image automation controllers (`ImageRepository`, `ImagePolicy`, `ImageUpdateAutomation`) scan registries and write new tags back to Git. Because the source layer is separate from the delivery layer, a team can swap Git for S3 or OCI without changing how workloads are applied.

Operational concerns appear in a consistent set of knobs. Ordering is done with `dependsOn`. Readiness is gated by `healthChecks`/`wait`, optionally with CEL expressions. Garbage collection is `prune`. Failure handling is `retryInterval`, `timeout`, and Helm remediation. Isolation is done by impersonating a Kubernetes ServiceAccount per tenant plus lockdown flags on the controllers. Scale is handled by tuning intervals and concurrency, and by label-based sharding across multiple controller instances.

The sources frame Flux as lean, composable and Kubernetes-native, in contrast with Argo CD, which comparison articles describe as more centralized and UI-driven. The Morgan Stanley case (500+ clusters) is the clearest evidence for large-scale use. Gaps in this dossier are listed under Open questions.

## Sources

### 1. GitOps Toolkit components
- URL: https://fluxcd.io/flux/components/
- Title: GitOps Toolkit components | Flux
- Publisher: Flux project (fluxcd.io)
- Kind: official documentation
- Summary: Overview page naming the five groups of controllers (source, kustomize, helm, notification, image automation) and their CRDs. It stresses that the pieces interact through Kubernetes custom resources and shared Go packages, so users can extend Flux or build their own delivery systems. Useful as the map for any architecture tutorial.
- Quote: "a set of specialized tools and Flux Controllers; composable APIs; reusable Go packages for GitOps"

### 2. Source Controllers
- URL: https://fluxcd.io/flux/components/source/
- Title: Source Controllers | Flux
- Publisher: Flux project
- Kind: official documentation
- Summary: Describes source-controller as the artifact acquisition layer. It handles GitRepository, OCIRepository, HelmRepository, HelmChart and Bucket kinds, fetches on demand or on a schedule, packages content into a well-known format and makes it available in-cluster to consumers. It also supports authentication and source verification. Explains why downstream controllers never talk to Git directly.
- Quote: "Fetch resources on-demand and on-a-schedule. Package the fetched resources into a well-known format (tar.gz, yaml)."

### 3. Kustomization API (kustomize-controller)
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux project
- Kind: official API reference
- Summary: Reference for the main apply object. Covers `dependsOn` (with optional CEL readiness expressions), `healthChecks` and `wait`, `prune` garbage collection, `force` recreate for immutable field changes, `retryInterval`, `postBuild.substitute` variable substitution, SOPS decryption (age, OpenPGP, cloud KMS), `serviceAccountName` for impersonation, and drift correction via server-side apply. The last ~20% of this page was not read.
- Quote: "Garbage collection means that the Kubernetes objects that were previously applied on the cluster but are missing from the current source revision, are removed"

### 4. HelmRelease API (helm-controller)
- URL: https://fluxcd.io/flux/components/helm/helmreleases/
- Title: HelmRelease | Flux
- Publisher: Flux project
- Kind: official API reference
- Summary: Covers `dependsOn`, install and upgrade remediation (retry, rollback or uninstall), optional Helm tests, drift detection via server-side dry-run with ignore rules, `valuesFrom` ConfigMaps and Secrets, `chartRef` pointing to an OCIRepository or HelmChart, CEL health checks, and CRD policy (Skip, Create, CreateReplace). Warns about circular dependencies. The last ~23% was not read.
- Quote: "Circular dependencies between HelmRelease resources must be avoided, otherwise the interdependent HelmRelease resources will never be reconciled."

### 5. Flux for Helm Users
- URL: https://fluxcd.io/flux/use-cases/helm/
- Title: Flux for Helm Users
- Publisher: Flux project
- Kind: official explainer
- Summary: Explains how Flux turns Helm from an imperative CLI into declarative, continuously reconciled custom resources, with automatic retries and remediation, drift correction, and no Tiller-style in-cluster server because the controller uses the Helm SDK. Good bridge for engineers who already use Helm.
- Quote: "While the Helm client commands let you imperatively do things, Flux Helm Custom Resources let you declare what you want the Helm SDK to do automatically"

### 6. Flux multi-tenancy
- URL: https://fluxcd.io/flux/installation/configuration/multitenancy/
- Title: Flux multi-tenancy | Flux
- Publisher: Flux project
- Kind: official documentation
- Summary: Explains the lockdown model. Platform admins set controller flags `--no-cross-namespace-refs=true`, `--no-remote-bases=true` and `--default-service-account=default`. Reconciliation then runs as a tenant ServiceAccount (`spec.serviceAccountName`) so Kubernetes RBAC limits what a tenant's repo can create. Tenants are onboarded by registering their repositories with namespace-scoped RBAC. Pitfall: without RBAC on the default account, deployments fail.
- Quote: "All `Kustomizations` and `HelmReleases` which don't have `spec.serviceAccountName` specified, will use the `default` account from the tenant's namespace."

### 7. flux2-multi-tenancy reference repository
- URL: https://github.com/fluxcd/flux2-multi-tenancy
- Title: fluxcd/flux2-multi-tenancy: Manage multi-tenant clusters with Flux
- Publisher: Flux project (GitHub)
- Kind: reference repository / design example
- Summary: A fleet repository with `clusters/`, `policies/` and `tenants/` directories. Tenant repos use `base/` plus `staging/` and `production/` overlays. Cluster admins own cluster-wide resources and tenant provisioning, while tenants only deploy through Git using namespace-scoped ServiceAccounts. Notes that image automation is limited to staging in the example.
- Quote: "Sharing namespaces between tenants is not supported, as it would break the isolation guarantees."

### 8. Flux sharding and horizontal scaling
- URL: https://fluxcd.io/flux/installation/configuration/sharding/
- Title: Flux sharding and horizontal scaling
- Publisher: Flux project
- Kind: official documentation
- Summary: Sharding runs several copies of a controller with unique names (for example `source-controller-shard1`) and each watches objects carrying a label `sharding.fluxcd.io/key`, via `--watch-label-selector`. The default controllers exclude labeled objects. Dependent objects (for example HelmRepository, HelmChart, HelmRelease) must carry matching labels. Parent Kustomizations can bulk-label children with `commonMetadata` and patches. Extra replicas are only failover standbys because of leader election.
- Quote: "Extra replicas of a Flux controller are failover standbys. Only the elected leader reconciles."

### 9. Flux Operator sharding
- URL: https://fluxoperator.dev/docs/instance/sharding/
- Title: Controllers sharding - Flux Operator Docs
- Publisher: ControlPlane (Flux Operator project)
- Kind: product documentation
- Summary: Shows that the Flux Operator automates sharding: you declare shards in the `FluxInstance` spec and it creates the extra controller sets and label selectors. Useful for contrasting manual versus operator-managed installs.
- Quote: "The Flux Operator supports sharding the workload across multiple instances of Flux controllers allowing you to horizontally scale the reconciliation of resources."

### 10. Automate image updates to Git
- URL: https://fluxcd.io/flux/guides/image-update/
- Title: Automate image updates to Git | Flux
- Publisher: Flux project
- Kind: official guide
- Summary: ImageRepository scans a registry for tags, ImagePolicy picks a tag (semver, calver or regex rules), and ImageUpdateAutomation edits YAML at marker comments of the form `$imagepolicy`, commits and pushes to Git. The normal Flux reconcile then deploys the change, so Git history stays the audit record. Care is needed with policy choice to avoid unintended rollouts.
- Quote: "automatically deploy application patches (CVEs and bug fixes), and keep a record of all deployments in Git history"

### 11. Notification controller
- URL: https://fluxcd.io/flux/components/notification/
- Title: Notification Controller | Flux
- Publisher: Flux project
- Kind: official documentation
- Summary: Providers push events to chat and other systems, Alerts choose which events by severity and object, and Receivers accept webhooks from Git hosts, registries and CI so reconciliation starts at once instead of waiting for the polling interval.
- Quote: "The controller handles events coming from external systems (GitHub, GitLab, Bitbucket, Harbor, Jenkins, etc)"

### 12. Using the GitOps Toolkit APIs with Go
- URL: https://fluxcd.io/flux/gitops-toolkit/packages/
- Title: Using the GitOps Toolkit APIs with Go | Flux
- Publisher: Flux project
- Kind: developer documentation
- Summary: Shows the controllers are ordinary controller-runtime programs. Their API types are Go packages (including `github.com/fluxcd/pkg/apis/meta`) that anyone can import and use with a controller-runtime client. This is the best pointer for readers who want to understand Flux as a "plain controller" example.
- Quote: "The APIs can be consumed with the controller-runtime client"

### 13. Stairway to GitOps: Scaling Flux at Morgan Stanley
- URL: https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/
- Title: Stairway to GitOps: Scaling Flux at Morgan Stanley
- Publisher: Flux team (talk by Tiffany Wang and Simon Bourassa, FluxCon NA 2025)
- Kind: case study / conference talk write-up (read in full)
- Summary: Morgan Stanley moved from push pipelines (drift, fragile cluster rebuilds) to Flux. They used service account impersonation with RBAC for multi-tenancy, a self-service onboarding platform that checks entitlements, registers the service in a CMDB, primes the namespace with a GitRepository and Kustomization and scaffolds a repo. At scale they raised reconciliation intervals, tuned `--concurrent` and resource limits, moved the source of truth from a self-hosted Git provider to S3 buckets, built a central Grafana dashboard from kube-state-metrics, and fed notification-controller events to developer tools. Roadmap: sharding, OCI artifacts, Flagger.
- Quote: "over 500 clusters, over 2,000 nodes, over 100,000 containers, and tens of thousands of Flux resources."

### 14. Flux adopters
- URL: https://fluxcd.io/adopters/
- Title: Flux Adopters
- Publisher: Flux project
- Kind: adopter list
- Summary: Lists 200+ organizations using Flux in production, including Cisco, SAP, Kong, Grafana Labs, Sonatype, DKB, TrueLayer, J.B. Hunt, Maersk, BlaBlaCar, Volvo Cars, Axel Springer, ZEIT ONLINE and several universities. No use-case detail is given per entry.

### 15. FluxCD in Production: GitOps for Kubernetes (2026)
- URL: https://codingprotocols.com/blog/fluxcd-gitops-production
- Title: FluxCD in Production: GitOps for Kubernetes (2026)
- Publisher: Coding Protocols (blog)
- Kind: practitioner blog
- Summary: Recommends layering infrastructure, then platform, then applications with `dependsOn`; enabling `prune` and `healthChecks`; Helm upgrade remediation retries; and alerting on `gotk_reconcile_error_total` and `gotk_suspend_status`. Lists pitfalls such as forgetting `--with-source` on `flux reconcile`, third-party OCI chart tags, and missing webhooks. Secondary source, not vendor-verified.
- Quote: "Git is the only source of truth. Without prune, deleted manifests leave orphaned resources."

### 16. Argo CD vs Flux CD comparison
- URL: https://devtron.ai/blog/gitops-tool-selection-argo-cd-or-flux-cd/
- Title: Argo CD vs Flux CD: The Complete GitOps Comparison
- Publisher: Devtron (vendor blog)
- Kind: comparison article
- Summary: Contrasts Flux's distributed controllers with Argo CD's centralized model and sync phases (pre-sync, sync, post-sync). Says Flux isolates tenants with namespaces and RBAC while Argo CD uses Projects, and that Flux lacks a native UI. Vendor perspective, so treat claims on scale as opinion; the UI claim is dated given third-party UIs and the Flux Operator.
- Quote: "ArgoCD performs sync operations in a sequence of steps and is broadly classified into three phases: pre-sync, sync, and post-sync."

## Real-world use cases

Morgan Stanley runs Flux across more than 500 clusters with a self-service onboarding platform tied to entitlements and a CMDB, and uses S3 buckets as the artifact source for availability and compliance reasons (https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/). The same post says speakers from KLM, NatWest Group and Orange were scheduled at FluxCon Europe 2026, but their stories were not read here.

The adopters page names Cisco, SAP, Kong, Grafana Labs, Maersk, Volvo Cars and many others as production users, though without detail (https://fluxcd.io/adopters/).

A typical platform-team scenario is the fleet repo with per-cluster directories and tenant onboarding, as in the reference repository (https://github.com/fluxcd/flux2-multi-tenancy). Another typical scenario is a Helm-heavy shop replacing `helm upgrade` in CI with HelmRelease objects (https://fluxcd.io/flux/use-cases/helm/). A third is automated image promotion to staging via image automation (https://fluxcd.io/flux/guides/image-update/).

## Pitfalls and how tools address them

Tenant privilege escalation. Without lockdown, a Kustomization applies as the controller's cluster-admin identity. Flux addresses this with ServiceAccount impersonation, `--default-service-account`, `--no-cross-namespace-refs` and `--no-remote-bases` (https://fluxcd.io/flux/installation/configuration/multitenancy/). Sharing a namespace between tenants breaks the guarantees (https://github.com/fluxcd/flux2-multi-tenancy). Argo CD addresses isolation with Projects instead, per the comparison article (https://devtron.ai/blog/gitops-tool-selection-argo-cd-or-flux-cd/).

Ordering and readiness. CRDs and operators must exist before resources that use them. Flux uses `dependsOn` with health checks or `wait`; circular dependencies never reconcile (https://fluxcd.io/flux/components/helm/helmreleases/, https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD uses sync phases and waves instead (Devtron article).

Orphans and drift. Without `prune`, removed manifests leave live objects (https://codingprotocols.com/blog/fluxcd-gitops-production). Server-side apply drift correction and `force` for immutable fields are offered in the Kustomization API; HelmRelease has drift detection with ignore rules.

Failed Helm upgrades. HelmRelease remediation retries and rolls back or uninstalls, which is more automated than the Helm CLI (https://fluxcd.io/flux/use-cases/helm/).

Scale and API load. Morgan Stanley raised intervals, concurrency and limits (https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/). Replicas do not add capacity because of leader election; sharding by label does, at the cost of keeping dependent objects labeled consistently (https://fluxcd.io/flux/installation/configuration/sharding/). Flux Operator automates shard setup (https://fluxoperator.dev/docs/instance/sharding/).

Silent failures. Suspended resources drift unnoticed; polling lag without webhooks; stale reconciles when `--with-source` is omitted (https://codingprotocols.com/blog/fluxcd-gitops-production). Notification-controller Alerts and Receivers are the built-in mitigation (https://fluxcd.io/flux/components/notification/).

Image automation risk. Auto-committing new tags can cause unintended production rollouts; the reference repo restricts it to staging (https://github.com/fluxcd/flux2-multi-tenancy).

## Tutorial and explainer links

- https://fluxcd.io/flux/components/ : the best single map of the toolkit.
- https://fluxcd.io/flux/installation/configuration/multitenancy/ : the canonical isolation walkthrough.
- https://github.com/fluxcd/flux2-multi-tenancy : concrete repo layout to copy and read.
- https://fluxcd.io/flux/use-cases/helm/ : ramp-up for Helm users.
- https://fluxcd.io/flux/guides/image-update/ : step-by-step image automation.
- https://fluxcd.io/flux/gitops-toolkit/packages/ : shows Flux as a normal controller-runtime program.
- https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/ : narrative of scaling and onboarding.

## Open questions

- Source-controller internals (artifact storage, leader election effects on artifact serving, OCI verification details) were not covered beyond the overview; a deeper read of its API pages is needed.
- Image automation page was read as a digest; current API versions and any beta status should be checked.
- No independent postmortem of a Flux outage was found; pitfalls come from docs and one practitioner blog.
- Comparison articles are vendor or blog opinion and conflict on UI and scale; no neutral benchmark was found.
- Comparisons with Crossplane, kro, Config Connector, ACK and Cluster API were not researched here; Flux generally deploys these CRs rather than competing with them, but no source read confirms this.
- The Morgan Stanley post mentions sharding only as future work, so no production sharding numbers exist in these sources.
- The Flux sharding page has a caveat about HelmChart labeling; the exact label rules should be verified against the page.
