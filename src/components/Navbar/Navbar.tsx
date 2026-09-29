"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  X,
  ArrowUpRight,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import "./navbar.css";

/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "Cover Stories",
    href: "/#cover-stories",
  },
  {
    label: "Articles",
    href: "/#articles",
  },
  {
    label: "Magazines",
    href: "/#magazines",
  },
  {
    label: "Categories",
    href: "/#categories",
  },
  {
    label: "Hall of Fame",
    href: "/#hall-of-fame",
  },
  {
    label: "Awards",
    href: "/#awards",
  },
  {
    label: "Podcasts",
    href: "/#podcasts",
  },
];

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navbarRef = useRef<HTMLElement | null>(null);

  /* =======================================================
     SECTION NAVIGATION
  ======================================================= */

  const handleSectionNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMenuOpen(false);

    if (!href.startsWith("/#")) return;

    const hash = href.substring(1);
    const targetId = hash.substring(1);
    const target = document.getElementById(targetId);

    // When the section exists on the current page,
    // scroll directly to it.
    if (window.location.pathname === "/" && target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Keep the URL in sync with the section.
      window.history.pushState(null, "", hash);
    }
  };

  /* =======================================================
     SCROLL STATE
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     NAVBAR HEIGHT
  ======================================================= */

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (!navbarRef.current) return;

      const height =
        navbarRef.current.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        "--navbar-height",
        `${height}px`
      );
    };

    updateNavbarHeight();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateNavbarHeight();
      });

      if (navbarRef.current) {
        resizeObserver.observe(navbarRef.current);
      }
    }

    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  /* =======================================================
     MOBILE BODY LOCK
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* =======================================================
     CLOSE MOBILE MENU ON DESKTOP
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          DESKTOP NAVBAR
      ===================================================== */}

      <motion.header
        ref={navbarRef}
        className={`navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        initial={{
          y: 0,
          opacity: 1,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
      >
        <div className="navbar-inner">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="navbar-brand"
            aria-label="ICONIQ SPHERE home"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <Image
              src="/iconiq-sphere-logo.svg"
              alt="ICONIQ SPHERE"
              width={260}
              height={95}
              priority
              className="navbar-logo"
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="navbar-nav"
            aria-label="Main navigation"
          >
            {/* HOME */}

            <Link
              href="/#home"
              className="navbar-link navbar-link-active"
              onClick={(event) =>
                handleSectionNavigation(event, "/#home")
              }
            >
              <span>Home</span>

              <motion.span
                className="navbar-active-line"
                layoutId="navbar-active-line"
              />
            </Link>

            {/* REMAINING NAVIGATION */}

            {navItems
              .filter((item) => item.label !== "Home")
              .map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="navbar-link"
                  onClick={(event) =>
                    handleSectionNavigation(event, item.href)
                  }
                >
                  <span>{item.label}</span>
                </Link>
              ))}
          </nav>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="navbar-actions">

            {/* SEARCH */}

            <button
              className="navbar-search"
              aria-label="Search"
              type="button"
            >
              <Search
                size={20}
                strokeWidth={1.8}
              />
            </button>

            {/* SUBMIT */}

            <Link
              href="/submit-story"
              className="navbar-submit"
              onClick={() => setMenuOpen(false)}
            >
              <span>SUBMIT YOUR STORY</span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
              />
            </Link>

            {/* MOBILE MENU */}

            <button
              className="navbar-menu-button"
              type="button"
              aria-label={
                menuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((value) => !value);
              }}
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{
                      rotate: -90,
                      opacity: 0,
                    }}
                    animate={{
                      rotate: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotate: 90,
                      opacity: 0,
                    }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{
                      rotate: 90,
                      opacity: 0,
                    }}
                    animate={{
                      rotate: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotate: -90,
                      opacity: 0,
                    }}
                  >
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* =====================================================
          NAVBAR SPACER
      ===================================================== */}

      <div
        className="navbar-spacer"
        aria-hidden="true"
      />

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <div className="mobile-menu-inner">

              <div className="mobile-menu-label">
                <span>
                  EXPLORE ICONIQ SPHERE
                </span>

                <span className="mobile-menu-line" />
              </div>

              <nav className="mobile-nav">

                {navItems.map((item, index) => (
                  <Fragment key={item.label}>
                    <Link
                      href={item.href}
                      onClick={(event) =>
                        handleSectionNavigation(
                          event,
                          item.href
                        )
                      }
                      className="mobile-nav-link"
                    >
                      <span className="mobile-nav-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>{item.label}</span>

                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.7}
                      />
                    </Link>
                  </Fragment>
                ))}

              </nav>

              <Link
                href="/submit-story"
                className="mobile-submit"
                onClick={() => setMenuOpen(false)}
              >
                <span>Submit Your Story</span>

                <ArrowUpRight size={18} />
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}