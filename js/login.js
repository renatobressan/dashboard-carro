// login.js
// Login real com Supabase Auth

async function login() {
  const emailInput = document.getElementById("login");
  const senhaInput = document.getElementById("senha");
  const erro = document.getElementById("login-erro");

  erro.textContent = "";

  if (!emailInput.value || !senhaInput.value) {
    erro.textContent = "E-mail e senha obrigatórios";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: senhaInput.value
    });

    if (error) {
      erro.textContent = "Login inválido";
      return;
    }

    // Login OK
    window.location.href = "dashboard.html";

  } catch (e) {
    erro.textContent = "Erro inesperado no login";
  }
}
