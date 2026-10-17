"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function ProductPhoto({
  src,
  alt,
  sizes,
  className = "object-cover",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div role="img" aria-label={alt || "Product photo unavailable"} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-fixed/60 via-surface-container-low to-secondary-container/50 text-on-surface-variant">
    <ImageOff aria-hidden className="h-8 w-8 opacity-70" />
    <span className="text-xs font-medium">Product photo unavailable</span>
  </div>;
  return <Image src={src} alt={alt} fill unoptimized priority={priority} sizes={sizes} onError={() => setFailed(true)} className={className} />;
}
