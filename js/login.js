document.addEventListener("DOMContentLoaded", () => {

  console.log("Login JS carregado");
  console.log("SB existe?", window.sb);

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!window.sb) {
      alert("Supabase não carregou!");
      return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await window.sb.auth.signInWithPassword({
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
