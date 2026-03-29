import type { APIRoute } from "astro";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";
import { fetchPost } from "@/utils/api";

export const GET: APIRoute = async ({ params }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const post = await fetchPost(slug);
  if (!post || post.data.ogImage) {
    return new Response("Not found or has static image", { status: 404 });
  }

  const buffer = await generateOgImageForPost(post as any);
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
};
