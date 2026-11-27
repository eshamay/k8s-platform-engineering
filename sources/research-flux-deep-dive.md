---
title: "Research dossier: Flux deep dive"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [flux, gitops, multi-tenancy, sharding, helm, image-automation, research-dossier]
---

# Research dossier: Flux deep dive

> [!NOTE]
> **Raw file:** `raw/research-flux-deep-dive.md` (sha256 prefix e640ec8046bc)<br>
> **Kind:** Research dossier summarizing 16 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Most Flux documentation pages were read through summarizing fetches, so wording is a digest. Only the Morgan Stanley blog post was read in full. Quotes and field names should be checked against the live pages before they are reused in a tutorial. The Kustomization page was read without its last 20 percent, and the HelmRelease page without its last 23 percent.

## Summary

The dossier presents Flux as a set of small Kubernetes controllers, called the GitOps Toolkit, that each own one job and communicate only through custom resources. The source controller fetches Git repositories, OCI artifacts, Helm repositories, and buckets and serves them in the cluster as tar.gz artifacts. The kustomize controller and the helm controller apply those artifacts, the notification controller sends alerts and receives webhooks, and the image automation controllers write new image tags back to Git. Because the source layer is separate from the delivery layer, a team can change where manifests come from without changing how they are applied.

Operational concerns show up as a consistent set of knobs. Ordering uses `dependsOn`, readiness uses `healthChecks` and `wait` with optional CEL expressions, and cleanup uses `prune`. Failure handling uses `retryInterval`, `timeout`, and Helm remediation. Isolation comes from impersonating a tenant ServiceAccount plus lockdown flags on the controllers. Scale is handled by raising intervals and concurrency and, when needed, by label-based sharding, because extra replicas of one controller are only failover standbys.

The strongest real-world evidence is Morgan Stanley's talk write-up, which describes more than 500 clusters, a self-service onboarding platform, and a move from a self-hosted Git provider to S3 buckets as the artifact source. The adopters page lists more than 200 organizations without detail. The dossier found no independent postmortem of a Flux outage and no neutral benchmark against Argo CD, so its pitfalls come from documentation and one practitioner blog.

## Key claims

### Architecture

- Flux is described as "a set of specialized tools and Flux Controllers; composable APIs; reusable Go packages for GitOps" (https://fluxcd.io/flux/components/). See [entities/flux](../entities/flux.md) and [examples/flux-splits-gitops-into-single-purpose-controllers](../examples/flux-splits-gitops-into-single-purpose-controllers.md).
- The source controller handles GitRepository, OCIRepository, HelmRepository, HelmChart, and Bucket kinds, fetches "on-demand and on-a-schedule," and packages the result as tar.gz or yaml for in-cluster consumers (https://fluxcd.io/flux/components/source/). Downstream controllers therefore never talk to Git directly.
- The Flux controllers are ordinary controller-runtime programs, and their API types are Go packages, including `github.com/fluxcd/pkg/apis/meta`, that can be used with a controller-runtime client (https://fluxcd.io/flux/gitops-toolkit/packages/). See [entities/controller-runtime](../entities/controller-runtime.md).
- The notification controller has Providers that push events to chat and other systems, Alerts that choose events by severity and object, and Receivers that accept webhooks from Git hosts, registries, and CI so that reconciliation starts at once (https://fluxcd.io/flux/components/notification/). See [examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval](../examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval.md).

### Kustomization and HelmRelease behavior

- The Kustomization API provides `dependsOn` with optional CEL readiness expressions, `healthChecks` and `wait`, `prune`, `force` for immutable-field changes, `retryInterval`, `postBuild.substitute`, SOPS decryption with age, OpenPGP, and cloud KMS, `serviceAccountName` for impersonation, and server-side apply drift correction (https://fluxcd.io/flux/components/kustomize/kustomizations/).
- Garbage collection means "the Kubernetes objects that were previously applied on the cluster but are missing from the current source revision, are removed." See [findings/without-prune-flux-leaves-removed-manifests-running-as-orphans](../findings/without-prune-flux-leaves-removed-manifests-running-as-orphans.md).
- The HelmRelease API covers `dependsOn`, install and upgrade remediation (retry, rollback, or uninstall), optional Helm tests, drift detection through a server-side dry run with ignore rules, `valuesFrom`, `chartRef` to an OCIRepository or HelmChart, CEL health checks, and a CRD policy of Skip, Create, or CreateReplace (https://fluxcd.io/flux/components/helm/helmreleases/).
- "Circular dependencies between HelmRelease resources must be avoided, otherwise the interdependent HelmRelease resources will never be reconciled." See [findings/circular-dependson-chains-between-flux-resources-never-reconcile](../findings/circular-dependson-chains-between-flux-resources-never-reconcile.md).
- For Helm users, "While the Helm client commands let you imperatively do things, Flux Helm Custom Resources let you declare what you want the Helm SDK to do automatically," with retries, remediation, and drift correction and no Tiller-style server because the controller uses the Helm SDK (https://fluxcd.io/flux/use-cases/helm/). See [examples/teams-replace-helm-upgrade-in-ci-with-flux-helmrelease-objects](../examples/teams-replace-helm-upgrade-in-ci-with-flux-helmrelease-objects.md) and [entities/helm](../entities/helm.md).

### Multi-tenancy

- Platform admins set the controller flags `--no-cross-namespace-refs=true`, `--no-remote-bases=true`, and `--default-service-account=default`, and reconciliation then runs as a tenant ServiceAccount so Kubernetes RBAC limits what a tenant repository can create (https://fluxcd.io/flux/installation/configuration/multitenancy/). Objects without `spec.serviceAccountName` "will use the `default` account from the tenant's namespace." Without RBAC on that account, deployments fail. See [findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity](../findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity.md).
- The `flux2-multi-tenancy` reference repository has `clusters/`, `policies/`, and `tenants/` directories, tenant repositories with `base/`, `staging/`, and `production/` overlays, and the statement that "Sharing namespaces between tenants is not supported, as it would break the isolation guarantees" (https://github.com/fluxcd/flux2-multi-tenancy). See [examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation](../examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation.md).

### Scale and sharding

- Sharding runs several copies of a controller with unique names, such as `source-controller-shard1`, each watching objects with the label `sharding.fluxcd.io/key` through `--watch-label-selector`. The default controllers exclude labeled objects, and dependent objects such as HelmRepository, HelmChart, and HelmRelease must carry matching labels. "Extra replicas of a Flux controller are failover standbys. Only the elected leader reconciles." (https://fluxcd.io/flux/installation/configuration/sharding/). See [findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity](../findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity.md), [findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents](../findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents.md), and [examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances](../examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances.md).
- The Flux Operator declares shards in the `FluxInstance` spec and creates the extra controller sets and label selectors (https://fluxoperator.dev/docs/instance/sharding/). See [entities/flux-operator](../entities/flux-operator.md).
- Image automation uses ImageRepository to scan tags, ImagePolicy to pick a tag by semver, calver, or regex, and ImageUpdateAutomation to edit YAML at `$imagepolicy` marker comments, commit, and push. The stated aim is to "automatically deploy application patches (CVEs and bug fixes), and keep a record of all deployments in Git history" (https://fluxcd.io/flux/guides/image-update/). See [examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging](../examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging.md) and [findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production](../findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production.md).

### Case study and adopters

- Morgan Stanley runs Flux across "over 500 clusters, over 2,000 nodes, over 100,000 containers, and tens of thousands of Flux resources." They moved from push pipelines, used ServiceAccount impersonation, built a self-service onboarding platform tied to entitlements and a CMDB, raised intervals, tuned `--concurrent` and resource limits, moved the source of truth from a self-hosted Git provider to S3 buckets, built a central Grafana dashboard from kube-state-metrics, and fed notification-controller events to developer tools. Sharding, OCI artifacts, and Flagger are roadmap items (https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/). See [examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding](../examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding.md).
- The adopters page lists more than 200 organizations, including Cisco, SAP, Kong, Grafana Labs, Sonatype, DKB, TrueLayer, J.B. Hunt, Maersk, BlaBlaCar, Volvo Cars, Axel Springer, and ZEIT ONLINE, with no per-entry use-case detail (https://fluxcd.io/adopters/).

### Practitioner and comparison sources

- A practitioner blog recommends layering infrastructure, platform, and applications with `dependsOn`, enabling `prune` and `healthChecks`, and alerting on `gotk_reconcile_error_total` and `gotk_suspend_status`. It states "Git is the only source of truth. Without prune, deleted manifests leave orphaned resources." and lists pitfalls such as forgetting `--with-source` on `flux reconcile`, third-party OCI chart tags, and missing webhooks (https://codingprotocols.com/blog/fluxcd-gitops-production). This is a secondary source. See [findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent](../findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent.md).
- A vendor blog contrasts Flux's distributed controllers with Argo CD's centralized model and its pre-sync, sync, and post-sync phases, says Flux isolates tenants with namespaces and RBAC while Argo CD uses Projects, and says Flux lacks a native UI (https://devtron.ai/blog/gitops-tool-selection-argo-cd-or-flux-cd/). The dossier flags the UI claim as dated. See [comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog](../comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog.md).

## Open questions recorded by the dossier

The dossier lists source-controller internals, the current status of the image automation APIs, the absence of any Flux postmortem, conflicting vendor opinions on UI and scale, the lack of comparisons with Crossplane, kro, Config Connector, ACK, and Cluster API, the absence of production sharding numbers, and the exact HelmChart labeling rule for sharding. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Pages built from this source

[entities/flux](../entities/flux.md), [entities/flux-operator](../entities/flux-operator.md), [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md), [comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice](../comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice.md), [decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first](../decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first.md)
