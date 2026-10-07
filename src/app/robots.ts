import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://revoos.ctrlworks.co/sitemap.xml",
    host: "https://revoos.ctrlworks.co",
  };
}