import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let lastErrorTimestamp = 0;
const COOLDOWN_PERIOD_MS = 5 * 1000; // 5 seconds cooldown if offline

export function isSupabaseReachable(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("dummy-project") || url.includes("xxxxxx")) {
    return false;
  }
  // If recent DNS or network failure occurred, wait for cooldown before retrying
  if (Date.now() - lastErrorTimestamp < COOLDOWN_PERIOD_MS) {
    return false;
  }
  return true;
}

export function recordSupabaseError() {
  lastErrorTimestamp = Date.now();
}

export function resetSupabaseError() {
  lastErrorTimestamp = 0;
}

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Ignored if called from Server Component
        }
      },
    },
    global: {
      fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
        // Enforce a strict 1500ms timeout so DNS or network delays never freeze the UI
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        if (options?.signal) {
          options.signal.addEventListener("abort", () => controller.abort());
        }

        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      },
    },
  });
}
