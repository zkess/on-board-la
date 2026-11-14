import { useEffect, useState } from "react";
import { Sunset } from "lucide-react";
import { sunsetLabel } from "@/lib/sunset";

export function SunsetChip() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(sunsetLabel(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  if (!time) return null;
  return <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-soft"><Sunset className="h-5 w-5 shrink-0 text-sunset" />Sunset today at {time}</span>;
}