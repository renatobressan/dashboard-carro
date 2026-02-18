document.addEventListener("DOMContentLoaded", async () => {

  const { data: { user } } = await window.sb.auth.getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadDashboard(user.id);

});

async function loadDashboard(userId) {

  const { data, error } = await window.sb
    .from("Base_Hist")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    console.warn("Sem dados.");
    return;
  }

  // =============================
  // HISTÓRICO COMPLETO
  // =============================

  const container = document.getElementById("baseHistContainer");
  container.innerHTML = "";

  // HEADER
  const header = document.createElement("div");
  header.classList.add("hist-header");
  header.innerHTML = `
    <div>Data</div>
    <div>Placa</div>
    <div>Tipo</div>
    <div>Item</div>
    <div>Local</div>
    <div>Odômetro</div>
    <div>Valor Unit.</div>
    <div>Qtd</div>
    <div>Total</div>
    <div>Anotações</div>
  `;
  container.appendChild(header);

  // LINHAS
  data.forEach(row => {

    const div = document.createElement("div");
    div.classList.add("hist-row");

    div.innerHTML = `
      <div>${row["Data"] || "-"}</div>
      <div>${row["Placa"] || "-"}</div>
      <div>${row["Tipo"] || "-"}</div>
      <div>${row["Item"] || "-"}</div>
      <div>${row["Local"] || "-"}</div>
      <div>${formatKm(row["Odômetro (KM)"])}</div>
      <div>${formatMoney(row["Valor Unitário"])}</div>
      <div>${formatNumber(row["Quantidade"])}</div>
      <div>${formatMoney(row["Valor Total"])}</div>
      <div>${row["Anotações"] || "-"}</div>
    `;

    container.appendChild(div);

  });

}

// =============================
// FORMATADORES
// =============================

function formatKm(valor) {
  if (!valor) return "-";
  return Number(valor).toLocaleString("pt-BR");
}

function formatMoney(valor) {
  if (!valor) return "-";
  return "R$ " + Number(valor).toFixed(2);
}

function formatNumber(valor) {
  if (!valor) return "-";
  return Number(valor).toLocaleString("pt-BR");
}
