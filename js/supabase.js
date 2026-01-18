// supabase.js
// Cliente Supabase (frontend)

const SUPABASE_URL = "https://fzcliwxwzkwomvfeevds.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nJW2y3Z0E1I_cQUN67-nbg_CepDJiVQ";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
