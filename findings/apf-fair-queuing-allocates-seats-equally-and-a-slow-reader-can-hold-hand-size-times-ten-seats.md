---
title: "APF fair queuing allocates seats equally and a slow reader can hold hand size times ten seats"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [APF approximations, KEP-1040 fair queuing limits]
tags: [kubernetes, apf, kep-1040, fair-queuing, scale, pitfall, verified]
---

# APF fair queuing allocates seats equally and a slow reader can hold hand size times ten seats

## Observation

The API Priority and Fairness design describes its own fair-queuing as approximate. The KEP-1040 README says the current solution is "dissatisfying" in two ways: "By allocating the available seats equally rather than with max-min fairness, the current solution sometimes pretends that a queue uses more seats than it can", and it executes one request per queue at a time in the virtual world, which cuts corners a fully accurate version would need to revise. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md) https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1040-priority-and-fairness/README.md

The README's equations define `rho(i,t)` as the sum of widths of arrived but unfinished requests in queue i and the equal share `mu_equal(t) = min(C, Sum[over i] rho(i,t)) / NEQ(t)` over the non-empty queues. Each queue's rate is `rate(i,t) = mu_equal(t) / NOS(i,t)`, and a request's virtual finish time solves an integral of that rate equal to its estimated length, with an initial guess for requests that have not finished.

## LIST width

A LIST costs more than one seat. The README gives `width_cpu(N) = min(A, B*N)` and `width_ram(N) = D*N`, combined as `width(n) = max(min(A, B*N), D*N)`, and approximates it as `width_approx(n) = min(A, ceil(N / E))` with E = 1 / B. A back-of-envelope estimate (4 GB per CPU, 10 kB objects) puts the point where memory cost dominates at about 400,000 objects ("we need to process 400.000 objects to make the memory cost higher"). The text still carries "[TODO: describe how `N` is estimated.]", so how the object count is obtained is not documented. The README's shuffle sharding example uses 128 queues and a hand size of 6. A request's width is capped at the priority level's seats and is not rejected, because borrowing was not yet done when that text was written.

## Failure mode

The README names a failure mode in which a client that makes requests with big responses and does not finish reading them within a minute can hold seats for a long time. It says such a client can be "constantly occupying (hand size) X (max width = 10) seats", and it links Kubernetes issue 115409. The product depends on the configured hand size and priority level.

## Why it matters

The wiki's description of APF in [concepts/scale-and-sharding](../concepts/scale-and-sharding.md) covers seats, shuffle sharding, and rejection. These limits show that a single client with large, slowly read responses can still tie up seats that other flows need, and the production readiness review says APF adds "non-negligible latency" to API calls by design. They bound how far an operator should trust the fairness claim. See [findings/the-kep-1040-readme-history-stops-at-v1-26-while-its-kep-yaml-records-stable-in-v1-29](the-kep-1040-readme-history-stops-at-v1-26-while-its-kep-yaml-records-stable-in-v1-29.md) and [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](../examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md).

## Related

[findings/client-side-throttling-and-server-side-apf-are-separate-layers](client-side-throttling-and-server-side-apf-are-separate-layers.md), [findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026](flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026.md), [findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking](the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking.md)
