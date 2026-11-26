---
title: The "Level driven, not edge driven" guideline is point 3 of the Controller Writing Guide, and the Beda quotation remains second-hand
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Origin of level driven not edge driven]
tags: [level-triggered, provenance, controller-writing-guide, history]
---

# The "Level driven, not edge driven" guideline is point 3 of the Controller Writing Guide, and the Beda quotation remains second-hand

## Observation

The guide that earlier pages cited only through the Ayson post is "Writing Controllers", at `contributors/devel/sig-api-machinery/controllers.md` in kubernetes/community. "Level driven, not edge driven." is guideline 3 in its Guidelines list, after "Operate on one item at a time" and "Random ordering between resources". The guide says "Just like having a shell script that isn't running all the time, your controller may be off for an indeterminate amount of time", that "you can't count on having seen it turn from `false` to `true`, only that you now observe it being `true`", and that this holds "unless your controller is also marking the information it last made the decision on in the object's status." It opens with "Watches, etc, are all merely optimizations of this logic." https://github.com/kubernetes/community/blob/main/contributors/devel/sig-api-machinery/controllers.md (latest commit on the file 2026-05-08) [[sources/research-gap-m5-informers-caches]]

## Timeline

The file's history on the old path `contributors/devel/controllers.md` begins on 2016-11-30 with a commit "imported docs/devel as a subtree", and the file moved to sig-api-machinery on 2019-01-23. The design-principle form is older than the guide's current location: the archived principles say "Edge-triggered behavior must be just an optimization", with the file's first commit on 2017-09-06. The archived architecture document says "While the controllers are level-based" and that they "typically `watch` for changes to relevant resources in order to minimize reaction latency", and it links the Hacker Noon post. Tim Hockin's deck of 2017-06-02 says "State is more useful than events. Level-driven software is about asserting state." https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/principles.md and https://speakerdeck.com/thockin/edge-vs-level-triggered-logic

The dossier did not establish the first date on which the exact phrase appeared in the guide, beyond the old-path history.

## The Beda attribution

The Hacker Noon post of 2018-01-23 quotes Joe Beda, attributed to Cloud Native Infrastructure by Garrison and Nova: "If you are edge triggered you run risk of compromising your state and never being able to re-create the state." The book was not read, so the attribution to the book is SECONDARY-ONLY. https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d

## Related

[[concepts/level-triggered-vs-edge-triggered]], [[decisions/events-as-hints-state-as-truth]], [[findings/stale-cache-and-double-action]], [[findings/a-controller-that-relies-on-seeing-every-event-misses-changes-made-while-it-is-down]].
