---
title: An EC2 client token makes a retried RunInstances call safe
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [aws, idempotency, client-token, ec2, retries]
---

# An EC2 client token makes a retried RunInstances call safe

## Scenario

A caller launches an EC2 instance with `RunInstances` and the connection drops before the response arrives. Retrying fixes a transient fault, but if the first call succeeded the retry could launch a second instance. The AWS Builders' Library article by Malcolm Featonby uses this case to explain safe retries. Controllers that sit on top of cloud APIs inherit whatever contract the API offers. [[sources/research-idempotency]]

## The contract

The caller supplies a unique client request identifier, the `ClientToken` in EC2. The service stores the token together with the mutation in one atomic, ACID operation, so the token and the resource cannot diverge. A retry with the same token is recognized as a duplicate, and the service returns a semantically equivalent response and not an "already exists" error, because an error would change the caller's control flow. Created resources can also be labeled with the token so they can be traced. [[sources/research-idempotency]]

## Why hashing is not used

The article rejects duplicate detection based on a hash of the request, because two identical requests might be intentional, such as launching two identical instances. Only the caller can say that a request is a retry. [[sources/research-idempotency]]

## Lesson for controller authors

A controller deciding whether a create can be retried blindly should look for a client token or a caller-chosen identifier in the API. Where one exists, the controller can derive the token from the Kubernetes object's UID and retry freely. Where none exists, it needs a pending marker or a lookup. The dossier does not show a Kubernetes controller deriving a token this way, so that application is an inference and not a sourced claim. See [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]] and [[concepts/idempotency]].

## Related

[[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]], [[findings/retry-storms-and-unbounded-retries]]
