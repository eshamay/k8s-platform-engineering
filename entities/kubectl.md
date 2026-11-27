---
title: kubectl
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: [kubectl apply]
tags: [tool, cli, declarative]
---

# kubectl

kubectl is the standard command-line client for the Kubernetes API, and it is the tool through which all three object-management techniques in the official documentation are expressed. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## Three ways to use it

Imperative commands such as `kubectl create` and `kubectl scale` act on live objects directly. Imperative object configuration uses explicit verbs on files, for example `kubectl replace -f`. Declarative object configuration uses `kubectl apply -f dir/`, which computes a three-way merge between the configuration file, the live object, and the last-applied annotation. See [comparisons/kubectl-object-management-techniques](../comparisons/kubectl-object-management-techniques.md).

## Safety features and hazards

The declarative task tutorial recommends running `kubectl diff` before applying. It also warns that `kubectl apply --prune` can delete objects that were created outside the configuration workflow, and it recommends explicit `kubectl delete -f` for deletions. See [findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md). Client-side apply relies on the `last-applied-configuration` annotation, which server-side apply replaces with true field ownership. See [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Related

[concepts/declarative-vs-imperative](../concepts/declarative-vs-imperative.md), [findings/mixing-management-techniques-on-one-object](../findings/mixing-management-techniques-on-one-object.md)

## Server-side apply mode

`kubectl apply --server-side` is the supported path from client-side apply to server-side apply. On a conflict it offers only an error or `--force-conflicts`, which forces everything, and the default manager name is `kubectl` unless `--field-manager` is set. `kubectl diff --server-side` shows what the server would change, and `kubectl get -o yaml` hides `managedFields` unless `--show-managed-fields` is passed. The maintainers hope to make server-side apply the default, and the dossier did not verify that. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md) See [comparisons/client-side-apply-versus-server-side-apply](../comparisons/client-side-apply-versus-server-side-apply.md) and [findings/managedfields-are-hidden-from-kubectl-output-by-default](../findings/managedfields-are-hidden-from-kubectl-output-by-default.md).
