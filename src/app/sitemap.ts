import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://revoos.app";
  const staticPaths = [
    "",
    "/dashboard",
    "/library",
    "/timeline",
    "/ask",
    "/connections",
    "/settings",
    "/collections",
    "/capture",
    "/download",
    "/pricing",
    "/product/overview",
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