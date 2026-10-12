# GD Lab: architecture and geometric contract

The application extends the supplied PWA. The original course data, card identifiers, SRS implementation, reference geometry, seminar questions and illustrations are preserved. The original standalone `GD_Lab.html` remains in Git history and the repository as the supplied reference; the deployment contains the integrated `index.html` application only.

## Modules

| Module | Responsibility |
| --- | --- |
| `scripts/app.js` | Existing navigation, cards, seminar, examination, progress and backup; studio lifecycle |
| `scripts/math.js` | Pure vector operations, projections, Rodrigues rotations, intersections, special-case classification and development |
| `scripts/activities.js` | 23 activities, input bounds, source references, geometric models and construction requirements |
| `scripts/validation.js` | Analytic solution rules and validation of metric student data, independent of screen coordinates and Three.js |
| `scripts/scene.js` | WebGL solids, planes, projection rays, orbit/zoom, point movement, unfolding and transformations |
| `scripts/studio.js` | Manual construction, undo, persistence, feedback, solution consultation and SVG export |
| `scripts/geometry.js` | Unmodified validated reference models, accessible inside each laboratory |
| `sw.js` | Atomic local asset cache; no external CDN needed at runtime |

Three.js 0.180.0 and OrbitControls are vendored with their MIT license. The lockfile pins development dependencies. `npm ci` is needed for testing, not for serving the published application.

## Spatial and graphical coordinates

Spatial coordinates are `(x,y,z)` in metres. The board uses graphical `(u,v)`, right/up positive:

- H: `(-x,-y)`.
- V: `(-x,z)`.
- W: `(y,z)`.

Thus positive OX points left, positive H departure points down and positive W departure points right. H and V share OX. H and W retain the same signed departure; V and W retain the same elevation. Coincident graphical projections remain distinct labeled construction elements.

H is rotated around OX by `-t*pi/2`. W is rotated around OZ by `+t*pi/2`. V remains fixed. At `t=1`, all projected points lie on `y=0`, and their right/up coordinates are exactly the board mappings above. The 3D object's original point stays visible while its projections are transported; connecting segments during unfolding illustrate transport and are no longer claimed to be perpendicular to the rotated planes.

The plane `z=k*y` is rabatted onto H about OX by `-atan(k)`. For any point of the plane, the final ordinate is `y*sqrt(1+k*k)` and its elevation is zero. Rotation preserves distance to the hinge at every intermediate time.

For cylinder development, with `c=1-t`, the surface is `(R*sin(c*theta)/c, R*(1-cos(c*theta))/c, z)`. Its limit at `t=1` is `(R*theta,0,z)`. Generator length and local circumferential arc length are preserved. Cone development uses slant height `g=sqrt(R²+h²)` and final sector angle `2*pi*R/g`. Neither planar views nor camera perspective are claimed to be printable at a physical scale.

## Learning and validation

Students choose a target label and place it by pointer or accessible metric coordinate entry. Auxiliary points, lines, parallels, perpendiculars, line intersections, circles and clockwise arcs support construction. Named points can coincide. Undo stores up to 50 construction snapshots.

Validation uses stored metric coordinates, not screen pixels, raycasts or screenshot comparisons. It checks each required point, required joins, numerical answers, and H/V/W correspondence. Feedback reports signed directional corrections and the violated geometric rule. Default manual tolerance is 0.12 m; paper tasks use 0.5 mm. Numeric tolerance is the greater of 0.015 and 0.5% of the expected value. These are instructional tolerances, not surveying acceptance criteria.

Consulting a solution is recorded until the student starts a new construction. A correct assisted result does not earn an unassisted activity check. Existing completed laboratories remain completed; the new activity record is stored separately.

## Special cases

The model handles all four diedra, boundaries H/V/W, OX, both bisectors, coincident projections, absent or nonunique traces, coincident defining points, parallel and coincident lines, parallel/contained line-plane cases, zero plane normals, a plane coincident with H, OX-containing and OX-parallel planes, and the exception of parallel H/V traces for intersecting planes. Surface activities distinguish empty, tangent and real sphere sections, and clip sections to finite cones/cylinders. Conic classifications refer explicitly to the supporting infinite surface; the rendered object is finite.

## Persistence and deployment

`gd-lab-student-state` remains the storage key. Original fields and all 345 card IDs are retained. Added fields are `constructions` and `constructionChecks`. GD Carduri migration and JSON import are supported. Imports validate before replacing the live state; invalid JSON leaves existing data intact. A change of origin (including `file:` to GitHub Pages) requires export/import, because browser storage cannot cross origins automatically.

The build copies an explicit asset allowlist to `dist/`; source PDFs, local tooling, test fixtures and the original standalone HTML are excluded. GitHub Actions validates before publishing the build to Pages. Caches are scoped to the deployment URL. An update installs its entire new bundle before activation and does not clear localStorage.
