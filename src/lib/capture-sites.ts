import { hostnameOf, safeExternalUrl } from "./safe-url";

export interface SampleSite {
  hostname: string;
  title: string;
  domain: string;
  excerpt: string;
  tags: string[];
  collection: string;
}

export const sampleSites: SampleSite[] = [
  {
    hostname: "thekestrelsummit.com",
    title: "The Kestrel Summit — Modern 1BR & 2BR Apartments",
    domain: "thekestrelsummit.com",
    excerpt:
      "New building (2025). 1BR from $2,150, 2BR from $2,900. Rooftop pool, co-working lounge, dog park, in-unit laundry, 12 min walk to Caltrain. Pet friendly. Move-in special: 1 month free on 12-month leases.",
    tags: ["apartment", "summit"],
    collection: "Apartment search",
  },
  {
    hostname: "store.sony.com",
    title: "Sony A7 IV Full-Frame Mirrorless Camera",
    domain: "store.sony.com",
    excerpt:
      "33MP full-frame BSI CMOS · 4K 60p 10-bit 4:2:2 · 759-point autofocus. $2,499 body only. In stock, ships free. Compatible with Tamron E-mount f/2.8 primes.",
    tags: ["camera", "gear"],
    collection: "Camera research",
  },
  {
    hostname: "japan-guide.com",
    title: "Gora Kadan — Hakone Luxury Ryokan Guide",
    domain: "japan-guide.com",
    excerpt:
      "Private in-room onsen, half-board kaiseki dinner, mountain gardens. ~$480/night. 90 min from Tokyo via Odakyu Romancecar. Seasonal reservations open 6 months ahead — October window opens this month.",
    tags: ["japan", "travel"],
    collection: "Japan trip",
  },
  {
    hostname: "photographylife.com",
    title: "Nikon Z6 III Review: The Hybrid That Finally Delivers",
    domain: "photographylife.com",
    excerpt:
      "Partially stacked 24.5MP sensor, 120 fps EVF, 6K60 RAW. $2,499. 14MB/s readout. Strong autofocus with subject detection; slight rolling shutter on full-res bursts.",
    tags: ["camera", "gear"],
    collection: "Camera research",
  },
  {
    hostname: "barnesandnoble.com",
    title: "Studio Ghibli 4K Collection — 40th Anniversary Edition",
    domain: "barnesandnoble.com",
    excerpt:
      "All 11 films in 4K UHD, includes 'Moss green' slipcase. On sale $149 (reg $199). Reviews call the masters excellent. Tempting restock for movie night.",
    tags: ["entertainment", "movies"],
    collection: "Entertainment",
  },
  {
    hostname: "summitparks.org",
    title: "Summit Community Center — Watercolor Workshops",
    domain: "summitparks.org",
    excerpt:
      "Beginner Studio every Saturday 10am–1pm, $35/drop-in, supplies included. Next: 'Plein air watercolor at Pinecrest' on June 8. A perfect gift session for Jane plus a brush set stays under $150.",
    tags: ["gift", "jane", "classes"],
    collection: "Ideas",
  },
];

export function normalizeUrl(raw: string): string {
  return safeExternalUrl(raw) ?? "";
}

export { hostnameOf };

export function inferSite(rawUrl: string): SampleSite {
  const url = normalizeUrl(rawUrl);
  const host = hostnameOf(url);
  const sample = sampleSites.find((s) => host.includes(s.hostname));
  if (sample) return sample;
  return {
    hostname: host,
    title: `Web page — ${host}`,
    domain: host,
    excerpt: `Clipped from ${host}. In the full product the extension saves the full article text, images, and a readable snapshot for offline reference.`,
    tags: [],
    collection: "New captures",
  };
}