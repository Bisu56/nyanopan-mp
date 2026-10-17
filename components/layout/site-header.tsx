"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { mainNavLinks, siteConfig } from "@/lib/site";
import { useCart } from "@/components/cart/cart-provider";

function isActivePath(pathname: string, href: string): boolean {
  const [path, query] = href.split("?");
  // The catalog links with filters share one pathname. Keep the general
  // Shop All link as the only active navigation item on that route.
  if (query) return false;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Responsive site header ported from the Stitch design (designs/src/components/Header.tsx).
 *
 * Porting decisions:
 * - `sticky` instead of `fixed`, so page content needs no magic top padding.
 * - The shopping bag is a link with the live item count; search and account
 *   icons remain omitted until their interactions are implemented.
 * - Category links point at `/products?category=...`; the catalog consumes that
 *   query parameter in Milestone 3.
 */
export function SiteHeader() {
  return (
    <Suspense fallback={<SiteHeaderFallback />}>
      <SiteHeaderContent />
    </Suspense>
  );
}

function SiteHeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-container-highest/50 bg-surface/95 shadow-[0_1px_8px_rgba(42,35,30,0.04)] backdrop-blur-md">
      <div className="w-full bg-surface-container-high px-4 py-1.5 text-center md:px-6">
        <p className="text-[11px] font-medium tracking-wide text-on-surface-variant md:text-xs">
          {siteConfig.announcement}
        </p>
      </div>
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
          {siteConfig.name}
        </Link>
        <span aria-hidden="true" className="h-8 w-8 rounded-full bg-surface-container" />
      </Container>
    </header>
  );
}

function SiteHeaderContent() {
  const pathname = usePathname();
  const { itemCount, ready } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleHistoryNavigation() { setMobileMenuOpen(false); }
    window.addEventListener("popstate", handleHistoryNavigation);
    return () => window.removeEventListener("popstate", handleHistoryNavigation);
  }, []);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-container-highest/50 bg-surface/95 shadow-[0_1px_8px_rgba(42,35,30,0.04)] backdrop-blur-md">
      {/* Announcement bar */}
      <div className="w-full bg-surface-container-high px-4 py-1.5 text-center md:px-6">
        <p className="text-[11px] font-medium tracking-wide text-on-surface-variant md:text-xs">
          {siteConfig.announcement}
        </p>
      </div>

      <Container className="flex h-20 items-center justify-between gap-4">
        {/* Brand wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed"
          >
            <span className="h-3.5 w-3.5 rounded-full bg-primary transition-transform group-hover:scale-110" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1.5 px-2 py-1 lg:flex"
        >
          {mainNavLinks.map((link) => {
            const isActive = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Utilities */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/cart"
            aria-label={ready && itemCount > 0 ? `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Shopping bag"}
            className={`relative rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActivePath(pathname, "/cart")
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <ShoppingBag aria-hidden className="h-[22px] w-[22px]" />
            {ready && itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold leading-none text-white"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            ref={menuButton}
            type="button"
            className="rounded-lg p-2 text-on-surface-variant hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X aria-hidden className="h-6 w-6" />
            ) : (
              <Menu aria-hidden className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-b border-surface-container-highest bg-surface px-4 py-4 shadow-lg lg:hidden"
        >
          <ul className="space-y-1">
            {mainNavLinks.map((link) => {
              const isActive = isActivePath(pathname, link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? "bg-surface-container text-primary"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
