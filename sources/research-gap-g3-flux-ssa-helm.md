---
title: "Research dossier: Flux pre-dry-run manager takeover flag (g3-flux-ssa-helm)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [flux, kustomize-controller, server-side-apply, field-manager, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: Flux pre-dry-run manager takeover flag (g3-flux-ssa-helm)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-flux-ssa-helm.md` (sha256 prefix e825557fc5c4)<br>
> **Kind:** Verified research dossier for gap cluster g3-flux-ssa-helm, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing Flux and server-side apply pages<br>
> **Caveat:** Claims are labeled VERIFIED in the dossier. The fluxcd.io pages were read as a scraped rendering, and the PR, issue, and commit text came from the GitHub API. The helm-controller `driftDetection` landing version and Helm 4 server-side apply were not researched.

## Summary

The dossier settles one gap: the final name and semantics of the kustomize-controller flag that issue 1722 proposed and PR 1747 delivered. The shipped flag is `--override-manager-before-dry-run`, the same name the issue proposed. It first shipped in kustomize-controller v1.10.0 (release date 2026-10-24) and is bundled in Flux v2.10.0 (GitHub release published 2026-10-26, with v2.10.1 following on 2026-11-20).

The flag is a separate opt-in list and does not change `--override-manager`. The existing flag takes over the named managers only after a successful server-side apply dry-run. The new flag reclaims ownership before the dry-run, so an object wedged at dry-run validation by a stale co-owning manager can recover. The documentation warns that the takeover transfers all fields owned by the listed managers, prunes fields missing from the source, and is not reverted if the apply fails. Names match exactly, not by prefix. The default managers (kubectl, before-first-apply, and the controller's own Update manager) stay on the post-dry-run path.

## Key claims

- The shipped flag is `--override-manager-before-dry-run`, delivered by kustomize-controller PR 1747 (author dipti-pai, merged 2026-10-23, merge commit cc6d0d33), which fixes issue 1722. The PR text reads "Add the --override-manager-before-dry-run flag, wiring the named field managers into ssa ApplyCleanupOptions.FieldManagersBeforeDryRun". URL: https://github.com/fluxcd/kustomize-controller/pull/1747.
- The companion fluxcd/pkg PR 1276, "ssa: Add pre-dry-run field manager takeover", merged 2026-10-23T09:54:25Z, shortly before the controller PR. URL: https://github.com/fluxcd/pkg/pull/1276.
- The existing `--override-manager` takeover runs only after a successful dry-run, "so it cannot recover an object wedged at dry-run validation" (PR 1747).
- The pre-dry-run list is kept separate, and "the always-on default managers stay on the post-dry-run cleanup path to preserve their transactional behavior" (PR 1747).
- The design rationale, discussed at a Flux dev meeting on 6 August, is that "A pre-dry-run takeover mutates ownership first, so if the dry-run then fails for an unrelated reason" the ownership has already been reassigned. Issue 1722 was created 2026-08-06T23:25:13Z and closed 2026-10-23T10:14:26Z. The meeting year is not stated in the text and is most likely 2026 by inference. URL: https://github.com/fluxcd/kustomize-controller/issues/1722.
- The documentation section "Override managers before dry-run" says the takeover transfers all owned fields, prunes fields missing from the source, and that "The managedFields change is not reverted if the apply fails." It adds "Manager names are matched exactly, not by prefix." URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/docs/README.md, rendered at https://fluxcd.io/flux/components/kustomize/options/.
- The documentation advises "Use it only to recover stuck objects and remove it once they have reconciled".
- The options page flag table describes the new flag as "Field manager taken over before the server-side apply dry-run." and describes `--override-manager` as "Field manager disallowed to perform changes on managed resources."
- The v1.10.0 code builds one Apply entry and one Update entry per named manager with `ExactMatch: true`, with the comment "Taken over before the dry-run, so the default managers are not included." URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/internal/controller/kustomization_controller.go.
- The v1.10.0 CHANGELOG lists "Add the `--override-manager-before-dry-run` flag" under Improvements, and no earlier release contains the flag. URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/CHANGELOG.md.
- The Flux v2.10.0 release notes announce `--override-manager-before-dry-run` (`Kustomization`). URL: https://github.com/fluxcd/flux2/releases/tag/v2.10.0.
- The Kustomization spec page at https://fluxcd.io/flux/components/kustomize/kustomizations/ does not mention `--override-manager`, because flags are documented on the controller options page. This is an absence claim from a scraped page dated 2026-11-26.
- The commits of PR 1747 carry "Assisted-by" trailers naming AI tools (GitHub Copilot with Claude Opus 4.8 on the first commit, and Claude Code on the docs trim by Stefan Prodan), so the flag, code, and documentation were written with AI assistance.

## Not found

- The helm-controller `driftDetection` landing version, Helm 4 server-side apply, and per-version history were not researched. The helm-controller `--override-manager` claim, stated as available since helm-controller v1.5.0, is therefore still unverified.
- No release older than v1.10.0 contains the flag, and no Kustomization spec page entry exists for it.

## Pages updated from this source

[[entities/flux]], [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]], [[findings/field-ownership-blocks-drift-correction]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[comparisons/ssa-conflict-policy-across-tools]], [[comparisons/exemption-and-ignore-controls-across-tools]], [[concepts/server-side-apply-and-field-ownership]], [[examples/flux-migration-from-client-side-apply-strands-removed-fields]], [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]]

## Pages created from this source

[[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]], [[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation]], [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[findings/flux-documents-its-override-manager-flags-on-the-controller-options-page-and-not-on-the-kustomization-spec-page]], [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]]
