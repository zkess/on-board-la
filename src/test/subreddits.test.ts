import { describe, expect, it } from "vitest";
import { subredditsFor } from "@/lib/subreddits";

describe("neighborhood subreddit matching", () => {
  it("links Venice to the California Venice community", () => {
    expect(subredditsFor("Venice").map((s) => s.url)).toEqual(["https://www.reddit.com/r/venice/"]);
  });
  it("includes a shared community for Los Feliz", () => {
    expect(subredditsFor("Los Feliz Neighborhood Council").map((s) => s.name)).toEqual(["r/losfeliz", "r/edendale"]);
  });
  it("matches Greater Echo Park without matching unrelated neighborhoods", () => {
    expect(subredditsFor("Greater Echo Park Elysian").map((s) => s.name)).toEqual(["r/echopark", "r/edendale"]);
    expect(subredditsFor("Central Hollywood")).toEqual([]);
  });
  it("does not substitute a citywide community where none is verified", () => {
    expect(subredditsFor("Studio City")).toEqual([]);
  });
});