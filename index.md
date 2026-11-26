# Index — k8s-platform-engineering

Categorized catalog of every page in the wiki. Updated on every ingest.

## Concepts

### Core architectural principles

- [[concepts/universal-control-plane]] — Kubernetes API and etcd as a control plane for any infrastructure (draft)
- [[concepts/declarative-vs-imperative]] — end-state specs versus command sequences (draft)
- [[concepts/level-triggered-vs-edge-triggered]] — state-driven versus event-driven controller logic (draft)
- [[concepts/eventual-consistency-and-convergence]] — concurrent apply, retry, converge (draft)
- [[concepts/self-healing-and-drift-detection]] — reverting out-of-band changes (draft)
- [[concepts/gitops-pull-based-delivery]] — in-cluster agent pulls from Git (draft)

### KRM and API machinery

- [[concepts/gvk-and-gvr]] — schema and REST coordinates (draft)
- [[concepts/custom-resource-definition]] — registering new API types (draft)
- [[concepts/spec-status-split]] — intent versus observed reality (draft)
- [[concepts/server-side-apply-and-field-ownership]] — managedFields and shared ownership (draft)
- [[concepts/admission-webhooks-and-cel]] — mutate and validate before persistence (draft)

### Controller and operator mechanics

- [[concepts/operator-pattern]] — operational knowledge packaged as controller plus CRDs (draft)
- [[concepts/reconciliation-loop]] — the Reconcile function (draft)
- [[concepts/idempotency]] — safe repeated reconciliation (draft)
- [[concepts/informers-reflectors-and-workqueues]] — watch, cache, queue machinery (draft)
- [[concepts/finalizers]] — block deletion until external cleanup (draft)
- [[concepts/owner-references-and-garbage-collection]] — cascading deletion (draft)
- [[concepts/conditions]] — machine-readable status (draft)

### Platform engineering and abstraction

- [[concepts/managed-resource]] — one-to-one cloud primitive (draft)
- [[concepts/composite-resource]] — opinionated platform API over many resources (draft)
- [[concepts/composition]] — blueprint mapping composite to managed resources (draft)
- [[concepts/provider]] — controller and CRDs for an external API (draft)

## Entities

- [[entities/flux]] — in-cluster GitOps tool (draft)
- [[entities/crossplane]] — control plane framework for external infrastructure (draft)
- [[entities/kro]] — resource-graph based platform API tool (draft)

## Sources

- [[sources/krm-platform-vocabulary]] — seed vocabulary note, 2026-11-25

## Examples

_(none yet)_

## Comparisons

_(none yet)_

## Decisions

_(none yet)_

## Findings

_(none yet)_

## Outputs

_(none yet)_
