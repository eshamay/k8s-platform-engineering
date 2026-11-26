---
title: The Cluster API topology controller uses SSA for co-authored objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, server-side-apply, topology, co-authoring]
---

# The Cluster API topology controller uses SSA for co-authored objects

## Scenario

The ClusterClass topology controller in Cluster API generates objects such as control plane and infrastructure objects from a single Cluster definition. The controllers for those objects, and the infrastructure and control plane providers, also write to them. [[sources/research-server-side-apply-and-field-ownership]]

## What happened

Pull request 6495, merged in June 2022, added a server-side apply helper to the topology controller. The stated motivation is to "leverage on the API server for handling controllers co-authoring the same object". The changed files include a structured-merge dry-run and patch helper under the topology controller. URL: https://github.com/kubernetes-sigs/cluster-api/pull/6495.

## Limits of the evidence

This is a thin source. The dossier read only the description and file list, so it did not verify which fields Cluster API owns and which belong to infrastructure providers. Do not infer field-level rules from this page. See [[open-knowledge-gaps]].

## Lesson

A platform controller that generates objects other controllers also edit is a natural fit for SSA, because the API server arbitrates ownership instead of the controller guessing. See [[entities/cluster-api]], [[concepts/server-side-apply-and-field-ownership]], and [[findings/multiple-writers-on-one-object]].
