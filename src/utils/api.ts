import { BACKEND_URL } from "astro:env/server";

export async function fetchPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`);
    if (!res.ok) return [];
    const posts = await res.json();
    // Only show non-draft posts on frontend
    return posts
      .filter((p: any) => !p.draft)
      .map((post: any) => ({
        id: post.slug,
        data: post,
      }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchPost(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${slug}`);
    if (!res.ok) return null;
    const post = await res.json();
    
    // Don't allow viewing draft posts via direct URL
    if (post.draft) return null;

    return {
      id: post.slug,
      data: post,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}