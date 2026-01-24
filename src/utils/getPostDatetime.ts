import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SITE } from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function getPostDatetime(data: any): Date | null {
  if (!data) return null;

  // If an explicit Date is provided in frontmatter, prefer it
  if (data.pubDatetime) return new Date(data.pubDatetime);

  // Support split fields: pubDate (YYYY-MM-DD) and pubTime (HH:mm or HH:mm:ss)
  if (data.pubDate) {
    const time = data.pubTime ?? "00:00:00";
    const pubTimezone = data.pubTimezone ?? data.timezone ?? SITE.timezone ?? undefined;
    const dtStr = `${data.pubDate}T${time}`;

    try {
      // If an explicit offset like `+05:30` is provided, append it and use native Date parsing
      if (pubTimezone && /^[+-]\d{2}:\d{2}$/.test(pubTimezone)) {
        const parsed = new Date(`${dtStr}${pubTimezone}`);
        if (!Number.isNaN(parsed.getTime())) return parsed;
      }

      // Use dayjs.tz when a named timezone (e.g., 'Asia/Kolkata') or no offset is available
      const tz = pubTimezone || SITE.timezone;
      const parsed = dayjs.tz(dtStr, tz).toDate();
      if (!Number.isNaN(parsed.getTime())) return parsed;
    } catch {
      return null;
    }
  }

  return null;
}
