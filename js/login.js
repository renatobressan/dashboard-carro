// login.js
// Versão corrigida e simples
// Usa onclick direto no HTML: <button onclick="login()">Entrar</button>

function login() {
  const loginInput = document.getElementById("login");
  const senhaInput = document.getElementById("senha");
  const erro = document.getElementById("login-erro");

  // segurança básica
  if (!loginInput || !senhaInput || !erro) {
    console.error("Elementos do login não encontrados no HTML");
    return;
  }

  const login = loginInput.value.trim();
  const senha = senhaInput.value.trim();

  // limpa erro anterior
  erro.textContent = "";

  if (!login || !senha) {
    erro.textContent = "Login e senha obrigatórios";
    return;
  }

  // LOGIN FAKE (temporário)
  // depois será trocado por Supabase
  window.location.href = "dashboard.html";
}
