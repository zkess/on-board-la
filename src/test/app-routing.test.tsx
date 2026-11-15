import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("preserves the selected address when navigating to the checklist", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const q = "13050 Borden Ave, Sylmar, Los Angeles";
    const dashboard = router.buildLocation({ to: "/explore", search: { q } });
    const checklist = router.buildLocation({
      to: "/explore/checklist",
      _fromLocation: dashboard,
    });

    expect(checklist.search).toMatchObject({ q });
    expect(router.matchRoutes(checklist.pathname, checklist.search).at(-1)?.search).toMatchObject({ q });

    const back = router.buildLocation({ to: "/explore", _fromLocation: checklist });
    expect(back.search).toMatchObject({ q });

    const replacement = router.buildLocation({
      to: "/explore",
      search: { q: "638 S Beacon St, San Pedro, Los Angeles" },
      _fromLocation: checklist,
    });
    expect(replacement.search).toMatchObject({ q: "638 S Beacon St, San Pedro, Los Angeles" });
  });
});
