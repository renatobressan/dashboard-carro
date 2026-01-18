// ======================
// KPIs (dados fake)
// ======================
const fakeKPIs = {
  veiculo: { modelo: "FOX 1.0", placa: "ABC-1234" },
  consumo: { medio: 12.4, periodo: "Últimos 30 dias" },
  km: { atual: 132745, atualizado: "Hoje" },
  manutencao: { tipo: "Óleo", restanteKm: 2300 }
};

// ======================
// Histórico fake
// ======================
const fakeHistorico = [
  { data: "10/01/2026", tipo: "Abastecimento", desc: "Gasolina comum", km: 132745, valor: 279.90 },
  { data: "22/12/2025", tipo: "Manutenção", desc: "Troca de óleo", km: 130500, valor: 180.00 },
  { data: "05/12/2025", tipo: "Abastecimento", desc: "Gasolina aditivada", km: 129980, valor: 265.40 },
  { data: "18/11/2025", tipo: "Manutenção", desc: "Filtro de ar", km: 128900, valor: 75.00 }
];

function carregarKPIs() {
  document.getElementById("kpi-veiculo").textContent = fakeKPIs.veiculo.modelo;
  document.getElementById("kpi-veiculo-sub").textContent = "Placa " + fakeKPIs.veiculo.placa;

  document.getElementById("kpi-consumo").textContent =
    fakeKPIs.consumo.medio.toFixed(1).replace(".", ",") + " km/L";
  document.getElementById("kpi-consumo-sub").textContent = fakeKPIs.consumo.periodo;

  document.getElementById("kpi-km").textContent =
    fakeKPIs.km.atual.toLocaleString("pt-BR");
  document.getElementById("kpi-km-sub").textContent =
    "Atualizado " + fakeKPIs.km.atualizado;

  document.getElementById("kpi-manut").textContent = fakeKPIs.manutencao.tipo;
  document.getElementById("kpi-manut-sub").textContent =
    "em " + fakeKPIs.manutencao.restanteKm.toLocaleString("pt-BR") + " km";
}

function carregarHistorico() {
  const tbody = document.getElementById("historico-body");
  tbody.innerHTML = "";

  fakeHistorico.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.tipo}</td>
      <td>${item.desc}</td>
      <td>${item.km.toLocaleString("pt-BR")}</td>
      <td>R$ ${item.valor.toFixed(2).replace(".", ",")}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarKPIs();
  carregarHistorico();
});

function logout() {
  window.location.href = "index.html";
}
