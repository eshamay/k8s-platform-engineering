---
title: Server-Side Apply and Field Ownership
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
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
aliases: [SSA, managedFields]
tags: [api-machinery, server-side-apply]
---

# Server-Side Apply and Field Ownership

## Definition

Server-side apply (SSA) is a Kubernetes API mechanism in which the API server merges a client's partial object into the live object and records, for every field, which manager owns it. The ownership record lives in `metadata.managedFields`. It lets several actors, for example Flux and a horizontal autoscaler, co-manage different parts of the same object without overwriting each other. [[sources/krm-platform-vocabulary]]

## Why it matters

SSA is what lets GitOps tools coexist with in-cluster controllers. Conflicts arise when two managers claim the same field, and resolving them (force-apply, ownership transfer) is a common operational pitfall.

## How it works

A client sends a "fully specified intent", which is the set of fields it has an opinion about, together with a `fieldManager` name. The name is required for apply and is inferred from the User-Agent for other writes, which is why `kubectl` is the default manager name. The server merges the intent into the live object and updates `managedFields`, where each entry has a manager, an operation of `Apply` or `Update`, and the set of fields owned. Server-side apply reached GA in Kubernetes 1.22, together with support for the `status` and `scale` subresources and generated apply configuration types in client-go. [[sources/research-server-side-apply-and-field-ownership]] See [[comparisons/client-side-apply-versus-server-side-apply]].

How lists and maps merge depends on schema markers: `listType`, `listMapKey`, `mapType`, and `structType`. Custom resources whose CRDs carry no markers are treated as unstructured with atomic lists, which means only one manager can own such a list. This is a frequent source of surprise and is why platform layers such as Crossplane ask provider maintainers to add markers. See [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]].

## Conflicts and shared ownership

When two managers set a field to different values, the later apply receives a conflict error instead of silently overwriting. The applier has three choices: force the write and become the sole owner, drop the field from its request and give up the claim, or set the same value and become a co-owner. If two managers set the same value they share ownership, and a later change by either one conflicts with the other. A transfer of ownership is done by having both managers set the same value and then letting one drop the field. Removing a field from your manifest deletes it from the live object only if nobody else owns it, which is why SSA can prune safely when several writers are present. See [[findings/multiple-writers-on-one-object]]. [[sources/research-server-side-apply-and-field-ownership]]

Two further properties follow. Ownership of fields that no longer appear in the applied object cannot be forced, so stale co-owners block removals. See [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]]. And a controller that applies a whole object read back from the server claims every field. See [[findings/applying-a-whole-read-back-object-claims-every-field]].

## Who should force

The Kubernetes documentation strongly recommends that controllers always force conflicts on objects they own, because a controller usually cannot resolve a disagreement about fields it manages. The same maintainers argue that CI/CD systems are controllers that behave like users, so they should surface conflicts to humans. In practice Argo CD runs `--force-conflicts` and Flux force-applies its own intent, then both add escape hatches. This tension is recorded in [[decisions/force-conflicts-or-surface-them-to-humans]] and compared across tools in [[comparisons/ssa-conflict-policy-across-tools]].

## Use by tools

- Flux applies with SSA, runs a server-side dry run every interval, and offers per-resource annotations and ignore rules. See [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]].
- Argo CD offers SSA as an opt-in sync option and separately offers Server-Side Diff. See [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]].
- Crossplane uses SSA to propagate claims to composite resources to composed resources. See [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]].
- Cluster API's topology controller and Kubebuilder-scaffolded controllers use it so several writers can co-author objects. See [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]] and [[examples/kubebuilder-controller-applies-status-with-a-field-owner]].
- Kluctl decides conflicts per field. See [[examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics]].

## Conflicts and migration from client-side apply

The API server records which manager owns each field and flags a conflict when another manager owns a differing field. Resolutions are to force, to give up the field, or to coordinate. This replaces the client-side `last-applied-configuration` annotation approach, and it is how humans, Flux, an autoscaler, and other controllers can share one object safely. Flux drift detection uses a server-side apply dry run. [[sources/research-declarative-vs-imperative]] See [[findings/multiple-writers-on-one-object]] and [[concepts/declarative-vs-imperative]].

## Field ownership and drift correction

Flux and Argo CD rely on server-side apply to decide what is theirs, and the Kubernetes documentation says conflicting writes can be forced (ownership transfers), can drop the field, or can abort. In practice another manager's edit shows up as drift or as a conflict, and a leftover manager entry such as `kubectl-edit` can make Flux's dry-run fail so that no correction happens. Argo CD's `managedFieldsManagers` ignores chosen managers when diffing. [[sources/research-self-healing-and-drift-detection]] See [[findings/field-ownership-blocks-drift-correction]], [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], and [[comparisons/exemption-and-ignore-controls-across-tools]].

## Pitfalls

Most problems appear at boundaries. The documented ones are stale co-owners after a migration, atomic lists and unmarked CRDs, list entries whose key is co-owned by a stale manager, diffs that mistake server defaults for drift, hidden `managedFields` in `kubectl` output, and forcing that hides real disagreements. See [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]], [[findings/diff-is-not-apply-server-defaults-look-like-drift]], [[findings/managedfields-are-hidden-from-kubectl-output-by-default]], and [[findings/forcing-conflicts-hides-disagreements-between-writers]].

## Open edges

The dossier could not read primary sources for kro, ACK, Config Connector, or Helm 4, so this page makes no claim about how those tools set field managers. See [[open-knowledge-gaps]].

## Related

[[concepts/spec-status-split]], [[concepts/gitops-pull-based-delivery]], [[concepts/self-healing-and-drift-detection]], [[entities/flux]], [[entities/argo-cd]], [[entities/kubectl]]

## Admission and dry-run

Server-side dry-run passes through admission webhooks, so a webhook that does not declare dry-run safety breaks tools that dry-run before applying. [[sources/research-admission-webhooks-and-cel]] See [[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]] and [[concepts/admission-webhooks-and-cel]].

## Drift fights in the pitfalls dossier

The pitfalls dossier shows the practical form of a field-ownership conflict. Flux and an HPA, or Flux and cert-manager's cainjector, overwrite one field on every reconcile, and in one reported SEV2 the cluster autoscaler joined the loop. Flux resolved it with ignore rules that strip a field when another manager owns it or adopt the live value when Flux is the sole owner, while Argo CD's server-side apply mode runs with `--force-conflicts` and so wins ownership by default. The sources do not compare the two or say which is safer when two controllers legitimately co-own a field. See [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]], [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]], and [[sources/research-pitfalls-and-case-studies]].
