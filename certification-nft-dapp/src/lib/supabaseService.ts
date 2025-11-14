import supabase from "@/lib/supabaseClient";

export interface UserStats {
  user_address: string;
  points: number;
  daily_streak: number;
  claimed_task_ids: string[];
  last_checkin?: string; // ISO date
}

/**
 * Load user stats from Supabase, with localStorage fallback
 */
export async function loadUserStats(userAddress: string): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("points, daily_streak, claimed_task_ids, last_checkin")
      .eq("user_address", userAddress)
      .single();

    if (error && (error as any).code !== "PGRST116") {
      console.warn("Supabase load error:", error);
    }

    if (data) {
      // Persist to localStorage as backup
      localStorage.setItem(
        `tasks_user_${userAddress}`,
        JSON.stringify(data),
      );
      return { user_address: userAddress, ...data };
    }
  } catch (err) {
    console.warn("Failed to load from Supabase, trying localStorage:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(`tasks_user_${userAddress}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { user_address: userAddress, ...parsed };
    }
  } catch (_e) {
    // ignore
  }

  return null;
}

/**
 * Save/upsert user stats to Supabase
 */
export async function saveUserStats(
  userAddress: string,
  stats: Omit<UserStats, "user_address">,
): Promise<boolean> {
  // Always save to localStorage first
  try {
    localStorage.setItem(
      `tasks_user_${userAddress}`,
      JSON.stringify(stats),
    );
  } catch (_e) {
    // ignore
  }

  // Then try Supabase
  try {
    const { error } = await supabase
      .from("user_stats")
      .upsert(
        { user_address: userAddress, ...stats },
        { onConflict: "user_address" },
      );

    if (error) {
      console.warn("Supabase save error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to save to Supabase:", err);
    return false;
  }
}

/**
 * Check if user has already completed daily check-in today
 */
export function hasCheckedInToday(lastCheckinDate?: string): boolean {
  if (!lastCheckinDate) return false;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return lastCheckinDate === today;
}

/**
 * Get today's ISO date string (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Reset daily check-in task if needed (returns true if reset was done)
 */
export function shouldResetCheckIn(lastCheckinDate?: string): boolean {
  const today = getTodayDateString();
  return lastCheckinDate !== today;
}
