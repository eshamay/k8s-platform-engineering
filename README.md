# k8s-platform-engineering

A research wiki on Kubernetes platform engineering: the Kubernetes Resource Model, API machinery, controllers and operators, and the abstractions built on them (Flux, Crossplane, kro and their neighbors). The wiki is maintained with the `sticki-wiki` plugin; see `CLAUDE.md` for its schema and write rules.

This one repository does two jobs:

1. **The whole project.** Everything tracked here is the wiki: `raw/` sources, `sources/`, `concepts/`, `entities/`, `examples/`, `comparisons/`, `decisions/`, `findings/`, the anchor files, `workflows/`, and the machine-readable `.sticki/` surface.
2. **A published site.** The seven documents in `outputs/` (a five-part tutorial series and ramp-up guides for Flux and Crossplane) are published with GitHub Pages at https://eshamay.github.io/k8s-platform-engineering/.

There is exactly one remote, `origin`, pointing at this repository. The site is built from `main` by GitHub Actions; there is no separate site repository or branch.

## Read the site locally

```
bundle install
./bin/serve
```

Then open http://127.0.0.1:4000/k8s-platform-engineering/. The script regenerates `build/` from the wiki and serves it with Jekyll. Jekyll watches `build/`, not the wiki, so run `./bin/serve` again (or `python3 bin/build_site.py`) after editing a page.

To check that every link resolves before publishing:

```
python3 bin/build_site.py --strict
```

## What gets published

Only `outputs/` is published (`publish_dirs` in `.sticki-publish.json`). A wiki link from an output to any other page opens that page in the repository on GitHub. The navigation order of the documents comes from `nav_order_stems` in the same file.

Pages with a status that is not listed in `publish_status` are left out. During review the list includes `draft`; remove it, and promote the outputs to `status: active`, to publish only reviewed documents.

`bin/build_site.py` is the plugin's script with one local patch, the `nav_order_stems` ordering option, marked in the source.

## Publish

Pushing to `main` with a change under `outputs/` (or to the publish config, the build script, the Gemfile, or the workflow) runs `.github/workflows/pages.yml`, which builds with `--strict` and deploys to Pages. You can also run it by hand from the Actions tab. One-time setting: Settings, Pages, Source = GitHub Actions.

Every action in the workflow is pinned to a full commit SHA. Update the SHAs deliberately.

## Commit identity

Commits are authored as Eric Shamay and signed with the GPG key configured in this repository's local git config.

## Links in the wiki

GitHub does not render wikilinks, so links in the wiki are stored as relative Markdown links. The sticki skills still write `[[wikilinks]]`; after any operation that writes pages run:

```
python3 -I bin/gh_links.py --write    # convert wikilinks
python3 -I bin/gh_links.py --check    # verify every link and anchor (exit 0 means clean)
```

`outputs/` and `raw/` are not converted (the Pages build resolves the wikilinks in `outputs/`). After closing a gap or todo, `python3 -I bin/gh_links.py --refresh-anchors` repairs anchors whose heading status suffix changed.

## Sidebar sections

Each published document expands in the left sidebar into its numbered sections. `bin/build_site.py` writes a `sections` list (one entry per `##` heading) into each page when `"nav_sections": true` is set in `.sticki-publish.json`, and `site_overlay/` (copied into `build/` on every build) holds the theme overrides that render it: `_includes/components/nav/links.html` is a copy of the just-the-docs 0.10.1 file with the section list added (re-diff it when the theme version in `Gemfile.lock` changes), `_includes/footer_custom.html` expands the open document and highlights the section being read, and `_includes/head_custom.html` holds the styling.

## Writing a new output

New outputs follow `methodologies/writing-ramp-up-outputs.md`. Run the workflow with a topic, a slug and a group (`workflows/write-ramp-up-output.js`, args `topic`, `slug`, `title`, `group`, `today`); it writes a draft into `outputs/`. Check any output with `python3 -I bin/lint_outputs.py`, which fails on versions, dates, issue and commit references, banned words and revision wording.

## Figures

Diagrams live in `outputs/figures/` as an editable `<name>.excalidraw` (open it at https://excalidraw.com or in Obsidian) and the `<name>.svg` render that documents embed. Both come from one layout script. See `methodologies/writing-ramp-up-outputs.md`.
