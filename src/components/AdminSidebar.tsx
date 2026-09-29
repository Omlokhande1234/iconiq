"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  BookOpen,
  Library,
  Award,
  Mic2,
  Megaphone,
  Grid,
  Tags,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Track which content section's dropdown is open (e.g., "articles", "magazines", etc.)
  // Automatically open the dropdown if the current path matches one of its sub-routes
  const [openDropdown, setOpenDropdown] = useState<string | null>(() => {
    if (pathname.includes("/admin/articles")) return "articles";
    if (pathname.includes("/admin/cover-stories")) return "cover-stories";
    if (pathname.includes("/admin/magazines")) return "magazines";
    if (pathname.includes("/admin/awards")) return "awards";
    if (pathname.includes("/admin/podcasts")) return "podcasts";
    return null;
  });

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("iconiq_admin_logged_in");
    router.replace("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* LOGO AREA */}
      <div className="sidebar-logo-area">
        <div className="sidebar-logo-box">
          <img
            src="/iconiq-sphere-logo-admin.svg"
            alt="Iconiq Logo"
            className="sidebar-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* SCROLLABLE NAV */}
      <div className="sidebar-scroll">
        <p className="sidebar-section-title">Navigation</p>
        <nav className="sidebar-nav">
          <SidebarItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={FileText}
            currentPath={pathname}
          />

          {/* CONTENT SECTIONS WITH VIEW & ADD DROPDOWNS */}
          <SidebarDropdown
            sectionKey="articles"
            label="Articles"
            icon={FileText}
            currentPath={pathname}
            isOpen={openDropdown === "articles"}
            onToggle={() => toggleDropdown("articles")}
          />

          <SidebarDropdown
            sectionKey="cover-stories"
            label="Cover Stories"
            icon={BookOpen}
            currentPath={pathname}
            isOpen={openDropdown === "cover-stories"}
            onToggle={() => toggleDropdown("cover-stories")}
          />

          <SidebarDropdown
            sectionKey="magazines"
            label="Magazines"
            icon={Library}
            currentPath={pathname}
            isOpen={openDropdown === "magazines"}
            onToggle={() => toggleDropdown("magazines")}
          />

          <SidebarDropdown
            sectionKey="awards"
            label="Awards"
            icon={Award}
            currentPath={pathname}
            isOpen={openDropdown === "awards"}
            onToggle={() => toggleDropdown("awards")}
          />

          <SidebarDropdown
            sectionKey="podcasts"
            label="Podcasts"
            icon={Mic2}
            currentPath={pathname}
            isOpen={openDropdown === "podcasts"}
            onToggle={() => toggleDropdown("podcasts")}
          />
        </nav>

        <div className="sidebar-divider" />

        <p className="sidebar-section-title">Management</p>
        <nav className="sidebar-nav">
          <SidebarItem
            href="/admin/advertisements"
            label="Advertisements"
            icon={Megaphone}
            currentPath={pathname}
          />
          <SidebarItem
            href="/admin/categories/view"
            label="Categories"
            icon={Grid}
            currentPath={pathname}
          />
          <SidebarItem
            href="/admin/tags/view"
            label="Tags"
            icon={Tags}
            currentPath={pathname}
          />
          <SidebarItem
            href="/admin/users/view"
            label="Users"
            icon={Users}
            currentPath={pathname}
          />
          <SidebarItem
            href="/admin/settings"
            label="Settings"
            icon={Settings}
            currentPath={pathname}
          />
        </nav>
      </div>

      {/* SIGN OUT */}
      <div className="sidebar-signout">
        <button
          onClick={handleSignOut}
          className="signout-button"
          style={{ width: "100%", cursor: "pointer", background: "transparent" }}
        >
          <span className="signout-icon">
            <LogOut size={13} strokeWidth={2} />
          </span>
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}

// Standard Single Link Item
function SidebarItem({
  href,
  label,
  icon: Icon,
  currentPath,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  currentPath: string;
}) {
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
    >
      {isActive && <div className="active-indicator" />}
      <span className="sidebar-icon">
        <Icon size={16} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

// Collapsible Dropdown Component for Sections with View/Add
function SidebarDropdown({
  sectionKey,
  label,
  icon: Icon,
  currentPath,
  isOpen,
  onToggle,
}: {
  sectionKey: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isViewActive = currentPath === `/admin/${sectionKey}/view`;
  const isAddActive = currentPath === `/admin/${sectionKey}/add`;
  const isAnyChildActive = isViewActive || isAddActive;

  return (
    <div className="sidebar-dropdown-group">
      {/* Main Dropdown Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`sidebar-link ${isAnyChildActive ? "sidebar-link-active" : ""}`}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        {isAnyChildActive && <div className="active-indicator" />}
        <span className="sidebar-icon">
          <Icon size={16} />
        </span>
        <span style={{ flex: 1 }}>{label}</span>
        <span style={{ opacity: 0.6, display: "flex", alignItems: "center" }}>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {/* Sub-menu items (View and Add) */}
      {isOpen && (
        <div className="sidebar-submenu">
          <Link
            href={`/admin/${sectionKey}/view`}
            className={`sidebar-sublink ${isViewActive ? "sidebar-sublink-active" : ""}`}
            style={{
              display: "block",
              padding: "6px 10px 6px 36px",
              fontSize: "12px",
              textDecoration: "none",
              color: isViewActive ? "inherit" : "inherit",
              opacity: isViewActive ? 1 : 0.75,
              fontWeight: isViewActive ? 700 : 500,
            }}
          >
            View {label}
          </Link>
          <Link
            href={`/admin/${sectionKey}/add`}
            className={`sidebar-sublink ${isAddActive ? "sidebar-sublink-active" : ""}`}
            style={{
              display: "block",
              padding: "6px 10px 6px 36px",
              fontSize: "12px",
              textDecoration: "none",
              color: isAddActive ? "inherit" : "inherit",
              opacity: isAddActive ? 1 : 0.75,
              fontWeight: isAddActive ? 700 : 500,
            }}
          >
            Add {label}
          </Link>
        </div>
      )}
    </div>
  );
}