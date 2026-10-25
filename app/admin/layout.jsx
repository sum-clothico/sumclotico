"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { FiBarChart2, FiBox, FiShoppingBag, FiUsers, FiExternalLink, FiLogOut, FiBell, FiPlus, FiClock, FiFileText } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, logoutAdmin, adminNotifications = [], setAdminNotifications, abandonedCarts = [] } = useStore();

  const pendingAbandonedCount = (abandonedCarts || []).filter((c) => c.status === "PENDING").length;

  // If viewing admin login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard & Analytics", href: "/admin", icon: <FiBarChart2 size={16} /> },
    { label: "Product Management", href: "/admin/products", icon: <FiBox size={16} /> },
    { label: "Live Orders & CRM", href: "/admin/orders", icon: <FiShoppingBag size={16} /> },
    {
      label: "Abandoned Carts",
      href: "/admin/abandoned-carts",
      icon: <FiClock size={16} />,
      badge: pendingAbandonedCount > 0 ? pendingAbandonedCount : null,
    },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: <FiBox size={16} /> },
    { label: "Campaign & Ref Links", href: "/admin/links", icon: <FiExternalLink size={16} /> },
    { label: "Legal Policies & CMS", href: "/admin/policies", icon: <FiFileText size={16} /> },
    { label: "Customer Directory", href: "/admin/customers", icon: <FiUsers size={16} /> },
    { label: "View Storefront", href: "/", icon: <FiExternalLink size={16} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <span className="admin-brand-logo">सम CLOTHICO</span>
            <span className="admin-badge">Atelier</span>
          </div>

          <ul className="admin-nav-list">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className={`admin-nav-item ${isActive ? "active" : ""}`}>
                  <Link href={item.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        style={{
                          background: "#881A1C",
                          color: "#ffffff",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div style={{ padding: "14px 16px", background: "rgba(212, 196, 168, 0.06)", border: "1px solid rgba(212, 196, 168, 0.12)", borderRadius: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FAF6F0" }}>
              {adminUser ? adminUser.name : "Super Admin"}
            </div>
            <div style={{ fontSize: 11, color: "#A39688", marginTop: 2 }}>
              {adminUser ? adminUser.email : "admin@sumclotico.com"}
            </div>
          </div>
          <button
            className="admin-btn admin-btn-secondary"
            style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
            onClick={handleLogout}
          >
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            {pathname === "/admin" && "Executive Dashboard & Sales Analytics"}
            {pathname === "/admin/products" && "Product Catalog & Inventory Uploader"}
            {pathname === "/admin/orders" && "Customer Orders & Fulfillment CRM"}
            {pathname === "/admin/abandoned-carts" && "Abandoned Cart Recovery CRM & WhatsApp Reminders"}
            {pathname === "/admin/coupons" && "Coupon Manager & Dynamic Discounts"}
            {pathname === "/admin/links" && "Campaign & Affiliate Trackable Links"}
            {pathname === "/admin/policies" && "Legal Policies & Compliance Content Editor (CMS)"}
            {pathname === "/admin/customers" && "Customer Directory & Lifetime Value"}
            {pathname === "/" && "Storefront Preview"}
          </div>

          <div className="admin-topbar-actions">
            {/* Notification Bell with Badge */}
            <div style={{ position: "relative" }}>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => {
                  if (adminNotifications.length > 0) {
                    alert(adminNotifications.map((n) => `• ${n.title}: ${n.message}`).join("\n\n"));
                  } else {
                    alert("No new notifications.");
                  }
                }}
              >
                <FiBell size={15} />
                <span>Alerts</span>
                {adminNotifications.length > 0 && (
                  <span style={{ background: "#881A1C", color: "#fff", padding: "2px 6px", borderRadius: 99, fontSize: 11, marginLeft: 2, fontWeight: 700 }}>
                    {adminNotifications.length}
                  </span>
                )}
              </button>
            </div>

            <Link href="/admin/products" className="admin-btn admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FiPlus size={16} />
              <span>New Product</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content">{children}</main>
      </div>

      {/* Real-time Order Alert Toast if any */}
      {adminNotifications.length > 0 && !adminNotifications[0].isRead && (
        <div className="admin-notif-toast">
          <div>
            <strong style={{ fontSize: 14 }}>{adminNotifications[0].title}</strong>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{adminNotifications[0].message}</p>
          </div>
          <button
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 12, fontSize: 14 }}
            onClick={() => {
              setAdminNotifications((prev) => prev.map((n, i) => (i === 0 ? { ...n, isRead: true } : n)));
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
