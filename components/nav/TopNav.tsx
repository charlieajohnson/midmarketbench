"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/nav/ThemeToggle";

const links = [
  ["Leaderboard", "/"],
  ["Methodology", "/methodology"],
  ["Cases", "/cases"],
  ["Models", "/models"],
  ["About", "/about"],
] as const;

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="top-nav">
      <div className="shell-wide top-nav-inner">
        <Link className="wordmark" href="/">
          MidMarketBench
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              className="nav-link"
              href={href}
              data-active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
