// ===============================
// SUPABASE CLIENT (GLOBAL)
// ===============================

// SUBSTITUA pelos dados do seu projeto
//const SUPABASE_URL = "https://fzcliwxwzkwomvfeevds.supabase.co";
//const SUPABASE_ANON_KEY = "sb_publishable_nJW2y3Z0E1I_cQUN67-nbg_CepDJiVQ";;

// Criar cliente Supabase e expor globalmente
//window.sb = supabase.createClient(
//  SUPABASE_URL,
//  SUPABASE_ANON_KEY
//);

//console.log("Supabase conectado:", window.sb);

const SUPABASE_URL = "https://fzclivwxzwkomvfeevds.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Y2xpd3h3emt3b212ZmVldmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTcwMzEsImV4cCI6MjA4MzczMzAzMX0.filx-dFt2vVF42PPcVUTNgE_n2gW9Y1vChvHsf75Xn0";

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


