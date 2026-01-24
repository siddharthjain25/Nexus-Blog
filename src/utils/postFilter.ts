import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import getPostDatetime from "./getPostDatetime";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const dt = getPostDatetime(data);
  const publishTs = dt ? dt.getTime() : 0;
  const isPublishTimePassed = Date.now() > publishTs - SITE.scheduledPostMargin;

  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
