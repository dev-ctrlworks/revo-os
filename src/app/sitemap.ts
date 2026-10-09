import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://revoos.app";
  const staticPaths = [
    "",
    "/dashboard",
    "/timeline",
    "/search",
    "/graph",
    "/settings",
    "/collections",
    "/capture",
    "/privacy",
    "/terms",
  ];

  return staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}