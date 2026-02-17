document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Limpa erro anterior
    errorMsg.style.display = "none";

    // Simulação de login (trocar depois por Supabase)
    if (email === "admin@carro.com" && password === "123456") {

      // Salva sessão simples
      localStorage.setItem("loggedIn", "true");

      // Redireciona
      window.location.href = "dashboard.html";

    } else {

      errorMsg.textContent = "Email ou senha inválidos";
      errorMsg.style.display = "block";

    }
  });

});
