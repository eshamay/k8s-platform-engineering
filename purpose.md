# Purpose — k8s-platform-engineering

> **Write authority:** This file is **human-only-edit, agent-may-suggest**. Agents read it on every operation. Agents may propose updates by drafting an entry in `todo.md` when an ingest reveals scope drift. Agents never edit this file directly, even when prompted.

Last human edit: 2026-11-25 by Eric Shamay

## What this wiki is FOR

This wiki exists to build a deep, well-sourced understanding of the architecture and principles that underlie Kubernetes resource-management platforms such as Flux and Crossplane. The Kubernetes API server, etcd, CRDs, and controllers form a general-purpose control plane, and tools in this space exploit that control plane to manage infrastructure and applications far beyond container scheduling. The wiki aims to explain why that model works, where it strains, and what good architecture looks like when building platforms on top of it.

The wiki is a research instrument and also a source for teaching material. Its content folders feed a tutorial series and ramp-up guides written into `outputs/`.

## Research questions

1. What core architectural principles (universal control plane, declarative intent, level-triggered reconciliation, eventual consistency, drift correction, pull-based GitOps) make Kubernetes a viable control plane for arbitrary resources?
2. How do KRM and API machinery (GVK/GVR, CRDs, the spec and status split, server-side apply and field ownership, admission webhooks and CEL) give platform tools a shared substrate?
3. What happens inside controllers and operators (reconcile loops, idempotency, informers, reflectors, workqueues, finalizers, owner references, conditions), and which mechanics cause real-world failures?
4. How do abstraction layers (managed resources, composite resources, compositions, providers, kro resource graphs) let platform teams publish simple APIs over complex infrastructure?
5. What architectural principles lead to good platforms like Flux and Crossplane, and how do their designs differ from neighbors such as Argo CD, Config Connector, ACK, Cluster API, and Terraform-based approaches?
6. What are the use cases, strengths, tooling, common pitfalls, and gaps of each tool, and how do they handle scale?

## Audiences

- **Primary:** engineers who have working experience operating Kubernetes but lack deep knowledge of controller internals, KRM, and platform-engineering abstractions.
- **Secondary:** platform engineers evaluating or designing internal developer platforms on Flux, Crossplane, kro, or similar tools.
- **LLM agents** operating this wiki follow `CLAUDE.md` on every operation.

## Scope: what is in

- Core architecture and vocabulary of Kubernetes as a universal control plane.
- KRM, API machinery, controller and operator mechanics, and platform abstractions.
- Flux and Crossplane in depth; kro, Argo CD, Config Connector, ACK, Cluster API, Terraform operators, and IDP front ends (Backstage, Port) at landscape depth.
- Real-world industry use cases, pitfalls, anti-patterns, and scale considerations.
- Tutorial and ramp-up material, including a five-part series and one ramp-up per major tool.

## Non-goals

- Basic Kubernetes administration (installing clusters, pod and deployment fundamentals); readers are assumed to know these.
- Vendor-neutral product comparisons for purchasing decisions, pricing, or procurement.
- Cloud-provider-specific infrastructure tutorials beyond what illustrates a platform concept.
- Writing or maintaining code for any of these tools.

## Writing style for deliverables

Everything under `outputs/` uses narrative, full-sentence prose that keeps nuance and does not truncate or condense. Readability and completeness take priority over brevity.

## Success criteria

- Every concept in the seed vocabulary has a sourced concept page.
- Flux and Crossplane each have an entity page and a ramp-up tutorial.
- The five-part tutorial series exists in `outputs/`, with background, use cases, pitfalls, and cross-tool comparisons in each part.
