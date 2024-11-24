import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qtinbflcjyytqdzbtpim.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aW5iZmxjanl5dHFkemJ0cGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTk2NzUsImV4cCI6MjA0NzkzNTY3NX0.GuqHulGgKtAfK2TL-ET8JFCuyyzE4iHUiAbjSMqnSA0";
export const supabase = createClient(supabaseUrl, supabaseKey);
