---
title: GitOps (Pull-Based Delivery)
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: [GitOps, Pull-based delivery]
tags: [architecture, principle, gitops]
---

# GitOps (Pull-Based Delivery)

## Definition

GitOps is a way of operating a system in which the whole desired state is written down declaratively, stored in a versioned and immutable store (usually Git, increasingly an OCI registry), and applied by software agents instead of humans or pipelines running commands. In the Kubernetes form, an in-cluster agent such as Flux pulls changes and applies them to the API server, instead of a CI pipeline pushing changes from outside. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md) [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md)

## The four principles

The OpenGitOps working group under the CNCF reduces GitOps to four principles: the desired state is declarative; it is stored versioned and immutable with full history; software agents automatically pull it from the source; and agents continuously observe actual state and try to apply the desired state. The sources agree that the last two principles separate GitOps from "CI/CD that happens to read YAML from Git," so a pipeline that pushes once and never reconciles does not qualify. A Red Hat interview with Intuit states the same principles. [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md) [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## Why it matters

Pull means the agent lives in or next to the target, fetches desired state, and writes with in-cluster identity. A push pipeline holds credentials for every environment, so one compromise is broad, while a pull agent needs only read access to the source. The agent itself becomes a powerful identity, so tools add counters such as Flux's per-tenant service-account impersonation and the signed-OCI design that removes the cluster-to-Git connection. Pull also gives an auditable history of intent and reuses the same reconcile mechanics as any other controller. See [comparisons/push-versus-pull-delivery](../comparisons/push-versus-pull-delivery.md), [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md), and [entities/flux](../entities/flux.md).

## Mechanics: the controller pattern pointed at a source

Pull-based GitOps on Kubernetes is the ordinary non-terminating control loop that moves current state toward desired state, with Git or OCI as the source of desired state. Flux splits the work into composable controllers (source, kustomize, helm, notification, image automation). Argo CD splits it into an API server, a repository server that renders manifests, and an application controller that diffs live against target state. Both poll on an interval (Flux Kustomizations about 5 minutes, Argo CD about 120 seconds plus jitter) and can be nudged by webhooks, and the exact defaults vary by version. See [comparisons/flux-versus-argo-cd-architecture](../comparisons/flux-versus-argo-cd-architecture.md) and [concepts/reconciliation-loop](reconciliation-loop.md).

## The two-layer loop

GitOps is not limited to workloads. Crossplane, Config Connector, Cluster API, and kro expose cloud or cluster resources as custom resources reconciled by their own controllers. The GitOps agent keeps those custom resources in sync from Git, and a second layer of controllers reconciles the real world, so GitOps controllers reconcile Git into the Kubernetes API and domain controllers reconcile the API into reality. Pitfalls mostly occur at the seams: custom-resource health, pruning, drift against controllers that mutate fields, and credentials. See [findings/two-reconcile-loops-hide-status-and-drift-at-two-layers](../findings/two-reconcile-loops-hide-status-and-drift-at-two-layers.md), [findings/generic-gitops-agents-cannot-judge-custom-resource-health](../findings/generic-gitops-agents-cannot-judge-custom-resource-health.md), and [examples/crossplane-resources-hosted-by-argo-cd](../examples/crossplane-resources-hosted-by-argo-cd.md). [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md)

## Pitfalls and mitigations

Accidental deletion is guarded by Argo CD's default of no prune plus the allow-empty guard, and by Flux's opt-in garbage collection ([findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md)). Another controller may legitimately own a field such as replica count, so Argo CD's best practices say to leave it out of Git ([findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md)). Rollback needs a Git revert while Argo CD automation is on ([findings/rollback-is-blocked-while-automated-sync-is-on](../findings/rollback-is-blocked-while-automated-sync-is-on.md)). Remote Helm and Kustomize references should be pinned to tags or SHAs ([findings/mutable-remote-references-change-what-a-commit-renders](../findings/mutable-remote-references-change-what-a-commit-renders.md)). Secrets are decrypted by Flux's controller using SOPS or KMS; Argo CD's secret handling is not covered by the dossier.

## Beyond Kubernetes and beyond Git

INNOQ argues that GitOps is a pattern that does not require Kubernetes ([examples/gitops-agent-on-non-kubernetes-targets](../examples/gitops-agent-on-non-kubernetes-targets.md)). Flux's D2 reference architecture replaces Git with signed OCI artifacts so clusters never connect to the Git host ([examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts](../examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts.md)). Whether Git or OCI should be canonical is unresolved in the sources ([decisions/git-versus-oci-as-the-canonical-source](../decisions/git-versus-oci-as-the-canonical-source.md)).

## Principles and implementations in this wiki

Flux defines GitOps as ensuring that a given state matches a desired state declaratively defined somewhere, and Argo CD automated sync applies Git state when an application is OutOfSync. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [examples/intuit-argo-cd-gitops-origin](../examples/intuit-argo-cd-gitops-origin.md), [examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd](../examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd.md), and [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](../comparisons/flux-versus-argo-cd-drift-and-prune-defaults.md).

## Level-triggered reconciliation in GitOps tools

GitOps tools turn "Git is truth" into a repeating comparison between Git and the cluster, with interval polling as the safety net and source-change events as a latency optimization. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) See [examples/gitops-reverts-a-hand-edited-deployment](../examples/gitops-reverts-a-hand-edited-deployment.md) and [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## Ordering and retries in GitOps tools

Flux uses `dependsOn` and health checks, and Argo CD uses health-gated sync waves, to impose order on an otherwise concurrent apply. The two bound retries differently. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [examples/flux-dependson-and-health-checks-gate-rollout](../examples/flux-dependson-and-health-checks-gate-rollout.md), [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md), and [comparisons/retry-and-backoff-controls-across-tools](../comparisons/retry-and-backoff-controls-across-tools.md).

## Drift correction in practice

Automated sync in Argo CD applies Git changes without CI needing cluster credentials, and `selfHeal` re-syncs when live state deviates. Teams commonly adopt in stages, keeping manual sync for risky production workloads. Flux's Helm drift detection is a per-release option, disabled by default. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md), [comparisons/drift-detection-mechanisms-across-tools](../comparisons/drift-detection-mechanisms-across-tools.md), and [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md).

## Flux as a worked implementation

The Flux deep dive shows how one pull-based agent splits the loop into layers. The source controller pulls Git, OCI, Helm, and bucket content and packages it as artifacts, the kustomize and helm controllers apply them, the notification controller accepts webhooks that start a reconcile at once instead of waiting for the poll interval, and the image automation controllers write new tags back to Git so history stays the audit record. Multi-tenancy is enforced by impersonating a tenant ServiceAccount, and scale is handled by tuning intervals and concurrency or by sharding. The strongest adopter evidence is Morgan Stanley's report of more than 500 clusters that moved from push pipelines to Flux and chose S3 buckets as the artifact source. The dossier found no independent postmortem, so the pitfalls still rest on documentation and one practitioner blog. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md) See [entities/flux](../entities/flux.md), [examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding](../examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding.md), and [findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent](../findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent.md).

## Related

[concepts/declarative-vs-imperative](declarative-vs-imperative.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md), [concepts/server-side-apply-and-field-ownership](server-side-apply-and-field-ownership.md), [concepts/universal-control-plane](universal-control-plane.md)

## To research

Named production adopters, scale numbers, and postmortems of GitOps-caused outages were not found, and the full Git-commit-to-Ready lifecycle trace remains open. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Update from the GitOps incidents dossier

Correction, 2026-11-26: the closing note above says named production adopters and GitOps-caused outage evidence were not found. The dossier found named adopters as self-reported lists ([examples/the-argo-cd-users-file-lists-452-self-reported-adopters](../examples/the-argo-cd-users-file-lists-452-self-reported-adopters.md), [examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures](../examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures.md)) and anonymous incident reports, including a customer incident where self-heal skipped a migration hook ([examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications](../examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications.md)). No named organization's GitOps postmortem was found. Source: [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md).

## Evidence from a named global outage

Skyscanner's 2021 postmortem shows both edges of pull-based delivery. Argo CD enforced a broken desired state in every region within about half an hour of the merge, deleting 478 services, and the same pull model let clusters reconfigure themselves once correct configuration returned. The lesson the team drew was to avoid global configuration deploys and to treat templated configuration as code. See [examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services](../examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services.md) and [findings/templated-configuration-that-looks-like-config-is-code-and-needs-tests-and-a-regional-rollout-before-a-gitops-controller-applies-it-globally](../findings/templated-configuration-that-looks-like-config-is-code-and-needs-tests-and-a-regional-rollout-before-a-gitops-controller-applies-it-globally.md).

## Hub reach, secrets, and sources in practice (o1 dossier)

Pull-based in the principles does not mean the agent runs inside each target cluster. A central Argo CD instance pulls from Git but reaches into registered clusters ([findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity](../findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity.md)). The two main agents also differ on where secret plaintext may exist ([decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops](../decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops.md)) and on whether the source artifact is signature-verified ([findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification](../findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification.md)). [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)
