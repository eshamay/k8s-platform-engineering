---
title: A composition function that omits a resource from its desired state deletes it
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, composition-functions, state-ownership]
---

# A composition function that omits a resource from its desired state deletes it

## The failure mode

A composition function is not an incremental patch. Crossplane sends the function the observed and desired state, and the function returns the new desired state for the composite. Anything missing from that returned state is removed, so a function that returns only its own resources deletes what earlier steps or earlier calls created. [[sources/research-composition]]

## Evidence

VSHN met this during the alpha: "missing resources on function requests were actually deleted." Their summary was that "if an object is not explicitly specified in a request payload, it will be deleted." The post is at https://blog.crossplane.io/composition-functions-in-production/. The design doc requires the same discipline: functions return the desired state and never talk to the API server to create or delete composed resources themselves (https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md). This is the level-based pattern described in [[findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state]].

## Mitigation

Start from the incoming desired state, change only your own parts, and pass everything else through. Test with `crossplane render` so an accidental omission shows up in rendered output before it reaches a cluster, see [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]].

## Related

[[concepts/composition]], [[entities/crossplane]], [[findings/composition-functions-add-moving-parts-that-must-be-healthy]], [[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]]
