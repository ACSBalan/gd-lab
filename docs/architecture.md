# GD Lab: architecture and geometric contract

The application extends the supplied PWA. The 2026-10-12 audit corrects selected content and figures while preserving all card, exercise, exam and activity identifiers, the SRS implementation and validated reference calculations. See `audit-2026-10-12.md` for the change register. The original standalone `GD_Lab.html` remains in Git history and the repository as the supplied reference; the deployment contains the integrated `index.html` application only.

## Modules

| Module | Responsibility |
| --- | --- |
| `scripts/app.js` | Existing navigation, cards, seminar, examination, progress and backup; studio lifecycle |
| `scripts/math.js` | Pure vector operations, projections, Rodrigues rotations, intersections, special-case classification and development |
| `scripts/activities.js` | 23 activities, input bounds, source references, geometric models and construction requirements |
| `scripts/validation.js` | Analytic solution rules and validation of metric student data, independent of screen coordinates and Three.js |
| `scripts/scene.js` | WebGL solids, planes, projection rays, orbit/zoom, point movement, unfolding and transformations |
| `scripts/studio.js` | Manual construction, undo, persistence, feedback, solution consultation and SVG export |
| `scripts/geometry.js` | Validated reference calculations with audited labels and explanatory text |
| `scripts/board-labels.js` | Measured SVG label placement, bounds and coincidence groups |
| `sw.js` | Atomic local asset cache; no external CDN needed at runtime |

Three.js 0.180.0 and OrbitControls are vendored with their MIT license. The lockfile pins development dependencies. `npm ci` is needed for testing, not for serving the published application.

## Spatial and graphical coordinates

Spatial coordinates are `(x,y,z)` in metres. The board uses graphical `(u,v)`, right/up positive:

- H: `(-x,-y)`.
- V: `(-x,z)`.
- W: `(y,z)`.

Thus positive OX points left, positive H departure points down and positive W departure points right. H and V share OX. H and W retain the same signed departure; V and W retain the same elevation. Coincident graphical projections remain distinct construction elements and share a displayed label group. Students enter course coordinates `(x,y)`, `(x,z)` or `(y,z)` by default. Graphical `(u,v)` entry is explicitly available under Advanced.

H is rotated around OX by `-t*pi/2`. W is rotated around OZ by `+t*pi/2`. V remains fixed. At `t=1`, all projected points lie on `y=0`, and their right/up coordinates are exactly the board mappings above. The 3D object's original point stays visible while its projections are transported; connecting segments during unfolding illustrate transport and are no longer claimed to be perpendicular to the rotated planes.

The plane of end view `z=k*(x-xh)` is rabatted onto H about its trace `x=xh, z=0`, parallel to OY. The animation uses angle `atan(k)+pi` about positive OY, producing the opposite-side construction in Sârbu Fig. 5.4.3. The two accepted positions are `x0=xh ± (x-xh)*sqrt(1+k*k)`, `y0=y`, `z0=0`. Rotation preserves distance to the hinge at every intermediate time; feedback distinguishes the selected side. Points on the hinge have coincident alternatives. The `k=0` case is explained explicitly.

For cylinder development, with `c=1-t`, the surface is `(R*sin(c*theta)/c, R*(1-cos(c*theta))/c, z)`. Its limit at `t=1` is `(R*theta,0,z)`. Generator length and local circumferential arc length are preserved. Cone development uses slant height `g=sqrt(R²+h²)` and final sector angle `2*pi*R/g`. Neither planar views nor camera perspective are claimed to be printable at a physical scale.

## Learning and validation

Students choose a target label and place it by pointer or accessible metric coordinate entry. Auxiliary points, lines, parallels, perpendiculars, line intersections, circles and clockwise arcs support construction. Named points can coincide. Undo stores up to 50 construction snapshots.

Validation computes expected points independently of the renderer and compares stored metric coordinates. It checks each required point, required joins, numerical answers, and H/V/W correspondence. Feedback reports directional corrections, metric error and the violated geometric rule. The base point tolerance is 0.12 m, or 0.5 mm for paper tasks. Pointer tolerance is capped at 0.15 m (0.5 mm on paper). If 8 CSS pixels converted through the current SVG transform exceed that cap, pointer placements cannot pass: the board and feedback request zoom or numeric coordinate entry. Numeric entries retain the base tolerance and do not require zoom. A correct pointer point can be verified after sufficient zoom, but a geometric error above the cap cannot pass at any zoom. Numeric answer tolerance is the greater of 0.015 and 0.5% of the expected value. These are instructional tolerances, not surveying acceptance criteria.

Consulting a solution is recorded until the student starts a new construction. A correct assisted result does not earn an unassisted activity check. Existing completed laboratories remain completed; the new activity record is stored separately.

## Special cases

The model handles all four diedra, boundaries H/V/W, OX, both bisectors, coincident projections, absent or nonunique traces, coincident defining points, parallel and coincident lines, parallel/contained line-plane cases, zero plane normals, a plane coincident with H, OX-containing and OX-parallel planes, and the exception of parallel H/V traces for intersecting planes. Surface activities distinguish empty, tangent and real sphere sections, and clip sections to finite cones/cylinders. Conic classifications refer explicitly to the supporting infinite surface; the rendered object is finite.

## Persistence and deployment

`gd-lab-student-state` remains the storage key. Original fields and all 345 card IDs are retained. Added fields are `constructions` and `constructionChecks`. GD Carduri migration and JSON import are supported. Imports validate before replacing the live state; invalid JSON leaves existing data intact. A change of origin (including `file:` to GitHub Pages) requires export/import, because browser storage cannot cross origins automatically.

The build copies an explicit asset allowlist to `dist/`; source PDFs, local tooling, test fixtures and the original standalone HTML are excluded. GitHub Actions validates pull requests but deploys only main. A SHA-256 fingerprint of all published inputs replaces the worker's `__GD_BUILD_HASH__` placeholder. Thus even a data-only edit changes the worker and its scope-specific cache name. The development server performs the same substitution. Installation fetches the full bundle with HTTP-cache bypass before activation; old caches from the same scope are removed without clearing localStorage. An installed app displays a reload action when a new worker takes control. `build-info.json` records the actual output-file hashes, including the generated worker.
