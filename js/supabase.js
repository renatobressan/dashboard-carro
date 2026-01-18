
// ===============================
// SUPABASE CLIENT
// ===============================

// SUBSTITUA pelos dados do seu projeto
const SUPABASE_URL = "https://fzcliwxwzkwomvfeevds.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nJW2y3Z0E1I_cQUN67-nbg_CepDJiVQ";

// Cliente Supabase (GLOBAL)
const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Debug opcional
console.log("Supabase conectado:", sb);
