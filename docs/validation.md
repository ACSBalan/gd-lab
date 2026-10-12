# Technical validation report

Validation executed on 11–12 October 2026 (Europe/London). This report distinguishes measured results from device checks that remain outstanding.

## Baseline and preservation

The repository initially contained the uploaded top-level files but lacked `data/`, `scripts/`, `images/` and `icons/`, which `index.html` required. Those directories were restored from the supplied GD_Lab_PWA.zip. The initial remote commit was `7114242dc0247754b7abda059332fb73826df057`.

SHA-256 comparisons against the supplied archive passed for the course bundle, cards JSON, examination data, seminar JSON, original geometry engine, original practice helper, SRS module and all 14 illustrations. The expected hashes are committed in `tests/baseline-hashes.json`.

Counts verified by executable tests: **10 units, 345 unique flashcard IDs, 38 seminar exercises, 14 illustrations, 50 examination questions**, with five examination questions per unit. The integrated studio adds **23 activities** without rebuilding this content.

## Executed checks

Environment: Windows, Node.js 24.19.0, Playwright 1.56.1, Chromium 141.0.7390.37 with WebGL enabled using software rendering for reproducibility. The CI configuration uses Node.js 22 and Ubuntu; its outcome must be read from the corresponding GitHub Actions run rather than inferred from this local run.

| Category | Executed evidence | Result |
| --- | --- | --- |
| Analytic mathematics and preservation | `npm test`: 18 tests | 18 passed, 0 failed |
| Browser and actual rendering | `npm run test:browser`: 11 tests | 11 passed, 0 failed |
| Deployment build | `npm run build` | 39 copied assets; build-info.json records content hashes |
| Source syntax | Node syntax checks for changed application, studio and scene modules | Passed |
| Visual inspection | Desktop epure, mobile layout, unfolded planes and correlated-view screenshots | Inspected; small diagram labels were enlarged during correction |

### Mathematics

The suite tests signed H/V/W mappings and exact endpoints of both plane rotations for positive, zero and negative coordinates. Intermediate rotations preserve pairwise distances and points on their hinge axes. It checks four diedra, boundaries, both bisectors and the OX-to-W origin exception.

Independent fixtures verify traces, central projection, line intersections, parallel/coincident/contained cases, intersecting planes whose H/V traces are parallel, plane rabatment, sphere tangent/exterior cases, cylinder development isometry, cone sector radius and metre-to-paper-millimetre conversions. General plane traces satisfy their plane equations, including OX exceptions. Every activity accepts its analytic construction and rejects an intentionally shifted point. Bounded parameter extrema are checked for non-finite target and model coordinates.

The validator does not reuse WebGL or SVG coordinates. Its projection and transformation solution rules are implemented separately from the renderer; invariant/numeric fixture tests provide an additional check against common sign errors. This does not constitute formal proof of every possible input combination.

### Rendered geometry and interface

The browser suite creates the actual Three.js scene and checks the positions of rendered projection meshes after unfolding, then checks their camera-space alignment. Screenshots before and after orbit/zoom must differ. Visibility controls, final unfolding position and completed transformation animation are exercised.

All 23 activities are opened through the app, with WebGL canvas and construction board present and no uncaught JavaScript errors. A manually entered n/n′/n″ construction is rejected for an incorrect sign and accepted after correction; the rendered SVG coordinates satisfy the common abscissa/elevation conditions. Pointer-selected line intersection and undo are exercised. Special presets include a coincident projection plane, a zero normal and the second bisector. Solution consultation remains recorded after a parameter change and cannot silently earn an unassisted completion.

The viewport test uses 390×844 CSS pixels and checks horizontal overflow plus accessible numeric point placement. It is a Chromium viewport check, not a physical iPhone or Safari test. Desktop screenshots use 1440×1000.

### Persistence and offline behavior

Tests verify that existing scheduled card progress survives studio navigation, a construction survives navigation and reload, and JSON export/import preserves construction points, card scheduling, exercise notes and daily settings. Invalid JSON is rejected without altering stored progress. Original identifiers and the SRS implementation remain byte-identical.

The offline test waits for the service worker to control the page, confirms all 14 illustrations and the local Three.js module are cached, disables the browser network, reloads, and opens all ten laboratories. A reference PNG is then fetched successfully from the offline cache. No external runtime CDN is used.

The first GitHub Linux run passed the mathematical tests and 10 of 11 browser tests. Its invalid-import assertion also compared the incidental autosave timestamp, which changed while the actual progress remained identical. That assertion now compares every progress field while excluding only `savedAt`; no geometry or persistence requirement was removed. The subsequent Actions run is the authoritative CI result.

## Scope and remaining device verification

- Physical iPhone installation, standalone launch after terminating Safari, airplane-mode relaunch, touch gestures and persistence across OS storage management require confirmation on the user's device.
- Firefox, Safari/WebKit, Android hardware and hardware-specific WebGL behavior were not executed in this local test run.
- The original validated course material and illustrations were preserved, not independently re-certified line by line. This implementation checked the source convention for H/W unfolding and used the supplied academic support for the added analytic activities.
- Validation covers constructions entered into the application. Photographed handwritten epures and arbitrary freehand curves are not automatically graded.
- Surface sections are sampled from analytic equations for rendering; displayed finite cone/cylinder sections are clipped to the finite object. The analytic endpoints and required construction results use equations, not sampled pixels.
- GitHub Pages publication is confirmed only when the deployment workflow succeeds and the public URL serves the integrated application. Repository write access alone does not activate Pages.

See [architecture](architecture.md) for formulas, tolerances and persistence details and [curriculum](curriculum.md) for the per-unit activity map. GitHub Actions uploads its browser report, traces on failure and screenshots as a separate validation artifact for each run.
