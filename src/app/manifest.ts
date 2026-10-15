import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Revo OS — your AI memory layer",
    short_name: "Revo OS",
    description:
      "Revo OS brings your notes, links, and files into one searchable memory, then answers questions in plain language.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbfd",
    theme_color: "#fcfbfd",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
