import rss from "@astrojs/rss";
import { SITE } from "@/config";
import { fetchPosts } from "@/utils/api";
import getPostDatetime from "@/utils/getPostDatetime";

export async function GET() {
  const posts = await fetchPosts();
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: posts.map(({ data, id }) => ({
      link: `/posts/${id}/`,
      title: data.title,
      description: data.description,
      pubDate: getPostDatetime(data) ?? new Date(),
    })),
  });
}
