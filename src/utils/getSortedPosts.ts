import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import getPostDatetime from "./getPostDatetime";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  const toTs = (d?: Date | null) => Math.floor(new Date(d ?? 0).getTime() / 1000);

  const getPostTs = (post: CollectionEntry<"blog">) =>
    Math.floor((getPostDatetime(post.data)?.getTime() ?? 0) / 1000) || 0;

  return posts
    .filter(postFilter)
    .sort((a, b) => getPostTs(b) - getPostTs(a));
};

export default getSortedPosts;
