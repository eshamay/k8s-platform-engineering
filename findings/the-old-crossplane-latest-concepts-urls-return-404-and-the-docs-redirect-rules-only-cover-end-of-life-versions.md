---
title: "The old Crossplane /latest/concepts URLs return 404, and the docs redirect rules only cover end-of-life versions"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: [crossplane docs 404]
tags: [crossplane, documentation, redirects, v2, pitfall, verified]
---

# The old Crossplane /latest/concepts URLs return 404, and the docs redirect rules only cover end-of-life versions

## Observation

A request to `https://docs.crossplane.io/latest/concepts/compositions/` on 2026-11-26 returned HTTP 404 with zero redirects. The same was true for the `/latest/concepts/` pages for composition revisions, managed resources, providers, composition functions, and composite resources. The moved equivalents answer 200: `/latest/composition/compositions/`, `/latest/composition/composition-revisions/`, and `/latest/managed-resources/managed-resources/`. The status codes came from curl, because the scraping tool returned an empty body for the 404 page. [[sources/research-gap-b1-unverified-claims]]

The versioned path `https://docs.crossplane.io/v1.20/concepts/compositions/` still answers 200 and is not redirected, because Netlify does not redirect a page that exists.

## Why the redirect does not help

The docs repository `netlify.toml` has a catch-all rule that sends paths of end-of-life versions (`/:version/*`) to `/latest/:splat`. Its own comment warns: "These might return 404 if docs have moved around, but for many docs the redirect will work." The v2 reorganization moved the former concepts section into `composition/` and `managed-resources/`, so a path such as `/latest/concepts/compositions/` has no target. Several explicit rules in the same file still point at `/latest/concepts/composition-revisions/` and `/latest/concepts/connection-details/`, and the composition-revisions target is a 404 today, so those rules are stale. URL: https://github.com/crossplane/docs/blob/master/netlify.toml

## What to do with old links

A blog post, runbook, or tutorial that links to a `/latest/concepts/...` page will not land on the current page. Use the v1.20 path if the content describes v1 behavior, or the `/latest/composition/` and `/latest/managed-resources/` paths for v2. This answers the question left open in [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]]. Absent redirects also explain why search results for older Crossplane questions return dead pages. See [[entities/crossplane]].
