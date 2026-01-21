export const SITE = {
  website: "https://blog.siddharth.is-a.dev",
  author: "Siddharth Jain",
  profile: "https://siddharth.is-a.dev/",
  desc: "A personal blog about programming, technology, and life.",
  title: "Nexus",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 0, // no early visibility margin
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/siddharthjain25/Nexus-Blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
