document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await sb.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert("Erro no login: " + error.message);
      return;
    }

    window.location.href = "dashboard.html";
  });

});
