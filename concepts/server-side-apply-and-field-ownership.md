---
title: Server-Side Apply and Field Ownership
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [SSA, managedFields]
tags: [api-machinery, server-side-apply]
---

# Server-Side Apply and Field Ownership

## Definition

Server-side apply (SSA) is a Kubernetes API mechanism in which the API server merges a client's partial object into the live object and records, for every field, which manager owns it. The ownership record lives in `metadata.managedFields`. It lets several actors, for example Flux and a horizontal autoscaler, co-manage different parts of the same object without overwriting each other. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

## Why it matters

SSA is what lets GitOps tools coexist with in-cluster controllers. Conflicts arise when two managers claim the same field, and resolving them (force-apply, ownership transfer) is a common operational pitfall.

## How it works

A client sends a "fully specified intent", which is the set of fields it has an opinion about, together with a `fieldManager` name. The name is required for apply and is inferred from the User-Agent for other writes, which is why `kubectl` is the default manager name. The server merges the intent into the live object and updates `managedFields`, where each entry has a manager, an operation of `Apply` or `Update`, and the set of fields owned. Server-side apply reached GA in Kubernetes 1.22, together with support for the `status` and `scale` subresources and generated apply configuration types in client-go. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md) See [comparisons/client-side-apply-versus-server-side-apply](../comparisons/client-side-apply-versus-server-side-apply.md).

How lists and maps merge depends on schema markers: `listType`, `listMapKey`, `mapType`, and `structType`. Custom resources whose CRDs carry no markers are treated as unstructured with atomic lists, which means only one manager can own such a list. This is a frequent source of surprise and is why platform layers such as Crossplane ask provider maintainers to add markers. See [findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership](../findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership.md).

## Conflicts and shared ownership

When two managers set a field to different values, the later apply receives a conflict error instead of silently overwriting. The applier has three choices: force the write and become the sole owner, drop the field from its request and give up the claim, or set the same value and become a co-owner. If two managers set the same value they share ownership, and a later change by either one conflicts with the other. A transfer of ownership is done by having both managers set the same value and then letting one drop the field. Removing a field from your manifest deletes it from the live object only if nobody else owns it, which is why SSA can prune safely when several writers are present. See [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md). [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

Two further properties follow. Ownership of fields that no longer appear in the applied object cannot be forced, so stale co-owners block removals. See [findings/client-side-to-server-side-migration-leaves-stale-co-owners](../findings/client-side-to-server-side-migration-leaves-stale-co-owners.md). And a controller that applies a whole object read back from the server claims every field. See [findings/applying-a-whole-read-back-object-claims-every-field](../findings/applying-a-whole-read-back-object-claims-every-field.md).

## Who should force

The Kubernetes documentation strongly recommends that controllers always force conflicts on objects they own, because a controller usually cannot resolve a disagreement about fields it manages. The same maintainers argue that CI/CD systems are controllers that behave like users, so they should surface conflicts to humans. In practice Argo CD runs `--force-conflicts` and Flux force-applies its own intent, then both add escape hatches. This tension is recorded in [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md) and compared across tools in [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md).

## Use by tools

- Flux applies with SSA, runs a server-side dry run every interval, and offers per-resource annotations and ignore rules. See [examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers](../examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers.md).
- Argo CD offers SSA as an opt-in sync option and separately offers Server-Side Diff. See [examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults](../examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults.md).
- Crossplane uses SSA to propagate claims to composite resources to composed resources. See [examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions](../examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions.md).
- Cluster API's topology controller and Kubebuilder-scaffolded controllers use it so several writers can co-author objects. See [examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects](../examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects.md) and [examples/kubebuilder-controller-applies-status-with-a-field-owner](../examples/kubebuilder-controller-applies-status-with-a-field-owner.md).
- Kluctl decides conflicts per field. See [examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics](../examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics.md).

## Conflicts and migration from client-side apply

The API server records which manager owns each field and flags a conflict when another manager owns a differing field. Resolutions are to force, to give up the field, or to coordinate. This replaces the client-side `last-applied-configuration` annotation approach, and it is how humans, Flux, an autoscaler, and other controllers can share one object safely. Flux drift detection uses a server-side apply dry run. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md) and [concepts/declarative-vs-imperative](declarative-vs-imperative.md).

## Field ownership and drift correction

Flux and Argo CD rely on server-side apply to decide what is theirs, and the Kubernetes documentation says conflicting writes can be forced (ownership transfers), can drop the field, or can abort. In practice another manager's edit shows up as drift or as a conflict, and a leftover manager entry such as `kubectl-edit` can make Flux's dry-run fail so that no correction happens. Argo CD's `managedFieldsManagers` ignores chosen managers when diffing. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md), [examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port](../examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port.md), and [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md).

## Pitfalls

Most problems appear at boundaries. The documented ones are stale co-owners after a migration, atomic lists and unmarked CRDs, list entries whose key is co-owned by a stale manager, diffs that mistake server defaults for drift, hidden `managedFields` in `kubectl` output, and forcing that hides real disagreements. A tool that dry-runs before applying can be wedged by a stale co-owner, and Flux's recovery switch since kustomize-controller v1.10.0 is `--override-manager-before-dry-run`, which transfers all fields of the named managers before the dry-run and is meant to be removed afterwards ([sources/research-gap-g3-flux-ssa-helm](../sources/research-gap-g3-flux-ssa-helm.md)). See [findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal](../findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal.md), [findings/diff-is-not-apply-server-defaults-look-like-drift](../findings/diff-is-not-apply-server-defaults-look-like-drift.md), [findings/managedfields-are-hidden-from-kubectl-output-by-default](../findings/managedfields-are-hidden-from-kubectl-output-by-default.md), and [findings/forcing-conflicts-hides-disagreements-between-writers](../findings/forcing-conflicts-hides-disagreements-between-writers.md).

## Open edges

Correction note, 2026-11-26: this section used to say that no primary source was read for kro, ACK, Config Connector, or Helm 4. The m4 dossier read their source, and the results are summarized in the next section. What remains unread is the public Config Connector documentation, the per-service ACK controllers, the Helm v4.0.0 tag, and any table of fields that Cluster API's topology controller owns. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Server-side apply behavior by tool (m4 dossier)

The tools differ more than the shared vocabulary suggests. kro applies template resources with server-side apply and force and applies patch contributions without force ([findings/kro-applies-template-resources-with-server-side-apply-and-force-and-applies-patch-contributions-without-force](../findings/kro-applies-template-resources-with-server-side-apply-and-force-and-applies-patch-contributions-without-force.md)). The ACK runtime sends merge patches and sets no server-side apply manager ([findings/the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager](../findings/the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager.md)). Config Connector writes with Update under `cnrm-controller-manager` and reads other managers' fields as user intent ([findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent](../findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent.md)). Helm 4 installs with server-side apply by default on main, names its manager after the binary, and forces only when `--force-conflicts` is set, while helm-controller always forces ([findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked](../findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked.md)). Cluster API's topology controller forces under `capi-topology`, and its co-authored list slices can reconcile forever ([findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items](../findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items.md)). Argo CD documents Server-Side Diff as stable since v3.1.0 while many bugs stay open ([findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs](../findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs.md)). A forced apply is not a universal fix, as Kubernetes issue 130292 shows ([examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port](../examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port.md)). The two policy questions are recorded as evidence-only decisions: [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md) and [decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field](../decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field.md). [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## Related

[concepts/spec-status-split](spec-status-split.md), [concepts/gitops-pull-based-delivery](gitops-pull-based-delivery.md), [concepts/self-healing-and-drift-detection](self-healing-and-drift-detection.md), [entities/flux](../entities/flux.md), [entities/argo-cd](../entities/argo-cd.md), [entities/kubectl](../entities/kubectl.md)

## Admission and dry-run

Server-side dry-run passes through admission webhooks, so a webhook that does not declare dry-run safety breaks tools that dry-run before applying. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md) See [findings/webhooks-without-sideeffects-declared-break-dry-run-clients](../findings/webhooks-without-sideeffects-declared-break-dry-run-clients.md) and [concepts/admission-webhooks-and-cel](admission-webhooks-and-cel.md).

## Drift fights in the pitfalls dossier

The pitfalls dossier shows the practical form of a field-ownership conflict. Flux and an HPA, or Flux and cert-manager's cainjector, overwrite one field on every reconcile, and in one reported SEV2 the cluster autoscaler joined the loop. Flux resolved it with ignore rules that strip a field when another manager owns it or adopt the live value when Flux is the sole owner, while Argo CD's server-side apply mode runs with `--force-conflicts` and so wins ownership by default. The sources do not compare the two or say which is safer when two controllers legitimately co-own a field. See [examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed](../examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed.md), [comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md), and [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md).

## Update from the v2.5 verification pass (2026-11-26)

Crossplane v2 applies composite resource `resourceRefs` and status with force ownership under the field owner `apiextensions.crossplane.io/composite`, applies composed resources under owners prefixed `apiextensions.crossplane.io/composed`, and syncs claims to XRs through a beta SSA flag that defaults on. Operations also force ownership, which can conflict with other controllers. The one reported case of an external SSA writer losing a field on an XR (issue 7453) is open and not reproduced by a maintainer. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource](../examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource.md).
