/** Curated neighborhood communities; evidence links identify their LA coverage. */
export const NEIGHBORHOOD_SUBREDDITS = [
  { name: "r/venice", url: "https://www.reddit.com/r/venice/", about: "Venice, Los Angeles", neighborhoods: ["venice"], source: "https://www.reddit.com/r/venice/comments/1l93pva/best_local_spots_to_chill_in_venice_ca/" },
  { name: "r/losfeliz", url: "https://www.reddit.com/r/losfeliz/", about: "Los Feliz", neighborhoods: ["los feliz"], source: "https://www.reddit.com/r/losfeliz/comments/1ufrea7/what_are_the_best_daily_food_deals_when_we_gotta/" },
  { name: "r/echopark", url: "https://www.reddit.com/r/echopark/", about: "Echo Park", neighborhoods: ["echo park"], source: "https://www.reddit.com/r/echopark/comments/1coaohc/echo_park_area_bars_and_restaurants/" },
  { name: "r/edendale", url: "https://www.reddit.com/r/edendale/", about: "Los Feliz, Silver Lake, Echo Park & Atwater Village", neighborhoods: ["los feliz", "silver lake", "echo park", "atwater village"], source: "https://www.reddit.com/r/LosAngeles/comments/1cr9drz/a_subreddit_for_edendale/" },
] as const;

export function subredditsFor(ncName: string) {
  const normalized = ncName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return NEIGHBORHOOD_SUBREDDITS.filter((community) =>
    community.neighborhoods.some((neighborhood) => ` ${normalized} `.includes(` ${neighborhood} `)),
  );
}