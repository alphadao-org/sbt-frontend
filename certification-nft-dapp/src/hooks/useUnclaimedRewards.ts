import { useEffect, useState } from "react";
import { getUserAchievements } from "@/lib/supabaseService";

const AVAILABLE_BADGES = ["first_claim", "streak_7", "referrer_1", "cert_viewer"];

export function useUnclaimedRewards(userAddress?: string | null) {
  const [unclaimedCount, setUnclaimedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnclaimed() {
      if (!userAddress) {
        setUnclaimedCount(0);
        setLoading(false);
        return;
      }

      try {
        const owned = await getUserAchievements(userAddress);
        const unclaimed = AVAILABLE_BADGES.filter((id) => !owned?.includes(id)).length;
        setUnclaimedCount(unclaimed);
      } catch (err) {
        console.warn("Failed to fetch unclaimed rewards", err);
        setUnclaimedCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchUnclaimed();
  }, [userAddress]);

  return { unclaimedCount, loading };
}
