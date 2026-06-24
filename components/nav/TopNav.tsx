"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["Leaderboard", "/"],
  ["Methodology", "/methodology"],
  ["Cases", "/cases"],
  ["Models", "/models"],
  ["About", "/about"],
] as const;

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const renderNavItems = () =>
    links.map(([label, href]) => {
      const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
      return (
        <Link
          key={href}
          className="nav-link"
          href={href}
          data-active={active}
          onClick={() => setOpen(false)}
        >
          {label}
        </Link>
      );
    });

  return (
    <header className="top-nav">
      <div className="shell-wide top-nav-inner">
        <Link className="wordmark" href="/">
          MidMarketBench
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {renderNavItems()}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav-drawer" data-open={open} aria-label="Mobile navigation">
        <div className="shell-wide mobile-nav-links">{renderNavItems()}</div>
      </nav>
    </header>
  );
}
