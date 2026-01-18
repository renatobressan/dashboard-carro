
// js/supabase.js
// Cliente Supabase - versão com debug

console.log("Carregando supabase.js");

const SUPABASE_URL = "https://fzcliwxwzkwomvfeevds.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nJW2y3Z0E1I_cQUN67-nbg_CepDJiVQ";

if (!window.supabase) {
  console.error("SDK do Supabase não carregou");
} else {
  console.log("SDK do Supabase carregado");
}

window.sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Cliente Supabase criado:", window.sb);
