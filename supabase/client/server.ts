"use server";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { supabaseOption } from "../utils/get-supabase-key";

export const createSupabaseServerClient = async () => {
  const { supabaseUrl, supabaseAnonKey } = supabaseOption;
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {}
      },
    },
  });
};
