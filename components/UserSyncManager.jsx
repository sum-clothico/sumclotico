"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSyncManager() {
  const { isLoaded, isSignedIn, user } = useUser();
  const lastSyncedId = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    const name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Customer";
    const phone = user.primaryPhoneNumber?.phoneNumber || "";
    const clerkId = user.id;

    // Avoid duplicated sync calls within the same browser session
    const sessionKey = `sum_synced_${clerkId}`;
    if (lastSyncedId.current === clerkId && typeof window !== "undefined" && window.sessionStorage?.getItem(sessionKey)) {
      return;
    }

    lastSyncedId.current = clerkId;

    const syncToDatabase = async () => {
      try {
        const res = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId,
            email,
            name,
            phone,
          }),
        });

        const data = await res.json();
        if (data.success) {
          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.setItem(sessionKey, "true");
          }
          console.log(
            "%c[MongoDB: User Synced]",
            "background: #10b981; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
            `${name} (${email})`
          );
        }
      } catch (err) {
        console.warn("[UserSyncManager] Error syncing Clerk user to MongoDB:", err);
      }
    };

    syncToDatabase();
  }, [isLoaded, isSignedIn, user]);

  return null;
}
