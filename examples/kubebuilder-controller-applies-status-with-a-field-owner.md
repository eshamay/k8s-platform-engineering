---
title: A Kubebuilder controller applies status with a named field owner
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [kubebuilder, server-side-apply, controller, client-go]
---

# A Kubebuilder controller applies status with a named field owner

## Scenario

An operator author wants the controller to write only the fields it manages, while users and other operators may add labels or spec fields that the controller must not overwrite. [[sources/research-server-side-apply-and-field-ownership]]

## What happened

The Kubebuilder book (alpha page) shows scaffolding the API with `--ssa`, which generates ApplyConfiguration types. The controller then applies its status with `client.FieldOwner("controller-name")` and `client.ForceOwnership`. These types descend from the client-go apply configurations introduced at GA in Kubernetes 1.22, where every field is a pointer so a request can express exactly the fields the controller cares about. URL: https://master.book.kubebuilder.io/reference/server-side-apply.html and https://kubernetes.io/blog/2021/08/06/server-side-apply-ga/.

## When to use it

The book recommends SSA when several controllers or users manage one resource, when users customize custom resources with fields the controller should not overwrite, and when other operators import your apply types. For a sole-owner controller that manages the entire object, it says "traditional `Update()` is simpler and sufficient." The best practices are to always set a field owner, force ownership of fields the controller manages, and specify only the fields you manage.

## Lesson

The Kubernetes maintainer blog adds that new controllers should be "reconstructive", rebuilding their desired fields from scratch each time, while existing controllers can extract and re-apply. See [[findings/applying-a-whole-read-back-object-claims-every-field]], [[entities/kubebuilder]], and [[concepts/spec-status-split]].
