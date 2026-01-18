// js/login.js
// Login com Supabase Auth - versão com debug detalhado

async function login() {
  const email = document.getElementById("login")?.value;
  const senha = document.getElementById("senha")?.value;
  const erro = document.getElementById("login-erro");

  erro.textContent = "";

  if (!email || !senha) {
    erro.textContent = "E-mail e senha obrigatórios";
    return;
  }

  try {
    if (!window.sb) {
      erro.textContent = "Supabase não inicializado";
      console.error("window.sb não existe");
      return;
    }

    console.log("Tentando login com:", email);

    const { data, error } = await window.sb.auth.signInWithPassword({
      email,
      password: senha
    });

    console.log("Resposta Supabase:", data, error);

    if (error) {
      erro.textContent = error.message;
      return;
    }

    window.location.href = "dashboard.html";

  } catch (e) {
    console.error("Erro real no login:", e);
    erro.textContent = "Erro inesperado no login (ver console)";
  }
}
