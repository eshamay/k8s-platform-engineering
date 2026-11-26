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
aliases: [kubectl apply]
tags: [tool, cli, declarative]
---

# kubectl

kubectl is the standard command-line client for the Kubernetes API, and it is the tool through which all three object-management techniques in the official documentation are expressed. [[sources/research-declarative-vs-imperative]]

## Three ways to use it

Imperative commands such as `kubectl create` and `kubectl scale` act on live objects directly. Imperative object configuration uses explicit verbs on files, for example `kubectl replace -f`. Declarative object configuration uses `kubectl apply -f dir/`, which computes a three-way merge between the configuration file, the live object, and the last-applied annotation. See [[comparisons/kubectl-object-management-techniques]].

## Safety features and hazards

The declarative task tutorial recommends running `kubectl diff` before applying. It also warns that `kubectl apply --prune` can delete objects that were created outside the configuration workflow, and it recommends explicit `kubectl delete -f` for deletions. See [[findings/unintended-deletion-through-prune]]. Client-side apply relies on the `last-applied-configuration` annotation, which server-side apply replaces with true field ownership. See [[concepts/server-side-apply-and-field-ownership]].

## Related

[[concepts/declarative-vs-imperative]], [[findings/mixing-management-techniques-on-one-object]]
