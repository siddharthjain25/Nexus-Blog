import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

function parsePublishTimestamp(data: any): number {
  // Prefer explicit ISO datetime if provided
  if (data?.pubDatetime) {
    const t = new Date(data.pubDatetime).getTime();
    if (!Number.isNaN(t)) return t;
  }

  // Support split fields: pubDate (YYYY-MM-DD) and pubTime (HH:mm or HH:mm:ss, can include offset)
  if (data?.pubDate) {
    const time = data.pubTime ?? "00:00:00";
    const tz = data.pubTimezone ?? ""; // optional timezone/offset string like +05:30
    const datetime = `${data.pubDate}T${time}${tz}`;
    const t = new Date(datetime).getTime();
    if (!Number.isNaN(t)) return t;
  }

  // Fallback: treat as immediately published
  return 0;
}

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const publishTs = parsePublishTimestamp(data);
  const isPublishTimePassed =
    Date.now() > publishTs - SITE.scheduledPostMargin;

  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
