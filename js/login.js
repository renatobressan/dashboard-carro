// ===============================
// LOGIN COM SUPABASE (ROBUSTO)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Verificações básicas
  if (!window.sb) {
    console.error("Supabase não carregado (window.sb inexistente)");
    return;
  }

  const btnLogin = document.getElementById("btnLogin");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const erroBox = document.getElementById("loginErro");

  if (!btnLogin || !emailInput || !senhaInput || !erroBox) {
    console.error("Elementos de login não encontrados no HTML", {
      btnLogin,
      emailInput,
      senhaInput,
      erroBox
    });
    return;
  }

  btnLogin.addEventListener("click", async () => {
    erroBox.innerText = "";

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      erroBox.innerText = "Informe e-mail e senha.";
      return;
    }

    try {
      const { data, error } = await window.sb.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) {
        erroBox.innerText = error.message;
        return;
      }

      console.log("Login realizado:", data.user.email);
      window.location.href = "dashboard.html";

    } catch (e) {
      console.error("Erro inesperado no login:", e);
      erroBox.innerText = "Erro inesperado no login.";
    }
  });
});
