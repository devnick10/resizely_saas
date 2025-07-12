"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=" overflow-hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Resizely
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-md font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="text-md font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-md font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="hidden md:flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <ModeToggle />
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden p-4 pt-0 bg-background border-b">
          <nav className="flex flex-col gap-4 py-4">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
          </nav>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
