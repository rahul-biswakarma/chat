import { createBrowserClient } from "@supabase/ssr";

import { supabaseOption } from "../utils/get-supabase-key";

export const createSupabaseBrowserClient = () => {
  const { supabaseUrl, supabaseAnonKey } = supabaseOption;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
};
