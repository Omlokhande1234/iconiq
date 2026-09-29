"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FileText,
  BookOpen,
  Library,
  Award,
  Search,
  Bell,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Clock3,
  BarChart3,
  Megaphone,
} from "lucide-react";

import styles from "./dashboard.module.css";

/* =========================================================
   STATISTICS
========================================================= */

const stats = [
  {
    label: "Articles",
    value: "128",
    change: "+12",
    icon: FileText,
  },
  {
    label: "Cover Stories",
    value: "24",
    change: "+4",
    icon: BookOpen,
  },
  {
    label: "Magazines",
    value: "18",
    change: "+2",
    icon: Library,
  },
  {
    label: "Awards",
    value: "36",
    change: "+6",
    icon: Award,
  },
];

/* =========================================================
   RECENT CONTENT
========================================================= */

const recentContent = [
  {
    title: "The Future of African Enterprise",
    type: "Cover Story",
    status: "PUBLISHED",
    date: "02 Sep 2026",
  },
  {
    title: "Leadership in a Changing World",
    type: "Article",
    status: "PUBLISHED",
    date: "01 Sep 2026",
  },
  {
    title: "Innovators & Influencers",
    type: "Magazine",
    status: "DRAFT",
    date: "30 Aug 2026",
  },
  {
    title: "Global Business Excellence Awards",
    type: "Award",
    status: "PUBLISHED",
    date: "28 Aug 2026",
  },
  {
    title: "The Next Wave of Technology",
    type: "Article",
    status: "DRAFT",
    date: "27 Aug 2026",
  },
];

/* =========================================================
   RECENT ACTIVITY
========================================================= */

const recentActivity = [
  {
    title: "New article published",
    subtitle: "The Future of African Enterprise",
    time: "10:24 AM",
  },
  {
    title: "Magazine updated",
    subtitle: "Innovators & Influencers",
    time: "Yesterday",
  },
  {
    title: "New award added",
    subtitle: "Global Business Excellence Awards",
    time: "02 Sep 2026",
  },
  {
    title: "Podcast published",
    subtitle: "Leadership in Focus · Ep. 12",
    time: "01 Sep 2026",
  },
];

/* =========================================================
   QUICK ACTIONS
========================================================= */

const quickActions = [
  ["New Article", "/admin/articles/add"],
  ["New Magazine", "/admin/magazines/add"],
  ["New Cover Story", "/admin/cover-stories/add"],
  ["New Award", "/admin/awards/add"],
  ["New Podcast", "/admin/podcasts/add"],
  ["New Category", "/admin/categories/add"],
];

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileNavItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: FileText,
  },
  {
    label: "Articles",
    href: "/admin/articles/view",
    icon: FileText,
  },
  {
    label: "Cover Stories",
    href: "/admin/cover-stories/view",
    icon: BookOpen,
  },
  {
    label: "Magazines",
    href: "/admin/magazines/view",
    icon: Library,
  },
  {
    label: "Awards",
    href: "/admin/awards/view",
    icon: Award,
  },
];

/* =========================================================
   DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("iconiq_admin_logged_in") === "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    setIsLoggedIn(true);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className={styles.authLoading}>
        <div className={styles.authLoadingText}>
          Verifying authorization...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.dashboardShell}>
      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <header className={styles.topHeader}>
        <div className={styles.topHeaderSearch}>
          <Search size={16} strokeWidth={1.7} />

          <input
            type="text"
            placeholder="Search content..."
            aria-label="Search content"
          />
        </div>

        <div className={styles.topHeaderRight}>
          <button
            type="button"
            className={styles.notificationButton}
            aria-label="Notifications"
          >
            <Bell size={19} strokeWidth={1.7} />

            <span className={styles.notificationDot} />
          </button>

          <div className={styles.headerDivider} />

          <div className={styles.adminProfile}>
            <div className={styles.adminAvatar}>IS</div>

            <div className={styles.adminProfileText}>
              <p>Administrator</p>
              <span>Content Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className={styles.dashboardContent}>
        {/* BREADCRUMB */}

        <div className={styles.breadcrumb}>
          <span>ADMIN</span>
          <b>/</b>
          <strong>DASHBOARD</strong>
        </div>

        {/* PAGE HEADER */}

        <div className={styles.pageHeader}>
          <div className={styles.pageHeading}>
            <p className={styles.eyebrow}>Overview</p>

            <h1>Dashboard</h1>

            <p className={styles.pageDescription}>
              Welcome back. Here&apos;s what&apos;s happening across
              your platform.
            </p>
          </div>

          <div className={styles.pageHeaderActions}>
            <Link href="/" className={styles.viewWebsite}>
              <span>VIEW WEBSITE</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className={styles.statCard} key={stat.label}>
                <div className={styles.statIcon}>
                  <Icon size={18} strokeWidth={1.6} />
                </div>

                <div className={styles.statContent}>
                  <p className={styles.statLabel}>
                    {stat.label}
                  </p>

                  <div className={styles.statNumberRow}>
                    <span className={styles.statNumber}>
                      {stat.value}
                    </span>

                    <span className={styles.statChange}>
                      ↑ {stat.change.replace("+", "")}
                    </span>
                  </div>

                  <p className={styles.statPeriod}>
                    vs last 30 days
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className={styles.mainDashboardGrid}>
          {/* CONTENT OVERVIEW */}

          <section
            className={`${styles.panel} ${styles.contentOverview}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>
                  Content
                </p>

                <h2>Content Overview</h2>
              </div>

              <select
                defaultValue="this-month"
                className={styles.monthSelect}
                aria-label="Select time period"
              >
                <option value="this-month">This Month</option>
                <option value="january">January 2026</option>
                <option value="february">February 2026</option>
                <option value="march">March 2026</option>
                <option value="april">April 2026</option>
                <option value="may">May 2026</option>
                <option value="june">June 2026</option>
                <option value="july">July 2026</option>
                <option value="august">August 2026</option>
                <option value="september">
                  September 2026
                </option>
                <option value="last-month">
                  Last Month
                </option>
                <option value="last-3-months">
                  Last 3 Months
                </option>
                <option value="last-6-months">
                  Last 6 Months
                </option>
                <option value="this-year">This Year</option>
                <option value="last-year">Last Year</option>
              </select>
            </div>

            <div className={styles.overviewSummary}>
              <div>
                <p>Total</p>
                <strong>206</strong>
                <span className={styles.positive}>
                  +18 this month
                </span>
              </div>

              <div>
                <p>Published</p>
                <strong>158</strong>
                <span>76.7% of total</span>
              </div>

              <div>
                <p>Drafts</p>
                <strong>48</strong>
                <span>23.3% of total</span>
              </div>
            </div>

            <div className={styles.contentBars}>
              {[
                ["Articles", "128", "72%"],
                ["Cover Stories", "24", "25%"],
                ["Magazines", "18", "18%"],
              ].map(([label, value, width]) => (
                <div
                  className={styles.contentBarItem}
                  key={label}
                >
                  <div className={styles.contentBarLabel}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>

                  <div className={styles.barBackground}>
                    <div
                      className={styles.barFill}
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK ACTIONS */}

          <section className={styles.quickActions}>
            <div className={styles.quickHeading}>
              <p>Shortcuts</p>

              <h2>Quick Actions</h2>

              <span>
                Create and manage editorial content quickly.
              </span>
            </div>

            <div className={styles.quickGrid}>
              {quickActions.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className={styles.quickActionButton}
                >
                  <span>
                    <Plus size={13} />
                    {label}
                  </span>

                  <ChevronRight size={13} />
                </Link>
              ))}
            </div>
          </section>

          {/* RECENT ACTIVITY */}

          <section
            className={`${styles.panel} ${styles.recentActivity}`}
          >
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>
                  Activity
                </p>

                <h2>Recent Activity</h2>
              </div>

              <Link
                href="/admin/activity"
                className={styles.viewAll}
              >
                VIEW ALL
              </Link>
            </div>

            <div className={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <div
                  className={`${styles.activityItem} ${
                    index !== recentActivity.length - 1
                      ? styles.activityBorder
                      : ""
                  }`}
                  key={`${activity.title}-${activity.time}`}
                >
                  <div className={styles.activityIcon}>
                    <Clock3
                      size={14}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div className={styles.activityContent}>
                    <p>{activity.title}</p>
                    <span>{activity.subtitle}</span>
                  </div>

                  <time>{activity.time}</time>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            RECENT CONTENT
        ====================================================== */}

        <section
          className={`${styles.panel} ${styles.recentContent}`}
        >
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>
                Editorial
              </p>

              <h2>Recent Content</h2>
            </div>

            <Link
              href="/admin/content"
              className={styles.viewAllIcon}
            >
              VIEW ALL
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentContent.map((item) => (
                  <tr key={item.title}>
                    <td>{item.title}</td>

                    <td className={styles.muted}>
                      {item.type}
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          item.status === "PUBLISHED"
                            ? styles.published
                            : styles.draft
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className={styles.muted}>
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =====================================================
            ADVERTISEMENTS
        ====================================================== */}

        <section
          className={`${styles.panel} ${styles.advertisements}`}
        >
          <div className={styles.advertisementHeader}>
            <div>
              <p className={styles.panelEyebrow}>
                Monetization
              </p>

              <div className={styles.advertisementTitle}>
                <Megaphone
                  size={16}
                  strokeWidth={1.6}
                />

                <h2>Advertisements</h2>
              </div>

              <p className={styles.advertisementDescription}>
                Manage advertisements displayed across the
                website.
              </p>
            </div>

            <Link
              href="/admin/advertisements"
              className={styles.manageAds}
            >
              MANAGE ADS
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className={styles.advertisementStats}>
            <div className={styles.advertisementStat}>
              <div className={styles.advertisementIcon}>
                <Megaphone
                  size={16}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p>Active Ads</p>
                <strong>12</strong>
                <span>+3 this month</span>
              </div>
            </div>

            <div className={styles.advertisementStat}>
              <div className={styles.advertisementIcon}>
                <BarChart3
                  size={16}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p>Impressions</p>
                <strong>24.8K</strong>
                <span>This month</span>
              </div>
            </div>

            <div className={styles.advertisementStat}>
              <div className={styles.advertisementIcon}>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p>Clicks</p>
                <strong>3.2K</strong>
                <span>6.6% CTR</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <div className={styles.mobileNav}>
        {mobileNavItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.label}
              className={
                index === 0
                  ? `${styles.mobileNavItem} ${styles.mobileNavActive}`
                  : styles.mobileNavItem
              }
            >
              <Icon size={17} strokeWidth={1.7} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
