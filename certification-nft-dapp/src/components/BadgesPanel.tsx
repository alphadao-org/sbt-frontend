"use client";
import { useEffect, useState } from "react";
import { getUserAchievements } from "@/lib/supabaseService";

interface BadgesPanelProps {
  userAddress?: string | null;
  initialAchievements?: string[];
}

const BADGES = [
  { id: "first_claim", title: "First Claim", description: "Claim your first task", icon: "🏅" },
  { id: "streak_7", title: "7-Day Streak", description: "Check in 7 days in a row", icon: "🔥" },
  { id: "referrer_1", title: "First Referral", description: "Refer your first user", icon: "🤝" },
  { id: "cert_viewer", title: "Certificate Explorer", description: "View 5 certificates", icon: "🔎" },
];

export default function BadgesPanel({ userAddress, initialAchievements = [] }: BadgesPanelProps) {
  const [owned, setOwned] = useState<string[]>(initialAchievements || []);

  useEffect(() => {
    async function load() {
      if (userAddress) {
        const a = await getUserAchievements(userAddress);
        setOwned(a || initialAchievements || []);
      }
    }
    load();
  }, [userAddress]);

  async function handleClaim(badgeId: string) {
    if (!userAddress) return;
    if (owned.includes(badgeId)) return;

    try {
      const res = await fetch(`/api/award-achievement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, achievementId: badgeId }),
      });
      const json = await res.json();
      if (json.success) setOwned((s) => [...s, badgeId]);
    } catch (err) {
      console.warn("Failed to claim badge", err);
    }
  }

  return (
    <div className="rounded-lg border p-3">
      <h4 className="font-semibold mb-2">Achievements</h4>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((b) => (
          <div key={b.id} className={`p-3 rounded-md border ${owned.includes(b.id) ? "bg-green-50" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl">{b.icon}</div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs text-gray-500">{b.description}</div>
              </div>
              <div>
                {owned.includes(b.id) ? (
                  <span className="text-xs font-bold text-green-600">Owned</span>
                ) : (
                  <button onClick={() => handleClaim(b.id)} className="px-2 py-1 text-xs rounded bg-blue-500 text-white">Claim</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
