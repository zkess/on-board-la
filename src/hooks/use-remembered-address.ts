import { useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

const KEY = "on-board-la-session-address";

// Keep address context for direct page switches in this tab, not across visits.
export function useRememberedAddress(q: string) {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    try {
      if (q.trim().length >= 2) {
        sessionStorage.setItem(KEY, q);
        return;
      }
      const remembered = sessionStorage.getItem(KEY);
      if (!remembered || remembered.trim().length < 2) return;
      if (pathname !== "/explore" && pathname !== "/explore/" && pathname !== "/explore/checklist" && pathname !== "/explore/map") return;
      void navigate({
        to: pathname === "/explore/" ? "/explore" : pathname,
        search: (previous) => ({ ...previous, q: remembered }),
        replace: true,
      });
    } catch {
      // Navigation still works with explicit URL addresses if storage is blocked.
    }
  }, [q, navigate, pathname]);
}