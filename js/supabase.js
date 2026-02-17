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


// ========================================
// SUPABASE CONFIG
// ========================================

const SUPABASE_URL = "https://fzclivwxzwkomvfeevds.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Y2xpd3h3emt3b212ZmVldmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTcwMzEsImV4cCI6MjA4MzczMzAzMX0.filx-dFt2vVF42PPcVUTNgE_n2gW9Y1vChvHsf75Xn0";

// Cria cliente Supabase
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// ========================================
// FUNÇÕES GLOBAIS DE AUTENTICAÇÃO
// ========================================

// Pega sessão atual
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Erro ao pegar sessão:", error);
    return null;
  }
  return data.session;
}

// Pega usuário logado
async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erro ao pegar usuário:", error);
    return null;
  }
  return data.user;
}

// Logout global
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Proteção automática (usar no dashboard)
async function protectPage() {
  const session = await getSession();
  if (!session) {
    window.location.href = "index.html";
  }
}
