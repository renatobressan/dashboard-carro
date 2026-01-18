// ===============================
// SUPABASE CLIENT (GLOBAL)
// ===============================

// SUBSTITUA pelos dados do seu projeto
const SUPABASE_URL = "https://fzcliwxwzkwomvfeevds.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nJW2y3Z0E1I_cQUN67-nbg_CepDJiVQ";;

// Criar cliente Supabase e expor globalmente
window.sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase conectado:", window.sb);
