# Research dossier: gap cluster g3-flux-ssa-helm

Research date: 2026-11-26

## Overview

This pass settles one gap: the final name and semantics of the kustomize-controller flag proposed in issue 1722 and delivered through PR 1747. The wiki previously recorded only the issue thread. The shipped flag is `--override-manager-before-dry-run`, the same name the issue proposed. It landed in kustomize-controller v1.10.0 (release date 2026-10-24) and is bundled in Flux v2.10.0 (GitHub release published 2026-10-26).

The flag is a separate opt-in list, not a change to `--override-manager`. `--override-manager` still takes over the named managers only after a successful server-side apply dry-run. The new flag reclaims ownership before the dry-run, so an object wedged at dry-run validation by a stale co-owning manager can recover. The documentation warns that it transfers all fields owned by the listed managers, prunes fields missing from the source, and does not revert the managedFields change if the apply fails. Names are matched exactly, not by prefix. The source applies it to both Apply and Update operation types, and the default managers (kubectl, before-first-apply, the controller's own Update) stay on the post-dry-run path.

Scope note: the cluster focus also lists helm-controller driftDetection and Helm 4 server-side apply. The only gap assigned to this run is the Flux pre-dry-run takeover gap, so those were not researched here. They appear under "Not found" as not attempted.

Reading method: PR, issue and commit text came from `gh api` (raw JSON). The v1.10.0 README, `main.go`, `kustomization_controller.go` and CHANGELOG came from `gh api .../contents?ref=v1.10.0` (raw files at the tag). The fluxcd.io pages came from a web scrape (rendered text), so they count as the official docs site but are a scraped rendering. The fluxcd.io Kustomization spec page (`/flux/components/kustomize/kustomizations/`) was scraped in full and has no mention of `--override-manager`; flags are documented on the controller options page.

## Gap: Flux pre-dry-run manager takeover flag and current SSA documentation

Findings: PR 1747 ("Add pre-dry-run override manager takeover", author dipti-pai, merged 2026-10-23T10:14:24Z, merge commit cc6d0d33) added `--override-manager-before-dry-run` and wired it into `ssa.ApplyCleanupOptions.FieldManagersBeforeDryRun`. A second commit in the PR, by Stefan Prodan, trimmed the docs. The companion fluxcd/pkg PR 1276 ("ssa: Add pre-dry-run field manager takeover") merged 2026-10-23T09:54:25Z. Issue 1722 describes the scenario: a legacy controller's client-side PUT (operation Update) leaves a stale managedFields entry co-owning a container's name key but not its required image, so removing the container leaves `containers[N].image: Required value` and the dry-run fails on every reconcile. The issue also records the design reason for a separate list: a pre-dry-run takeover mutates ownership before validation, so an unrelated dry-run failure would leave ownership already reassigned.

Current documentation: the controller options docs (README at v1.10.0 and the fluxcd.io options page) describe `--override-manager` as "Field manager disallowed to perform changes on managed resources." and add a section "Override managers before dry-run" describing the new flag, its risks and exact-match naming. The Flux v2.10.0 release notes mention the flag under Kustomization. The code at v1.10.0 builds one Apply entry and one Update entry per named manager with `ExactMatch: true`, and the comment states the default managers are not included.

Wiki impact: the wiki sentence that the flag's final semantics were not verified can be replaced with the above. The flag is a recovery tool to be removed after the stuck objects reconcile, not a standing policy.

### Claims

1. The shipped flag is named `--override-manager-before-dry-run`, delivered by PR 1747, which fixes issue 1722.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/pull/1747
   - Version or date: merged 2026-10-23
   - Quote: "Add the --override-manager-before-dry-run flag, wiring the named field managers into ssa ApplyCleanupOptions.FieldManagersBeforeDryRun"

2. The existing `--override-manager` takeover runs only after a successful dry-run, which is why it cannot recover an object stuck at dry-run validation.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/pull/1747
   - Version or date: merged 2026-10-23
   - Quote: "The existing --override-manager takeover runs only after a successful dry-run, so it cannot recover an object wedged at dry-run validation"

3. The pre-dry-run list is kept separate from `--override-manager`, and the always-on default managers stay on the post-dry-run path.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/pull/1747
   - Version or date: merged 2026-10-23
   - Quote: "the always-on default managers stay on the post-dry-run cleanup path to preserve their transactional behavior"

4. The design rationale (discussed in the 6 August dev meeting) is that a pre-dry-run takeover changes ownership even if the dry-run then fails for an unrelated reason.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/issues/1722
   - Version or date: issue created 2026-08-06T23:25:13Z, closed 2026-10-23T10:14:26Z; meeting date quoted as August 6th, year not stated in the text [corrected in verification: issue created_at is 2026-08-06, same day as the quoted meeting, so the year is most likely 2026 but remains an inference]
   - Quote: "A pre-dry-run takeover mutates ownership first, so if the dry-run then fails for an unrelated reason"

5. Documentation states the takeover transfers all owned fields, prunes fields missing from the source, and is not reverted on apply failure; names match exactly.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/docs/README.md (section "Override managers before dry-run"); rendered at https://fluxcd.io/flux/components/kustomize/options/
   - Version or date: kustomize-controller v1.10.0
   - Quote: "The managedFields change is not reverted if the apply fails." and "Manager names are matched exactly, not by prefix."

6. Docs advise using it only to recover stuck objects and removing it afterwards.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/docs/README.md
   - Version or date: v1.10.0
   - Quote: "Use it only to recover stuck objects and remove it once they have reconciled"

7. The flag table in the docs describes `--override-manager` and the new flag.
   - Status: VERIFIED
   - URL: https://fluxcd.io/flux/components/kustomize/options/
   - Version or date: page scraped 2026-11-26 (rendered text of the v1.10.x docs)
   - Quote: "Field manager taken over before the server-side apply dry-run."

8. The code builds Apply and Update entries per named manager with exact matching and excludes default managers.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/internal/controller/kustomization_controller.go
   - Version or date: v1.10.0
   - Quote: "Taken over before the dry-run, so the default managers are not included."

9. The flag first shipped in kustomize-controller v1.10.0, release date 2026-10-24, in the Improvements list.
   - Status: VERIFIED
   - URL: https://github.com/fluxcd/kustomize-controller/blob/v1.10.0/CHANGELOG.md
   - Version or date: v1.10.0, release date 2026-10-24
   - Quote: "Add the `--override-manager-before-dry-run` flag"

10. Flux v2.10.0 release notes announce the flag under Kustomization; GitHub shows v2.10.0 published 2026-10-26 and v2.10.1 on 2026-11-20.
    - Status: VERIFIED
    - URL: https://github.com/fluxcd/flux2/releases/tag/v2.10.0
    - Version or date: v2.10.0, published 2026-10-26
    - Quote: "`--override-manager-before-dry-run` (`Kustomization`)"

11. The fluxcd/pkg change (PR 1276, "ssa: Add pre-dry-run field manager takeover") merged shortly before the controller PR.
    - Status: VERIFIED
    - URL: https://github.com/fluxcd/pkg/pull/1276
    - Version or date: merged 2026-10-23T09:54:25Z
    - Quote: "ssa: Add pre-dry-run field manager takeover"

12. The Kustomization spec page on fluxcd.io (v1 API) does not document `--override-manager`.
    - Status: VERIFIED (absence in the scraped page; searched for "override-manager" and found no hit)
    - URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
    - Version or date: scraped 2026-11-26
    - Quote: none (absence claim)

13. PR 1747 and docs were written with AI assistance (commit trailers "Assisted-by").
    - Status: VERIFIED
    - URL: https://github.com/fluxcd/kustomize-controller/pull/1747
    - Version or date: 2026-10-23
    - Quote: "Assisted-by: GitHub Copilot/Claude Opus 4.8"

## Not found

- helm-controller `driftDetection` landing version, Helm 4 server-side apply, and per-version history: not researched in this run, because only the takeover gap was assigned.
- Release version older than v1.10.0 containing the flag: none exists; the v1.10.0 changelog is the first entry. The comparison v1.9.6...v1.10.0 was listed, and the earlier v1.9.x changelog sections searched for "dry-run" mention no such flag.
- A fluxcd.io Kustomization spec page entry for the flag: searched the scraped spec page for "override-manager"; found nothing.
- The issue 1722 reporter's date: [corrected in verification: issue 1722 was created 2026-08-06T23:25:13Z and closed 2026-10-23T10:14:26Z, per gh api.]

## Verification notes

Re-fetched via gh api and fluxcd.io scrape on 2026-11-26. All 13 claims reproduced. Extra detail: the second PR 1747 commit (Stefan Prodan) carries trailer "Assisted-by: Claude Code/claude-opus-5-5", so AI assistance applies to the docs trim too. Release dates matched (kustomize-controller v1.10.0 2026-10-24; flux2 v2.10.0 2026-10-26, v2.10.1 2026-11-20). The v1.10.0 CHANGELOG also has a "### Kustomization" prose paragraph beyond the Improvements bullet. The fluxcd.io options page rendering contains the flag row and the "Override managers before dry-run" section.

## Removed in verification

None.
