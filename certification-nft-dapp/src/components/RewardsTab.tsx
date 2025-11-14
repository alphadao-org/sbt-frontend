"use client";
import { useEffect, useState } from "react";
import BadgesPanel from "@/components/BadgesPanel";

interface RewardsTabProps {
  userAddress?: string | null;
}

export default function RewardsTab({ userAddress }: RewardsTabProps) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const resL = await fetch(`/api/leaderboard?limit=10`);
        const jsonL = await resL.json();
        setLeaders(jsonL.success ? jsonL.data : []);

        const resR = await fetch(`/api/top-referrers?limit=10`);
        const jsonR = await resR.json();
        setReferrers(jsonR.success ? jsonR.data : []);

        if (userAddress) {
          const resA = await fetch(`/api/user-achievements`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userAddress }) });
          const jsonA = await resA.json();
          setAchievements(jsonA.success ? jsonA.data : []);
        }
      } catch (err) {
        console.warn("Failed to load rewards data", err);
      }
    }
    load();
  }, [userAddress]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Rewards & Leaderboards</h3>
        <p className="text-sm text-gray-500">See top performers and your achievements</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-3">
          <h4 className="font-semibold mb-2">Top by Points</h4>
          <ol className="list-decimal list-inside">
            {leaders.map((u, idx) => (
              <li key={u.user_address} className="flex justify-between">
                <span className="truncate">{u.user_address}</span>
                <span className="font-bold">{u.points || 0} pts</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border p-3">
          <h4 className="font-semibold mb-2">Top Referrers</h4>
          <ol className="list-decimal list-inside">
            {referrers.map((u, idx) => (
              <li key={u.user_address} className="flex justify-between">
                <span className="truncate">{u.user_address}</span>
                <span className="font-bold">{u.referral_count || 0}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6">
        <BadgesPanel userAddress={userAddress} initialAchievements={achievements} />
      </div>
    </div>
  );
}
