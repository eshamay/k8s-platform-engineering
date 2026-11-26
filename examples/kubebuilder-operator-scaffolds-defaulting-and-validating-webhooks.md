---
title: A Kubebuilder operator scaffolds defaulting and validating webhooks
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [kubebuilder, webhooks, operators, controller-runtime]
---

# A Kubebuilder operator scaffolds defaulting and validating webhooks

## Scenario

An operator author who builds a CRD with Kubebuilder wants defaults filled in and invalid objects rejected for the new kind. The Kubebuilder book's CronJob tutorial walks through the pattern that every controller-runtime operator follows. [[sources/research-admission-webhooks-and-cel]]

## How it works

The author scaffolds with `kubebuilder create webhook`, implements `Default()` for defaulting and `ValidateCreate`, `ValidateUpdate`, and `ValidateDelete` for validation, and lets markers generate the webhook manifests, including paths, failure policies, resources, and admission review versions. The webhook ships in the same binary as the controller, which the dossier calls the plain-controller path. URL: https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation.

## Lesson

The webhook shares a process, and therefore an availability profile, with the controller, and the operator owns certificate management; cert-manager is the usual helper but the dossier did not read that part of the book. The declarative portion of validation pairs well with CEL rules in the CRD, which keep simple checks off the webhook path. See [[examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks]] and [[decisions/validate-with-cel-rules-or-a-validating-webhook]].

## Related

[[entities/kubebuilder]], [[concepts/operator-pattern]], and [[concepts/admission-webhooks-and-cel]].
