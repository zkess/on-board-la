import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explore/guide")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/explore", search: { q: search.q }, replace: true });
  },
});
