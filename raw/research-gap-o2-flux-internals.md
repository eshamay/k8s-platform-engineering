# Research dossier: gap cluster o2-flux-internals

Research date: 2026-11-26

## Overview

This pass read the fluxcd/website sources (installation sharding page, image-update guide, CEL health-check cheatsheet), the source-controller and fluxcd/pkg Go sources, the kustomize-controller Kustomization spec, the image-reflector and image-automation spec pages, and several GitHub issues, all through the gh CLI as raw text. web_search returned no results for the one query tried, so discovery relied on GitHub code search. Component versions seen at read time: Flux v2.10.1 (2026-11-20), source-controller v1.10.2 (2026-11-20), image-reflector-controller and image-automation-controller v1.3.1 (2026-11-20). Pages were read from the default branch (main), so they describe current main, not necessarily the tagged releases.

Source-controller stores artifacts under a local path (default /data, an emptyDir in the stock manifest) and serves them from an in-process HTTP file server. main.go starts that server only after the manager is elected leader, and a readiness check fails on non-leaders. The sharding page now states that standby replicas stay not ready by design, so extra replicas are failover only. The shipped Deployment uses replicas: 1 with Recreate strategy. Sharding uses the `sharding.fluxcd.io/key` label with a `--watch-label-selector` flag, and the docs say a HelmChart must carry the same label as its HelmRepository. Cozystack is a named adopter running label-sharded helm-controllers. Morgan Stanley lists sharding only as something it is exploring.

Image automation is `image.toolkit.fluxcd.io/v1` in the current specs, with older versions still present in the API directory. The official guide's promotion advice is: semver policies for production, branch-sha-timestamp tags for staging, and an optional separate push branch plus a CI-opened pull request for manual approval. For composites and kro instances, Flux has no ownerReference or tracking recipe in the docs I read. Health is determined by kstatus or by CEL `healthCheckExprs`, and a closed flux2 issue shows kstatus can declare Crossplane resources ready too early unless the Ready condition carries observedGeneration. No Flux-specific kro guidance was found in either project.

## Gap: Flux source-controller internals and artifact serving under leader election

Artifact storage and serving are configured by flags bound from fluxcd/pkg: storage path default `/data`, bind address default `:9090`, and an advertised in-cluster address that the stock manifest sets to the source-controller service DNS name. Retention defaults are a 1 minute TTL and 2 records kept after garbage collection, and the digest algorithm defaults to sha256. The stock manifest passes `--enable-leader-election`, runs one replica with `Recreate` strategy, and in this read both volumes visible in the manifest are emptyDir, so artifacts do not survive a pod restart by default and are re-fetched and rebuilt on reconcile (this last inference is mine; the spec only says an Artifact can disappear from storage on eviction).

Under leader election, main.go blocks on `mgr.Elected()` before starting the artifact server, and registers a readyz check named `leader-election` that returns "manager is not the leader" on non-leaders. The sharding page states the consequence: standbys add no capacity and stay not ready. The comment in main.go says the process is presumed to terminate on losing leadership. With label selectors, the leader-election ID is derived from the selector, so shard instances elect independently. During a restart the Service has no ready endpoint until the new pod is elected and the server starts, and dependents then fail fetches until artifacts exist again. The exact dependent-controller behavior during that window was not read. The spec also notes a suspended GitRepository does not reflect a vanished artifact until resumed.

OCI source verification was not read in this pass (see Not found). The default lease durations of the leader election options were not captured either.

Claims:
- Artifact server starts only after leader election. Status: VERIFIED. URL: https://github.com/fluxcd/source-controller/blob/main/main.go (read via contents API, main branch, 2026-11-26; source-controller latest release v1.10.2). Quote: "Start the artifact server if running as leader."
- Non-leaders fail readiness. Status: VERIFIED. URL: https://github.com/fluxcd/pkg/blob/main/runtime/probes/probes.go (main). Quote: "manager is not the leader"
- Docs: standby replicas not ready by design; only the leader serves artifacts; extra replicas add no capacity. Status: VERIFIED. URL: https://github.com/fluxcd/website/blob/main/content/en/flux/installation/configuration/sharding.md (main). Quote: "Standby source-controller replicas stay not ready by design, because only the leader serves artifacts."
- Artifact storage defaults: path /data, addr :9090, retention TTL 1 minute, 2 records, sha256. Status: VERIFIED. URL: https://github.com/fluxcd/pkg/blob/main/artifact/config/flags.go (main). Quote: "defaultArtifactRetentionTTL = time.Minute"
- Stock manifest: replicas 1, Recreate strategy, --enable-leader-election, --storage-path=/data, advertised address via service DNS. Status: VERIFIED. URL: https://github.com/fluxcd/source-controller/blob/main/config/manager/deployment.yaml (main). Quote: "replicas: 1" and "type: Recreate"
- Volumes in the stock manifest are emptyDir (so artifacts are ephemeral by default). Status: VERIFIED for the emptyDir lines (same URL, "emptyDir: {}" appears twice); the mapping of /data to one of them and the consequences are UNVERIFIED inference.
- Leader election ID is derived from the watch label selector when set. Status: VERIFIED. URL: https://github.com/fluxcd/source-controller/blob/main/main.go. Quote: "leaderElectionId = leaderelection.GenerateID(leaderElectionId, watchOpts.LabelSelector)"
- Artifacts can vanish on pod eviction; suspended objects do not reflect this until resumed. Status: VERIFIED. URL: https://github.com/fluxcd/source-controller/blob/main/docs/spec/v1/gitrepositories.md (main). Quote: "this Artifact later disappears from the storage due to e.g. the source-controller Pod being evicted"
- OCI source verification mechanics. Status: UNVERIFIED (not read).

## Gap: Flux sharding in production and the HelmChart labeling rule

The labeling rule from the current docs: every object belonging to a shard carries `sharding.fluxcd.io/key: <shard>`, and the docs say source kinds that depend on another kind (HelmChart on HelmRepository) need the same labels. HelmCharts are generated from a HelmRelease, so the label is set through `.spec.chart.metadata.labels` on the HelmRelease. For bulk assignment, a parent Kustomization uses `commonMetadata.labels` plus a patch that adds the chart label on every HelmRelease. Main controllers are told to ignore any keyed object with `--watch-label-selector=!sharding.fluxcd.io/key`. The docs say notification-controller and source-watcher do not support sharding, and the example deletes image-reflector and image-automation deployments from shard sets (so image automation is not sharded in that recipe). If a HelmRelease is labeled but its chart is not, the chart goes to a different controller than the one needing its artifact; the docs do not spell out the failure symptom, so the exact error is not verified.

Named adopters: Cozystack (cozystack/cozystack) ships a flux-shard-operator that creates helm-controller shards with `--watch-label-selector=sharding.fluxcd.io/key=shard<i>`, places tenants greedily by HelmRelease count, and sizes shards at roughly 100 HelmReleases per shard (max 16), default per-shard `--concurrent` 5. Its README is a vendor-written description of design intent; no measured outcome numbers were found. The Flux blog post on Morgan Stanley (500+ clusters, tens of thousands of Flux resources) lists sharding only as exploration, consistent with the existing wiki claim. The flux-operator repo also has a sharding guide (docs/guides/instance/instance-sharding.md), found by code search but not read.

Claims:
- Sharding key label and watch-label-selector mechanism. Status: VERIFIED. URL: https://github.com/fluxcd/website/blob/main/content/en/flux/installation/configuration/sharding.md (main). Quote: "shard the reconciliation of Flux resources using the `sharding.fluxcd.io/key` label"
- HelmChart labeling rule. Status: VERIFIED. Same URL. Quote: "Source object kinds which have a dependency on another kind (i.e. `HelmChart` on a `HelmRepository`) need to have the same labels"
- Chart label set via HelmRelease `.spec.chart.metadata.labels`. Status: VERIFIED. Same URL. Quote: "we set the sharding key on the generated Flux `HelmChart` object"
- Main controllers exclude keyed objects. Status: VERIFIED. Same URL. Quote: "--watch-label-selector=!sharding.fluxcd.io/key"
- notification-controller and source-watcher do not support sharding. Status: VERIFIED. Same URL. Quote: "these controllers do not support sharding"
- Sharding is advised at tens of thousands of applications. Status: VERIFIED. Same URL. Quote: "tens of thousands of applications"
- Cozystack runs helm-controller shards via a custom operator, ~100 HR per shard. Status: VERIFIED as the project's own documentation (production use not independently confirmed). URL: https://github.com/cozystack/cozystack/blob/main/packages/system/flux-shard-operator/README.md (main). Quote: "K = clamp(ceil(H/100), 1, min(16, T))"
- Morgan Stanley is only exploring sharding. Status: VERIFIED. URL: https://github.com/fluxcd/website/blob/main/content/en/blog/2026-03-15-stairway-to-gitops-morgan-stanley/index.md (2026-03-15). Quote: "Exploring sharding Flux controllers to distribute load across multiple instances within a cluster."
- Production shard sizing numbers from any adopter beyond Cozystack's design targets. Status: UNVERIFIED.

## Gap: Flux image automation API status and safe promotion policy

Current spec pages for ImageRepository, ImagePolicy and ImageUpdateAutomation all use `image.toolkit.fluxcd.io/v1`. The ImagePolicy CRD in image-reflector-controller shows `name: v1` with served: true and storage: true (grep of the CRD; other versions in the Go api directory are v1beta1 and v1beta2). Both controllers' latest releases are v1.3.1 (2026-11-20). I did not read release notes stating when v1 graduated, nor the ImageUpdateAutomation CRD storage version directly (only its spec page, which uses v1).

Promotion guidance in the official guide: production uses semver-selected release tags built by CI, staging uses `branch-sha-timestamp` tags with numerical/alphabetical style policies, `spec.git.push.branch` can differ from the checkout branch so CI can open a pull request for manual approval, and a bad update is reverted by narrowing the semver range. The guide does not prescribe a policy for keeping automatic updates out of production beyond these choices, and no third-party adopter write-up on staging-only or reviewed promotion was found. ImagePolicy has `digestReflectionPolicy` (the spec says Never is the default), and ImageUpdateAutomation commit messages summarise changes via a template.

Claims:
- Image kinds are v1. Status: VERIFIED. URL: https://github.com/fluxcd/image-reflector-controller/blob/main/docs/spec/v1/README.md (main). Quote: "# image.toolkit.fluxcd.io/v1"
- ImageUpdateAutomation spec uses v1. Status: VERIFIED. URL: https://github.com/fluxcd/image-automation-controller/blob/main/docs/spec/v1/imageupdateautomations.md (main). Quote: "apiVersion: image.toolkit.fluxcd.io/v1"
- ImagePolicy CRD v1 served and storage. Status: VERIFIED. URL: https://github.com/fluxcd/image-reflector-controller/blob/main/config/crd/bases/image.toolkit.fluxcd.io_imagepolicies.yaml (main). Quote: "served: true" / "storage: true" / "name: v1"
- Release versions v1.3.1 (reflector, automation), 2026-11-20. Status: VERIFIED. URL: https://api.github.com/repos/fluxcd/image-reflector-controller/releases (read via gh). Quote: "v1.3.1 2026-11-20T10:30:37Z"
- Production vs staging workflow. Status: VERIFIED. URL: https://github.com/fluxcd/website/blob/main/content/en/flux/guides/image-update.md (main). Quote: "automatically deploy application patches (CVEs and bug fixes)"
- Separate push branch for manual approval. Status: VERIFIED. Same URL. Quote: "This way you can manually approve the image updates before they are applied on your clusters."
- Revert via semver range. Status: VERIFIED. Same URL. Quote: "you can tell Flux to revert the image tag to a previous version"
- Adopter write-ups of staging-only or reviewed promotion. Status: UNVERIFIED (not searched beyond the guide; web_search returned nothing).
- Date v1 was introduced / beta status history. Status: UNVERIFIED.

## Gap: Flux handling of composite resources and kro instances

Flux treats composites as arbitrary custom resources. Kustomization `healthChecks` accept built-ins, Flux kinds, and "custom resources that are compatible with kstatus"; `wait: true` checks everything applied; `healthCheckExprs` lets you supply CEL `current`/`failed` expressions per apiVersion/kind (kind optional, group-level match, version ignored). `dependsOn` gates a Kustomization on the dependency being Ready, and when health checks or wait are set, on its health checks passing; `dependsOn[].readyExpr` can replace the built-in readiness check with CEL. Prune deletes objects removed from the source by inventory; Flux does not need ownerReferences on composites to track them because it records an inventory of what it applied (inference from the prune description; no ownerReference text read in Flux docs). Resources composed by Crossplane or kro are not applied by Flux, so they are outside the inventory.

The CEL library lists Crossplane Provider and an AWS Role example, using the Ready condition. A closed flux2 issue (#5855) reports that Crossplane resources lacking an initial Ready condition were seen as ready by kstatus; maintainers said kstatus requires observedGeneration and recommended a CEL expression requiring `e.observedGeneration == metadata.generation`. The reporter said this works but wanted it handled by Flux. For kro, instances get built-in conditions (`InstanceManaged`, `ResourcesReady`, `Ready`, and others) and custom conditions can be declared; kro stamps observedGeneration on custom conditions. No document on Flux with kro instances was found; kro issue #1290 (open) describes external controllers fighting kro over fields, which concerns server-side apply ownership, not Flux specifically.

Claims:
- healthChecks accept kstatus-compatible custom resources. Status: VERIFIED. URL: https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md (main). Quote: "Custom resources that are compatible with kstatus"
- dependsOn waits for health checks when wait or healthChecks set. Status: VERIFIED. Same URL. Quote: "will be applied after all its dependencies' health checks have passed"
- readyExpr replaces built-in readiness. Status: VERIFIED. Same URL. Quote: "the built-in readiness check is replaced by the logic"
- CEL healthCheckExprs kind optional, group matched, version ignored. Status: VERIFIED. URL: https://github.com/fluxcd/website/blob/main/content/en/flux/cheatsheets/cel-healthchecks.md (main). Quote: "only the group portion of `apiVersion` is used for matching"
- Crossplane CEL examples exist. Status: VERIFIED. Same URL. Quote: "iam.aws.crossplane.io/v1beta1"
- kstatus race with Crossplane Ready condition; fix via observedGeneration CEL. Status: VERIFIED (issue thread, closed 2026-04-21). URL: https://github.com/fluxcd/flux2/issues/5855. Quote: "controllers should set observedGeneration on the Ready condition"
- Prune is garbage collection of previously applied objects missing from source. Status: VERIFIED. Kustomization spec URL above. Quote: "Kubernetes objects that were previously applied on the cluster but are missing from the current source revision"
- Flux does not need ownerReference recipes for composites. Status: UNVERIFIED (inference; no Flux page states it).
- kro instance conditions. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/concepts/rgd/04-status-conditions.md (main). Quote: "kro stamps `lastTransitionTime` and `observedGeneration`"
- kro per-field ownership conflict with external controllers (open issue). Status: VERIFIED. URL: https://github.com/kubernetes-sigs/kro/issues/1290. Quote: "kro resets those changes on the next reconciliation"
- Flux plus kro official guidance. Status: UNVERIFIED (searched kro issues for "flux" and kro website paths; nothing specific).

## Unreadable sources

- None blocked. Note: the web_search tool returned zero results for one query ("Flux sharding.fluxcd.io/key production shards ... case study"), so no web pages were scraped.
- https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/docs/guides/instance/instance-sharding.md: found by code search, not read (time).

## Not found

- OCI source verification (cosign/notation) mechanics: not read.
- Leader-election default lease, renew, and retry durations: flags exist in fluxcd/pkg runtime/leaderelection but values not captured.
- Observed dependent-controller behavior while source-controller is restarting or unelected: not read.
- Whether artifacts are persisted across restarts in any supported configuration (PVC): stock manifest uses emptyDir; no doc read on alternatives.
- Production sharding measurements from any adopter; Cozystack provides design targets only.
- Adopter write-ups on staged/reviewed image promotion policy.
- Release-note date for ImageRepository/ImagePolicy/ImageUpdateAutomation v1 graduation.
- Flux documentation or issues specific to kro instances.

## Verification note

Adversarial re-check on 2026-11-26 re-read the cited main-branch files and release/issue metadata through the gh CLI. All checked VERIFIED claims reproduced as worded (quotes sometimes span line breaks). Release dates and versions, flag defaults, manifest settings, CRD served/storage, issue #5855 closed date, and kro #1290 open state all matched. No corrections were needed.

## Removed in verification

- None.
