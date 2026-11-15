import { CHECKLIST, type ChecklistItem } from "@/lib/la-data";
import type { Lookup } from "@/lib/la.functions";
import { hyperlocalFor } from "@/lib/newsletters";
import { subredditsFor } from "@/lib/subreddits";
import { hasTrashSchedule } from "@/lib/sanitation";

const cityIds = new Set(["notifyla", "311", "ladwp", "sweep", "lapl", "cd", "compost", "nc", "council"]);
export type LocalChecklistItem = ChecklistItem & { cityOnly: boolean; resources?: { name: string; url: string }[] };

/** Personalization reuses the dashboard lookup; outside-city addresses get regional essentials only. */
export function checklistFor(data: Lookup) {
  return CHECKLIST.map((phase) => ({
    ...phase,
    items: phase.items.filter((item) => data.status !== "outside" || !cityIds.has(item.id)).map((item): LocalChecklistItem => {
      const result: LocalChecklistItem = { ...item, cityOnly: cityIds.has(item.id) };
      if (data.status !== "ok") return result;
      if (item.id === "cd" && data.council) {
        result.text = `Subscribe to Councilmember ${data.council.member}'s newsletter (CD ${data.council.district})`;
        result.link = data.council.url;
        result.tip = "Visit your Councilmember's office website for newsletter signup and local updates.";
      }
      if (item.id === "nc" && data.nc) {
        result.text = `Attend a ${data.nc.name} meeting`;
        const meetingLink = data.nc.empowerla || data.nc.website;
        if (meetingLink) result.link = meetingLink;
        result.tip = "Check the council's meeting calendar and agenda. Anyone who lives here can speak.";
      }
      if (item.id === "news") {
        const local = hyperlocalFor(data.nc?.name ?? "", data.nc?.region ?? "");
        const communities = subredditsFor(data.neighborhood ?? data.nc?.name ?? "");
        result.resources = [...local, ...communities].map(({ name, url }) => ({ name, url }));
      }
      if (item.id === "sweep" && hasTrashSchedule(data.trashDay)) {
        result.tip = `${data.approximate ? "Approximate street lookup" : "City pickup lookup"}: trash collection is ${data.trashDay}. Street sweeping has a separate schedule—check your block's signs and route.`;
      }
      return result;
    }),
  }));
}