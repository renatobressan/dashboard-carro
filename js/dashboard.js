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
  { data: "10/01", consumo: 12.8 },
  { data: "15/01", consumo: 11.9 },
  { data: "20/01", consumo: 12.4 },
  { data: "25/01", consumo: 13.1 },
  { data: "30/01", consumo: 12.6 }
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

function carregarGrafico() {
  const ctx = document.getElementById("consumoChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: fakeHistorico.map(i => i.data),
      datasets: [{
        label: "Consumo km/L",
        data: fakeHistorico.map(i => i.consumo),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarKPIs();
  carregarGrafico();
});

function logout() {
  window.location.href = "index.html";
}
