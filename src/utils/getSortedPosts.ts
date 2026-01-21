import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  const toTs = (d?: Date | null) => Math.floor(new Date(d ?? 0).getTime() / 1000);

  return posts
    .filter(postFilter)
    .sort((a, b) =>
      toTs(b.data.modDatetime ?? b.data.pubDatetime) -
      toTs(a.data.modDatetime ?? a.data.pubDatetime)
    );
};

export default getSortedPosts;
