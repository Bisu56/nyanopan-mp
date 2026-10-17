import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/cart", "/checkout", "/orders/confirmation/"],
    },
    sitemap: `${siteConfig.url.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
