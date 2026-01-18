function login() {
  const l = document.getElementById('login').value;
  const s = document.getElementById('senha').value;

  if (!l || !s) {
    document.getElementById('login-erro').innerText = 'Login e senha obrigatórios';
    return;
  }

  window.location.href = 'dashboard.html';
}
