---
title: "Remove a stuck finalizer by force or repair the owning controller"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [decision, finalizers, troubleshooting, operations]
---

# Remove a stuck finalizer by force or repair the owning controller

## Status

Open as a judgment call. The sources agree on the order of preference but not on a threshold for forcing. [[sources/research-finalizers]]

## Context

An object is stuck Terminating because its controller is gone, its cleanup errors, or a child holds its own finalizer. An operator must choose between fixing the cause and stripping the finalizer.

## Options

- Diagnose and repair. Read `metadata.finalizers`, find the owning controller, and read its logs. Reinstall or fix the controller, or unblock the child.
- Force removal as a last resort. Patch the list empty or remove one entry, or use the namespace `/finalize` subresource, and then clean up the external resources by hand.

## Trade-offs

Repair preserves the guarantee that cleanup runs, but it can take time when the controller no longer exists. Force removal restores speed and loses the guarantee. The Kubernetes documentation says not to remove finalizers manually unless the purpose is understood and met another way, and Martin Heinz argues against doing it reflexively.

## Related

[[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]], [[examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete]], [[concepts/finalizers]]
