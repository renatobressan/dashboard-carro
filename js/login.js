// ===============================
// LOGIN COM SUPABASE AUTH
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  if (!window.sb) {
    console.error("window.sb não existe");
    return;
  }

  const btn = document.getElementById("btnLogin");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const erro = document.getElementById("loginErro");

  btn.addEventListener("click", async () => {
    erro.innerText = "";

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      erro.innerText = "Informe e-mail e senha";
      return;
    }

    try {
      const { data, error } = await window.sb.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) {
        erro.innerText = error.message;
        return;
      }

      console.log("Login OK:", data);
      window.location.href = "dashboard.html";

    } catch (e) {
      console.error(e);
      erro.innerText = "Erro inesperado no login";
    }
  });
});
