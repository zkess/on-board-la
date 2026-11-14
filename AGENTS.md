<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Address lookups run in a server function (OpenStreetMap geocoding + LA City GeoHub boundary layers) so third-party calls stay off the browser and need no keys.
- Address autofill uses Photon (komoot) through a server function, debounced; Nominatim forbids autocomplete use, so it stays for final lookups only.
- Numbered address searches require matching house numbers in suggestions and final geocoding; never substitute street centroids because civic boundaries may differ along a street.
- The map uses Leaflet with OpenStreetMap tiles, loaded lazily behind ClientOnly because Leaflet touches `window` on import.
- Neighborhood history facts live in src/data/neighborhood-facts.json (exported from the old table), each carrying its source credit, so they can be audited and edited without admin credentials.
- Neighborhood subreddit links use a curated directory with coverage evidence and neighborhood-name matching, not regional fallbacks, to avoid unrelated communities.
- The neighborhood dashboard lives at /explore with shared content panels outside the routes; /explore/guide redirects there to preserve old links.
- Header neighborhood matching runs server-side against bundled original Mapping L.A. V6 GeoJSON using Turf point-in-polygon; return it separately from EmpowerLA council data; the server does no council-name inference, and only the Hero component falls back to the council name when no Times polygon matches.
- Streets and sanitation guidance lives in an expandable SanitationDetails component with official source links, keeping the address-specific pickup summary visible.
- Visual palette and typography are mapped centrally through semantic CSS tokens; header photo captions use solid surfaces for contrast without changing the page structure.
- Imported homepage references are recreated in the native index route with home-scoped styles and shared address search, so exported scripts cannot replace application behavior or alter dashboard styling.
- The /audit page reads the same data modules and lookup function as the dashboard so reviewers see exactly what users see.
