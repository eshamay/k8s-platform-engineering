---
title: Imagine Learning replaces thousand-line patch-and-transform files with a looping composition function
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: [Imagine Learning]
tags: [use-case, crossplane, composition-functions, testing]
---

# Imagine Learning replaces thousand-line patch-and-transform files with a looping composition function

## Scenario

Imagine Learning is a K-12 digital education company that uses Crossplane for its internal developer platform on AWS. Its platform abstractions include RDS clusters and S3 buckets. [sources/research-composition](../sources/research-composition.md)

## Before

Native patch-and-transform compositions for AWS RDS clusters ran past 1,000 lines, about 1,250 for a two-instance cluster. Nearly identical files were needed for different instance counts because patch and transform cannot render conditionally or loop. The authors wrote that composition files "regularly contained more than 1,000 lines of repetitive code." See [findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources](../findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources.md).

## After

The team moved to composition functions and chose one monolithic function that routes to per-composition rendering logic. They preferred it to one function per composition because it means fewer idle pods and a single code base, which trades away some isolation. A loop over `instanceCount` replaced the duplicated files. The post is at https://blog.crossplane.io/building-crossplane-composition-functions-to-empower-your-control-plane/ (Blake Romano, 7 March 2024).

## Testing

They run `crossplane beta render` locally to unit-test the rendered output. They say this prevents contract breaks between the XR or EnvironmentConfig inputs and the deployed state, which addresses the late-failure cost described in [findings/composition-functions-add-moving-parts-that-must-be-healthy](../findings/composition-functions-add-moving-parts-that-must-be-healthy.md).

## Related

[concepts/composition](../concepts/composition.md), [entities/crossplane](../entities/crossplane.md), [examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions](vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions.md), [findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory](../findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory.md)
