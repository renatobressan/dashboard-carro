document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    errorMsg.textContent = "";

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      errorMsg.textContent = "Email ou senha inválidos";
      return;
    }

    window.location.href = "/dashboard-carro/dashboard.html";
  });

});
