---
title: Go-template Compositions need hand-written ordering and deletion guards
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, composition, go-templating, ordering, deletion, kro]
---

# Go-template Compositions need hand-written ordering and deletion guards

## Observation

A tutorial that built the same `StorageApp` API with kro and with a pure Crossplane XRD plus `function-go-templating` found that the template-based Composition needs hand-written logic for creation order and for avoiding deletion of resources when a dependency is briefly unavailable. kro's reference model, in which order is inferred from the expressions that reference other resources, handles both more naturally (https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8, read through a summarizing fetch). [[sources/research-kro-and-abstraction-models]]

## Why it matters

The risky half is deletion. A Composition function returns desired state, and the wiki already records that resources omitted from a function's output are deleted. A template that fails to emit a resource because an observed dependency is momentarily absent can therefore ask Crossplane to remove something that should stay. The guard has to be written and tested by the Composition author, for every dependency. kro's equivalent protection is built in, since it waits for referenced values to resolve before creating a resource and deletes in reverse topological order. See [[concepts/composition]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]], and [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]].

The trade-off runs the other way as well: the same blog comparison notes that Crossplane's function pipeline is more expressive, with Go templates, KCL, and Python, and is therefore easier to make complicated. See [[findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use]].

## Evidence strength

The evidence is one hands-on tutorial. The outcomes of the two builds were otherwise equivalent, and no incident or scale measurement is reported. See [[examples/build-the-same-storageapp-api-with-kro-and-with-a-crossplane-go-templating-composition]].
