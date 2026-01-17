function mostrarStatus(msg, ok=false) {
  const s = document.getElementById("status");
  s.textContent = msg;
  s.style.display = "block";
  s.style.color = ok ? "#4ade80" : "#f87171";
}

document.getElementById("btnEntrar").onclick = function () {
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!login || !senha) {
    mostrarStatus("erro de login e senha");
    return;
  }

  if (login !== "admin" || senha !== "1234") {
    mostrarStatus("erro de senha");
    return;
  }

  window.location.href = "dashboard.html";
};

