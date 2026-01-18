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
// Histórico consumo fake
// ======================
const consumoHistorico = [
  { dia: "01/01", consumo: 12.2 },
  { dia: "05/01", consumo: 12.6 },
  { dia: "10/01", consumo: 12.8 },
  { dia: "15/01", consumo: 11.9 },
  { dia: "20/01", consumo: 12.4 },
  { dia: "25/01", consumo: 13.1 },
  { dia: "30/01", consumo: 12.6 },
  { dia: "05/02", consumo: 12.9 },
  { dia: "10/02", consumo: 13.0 },
  { dia: "15/02", consumo: 12.7 }
];

let chart = null;

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

function criarGrafico(dados) {
  const ctx = document.getElementById("consumoChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dados.map(d => d.dia),
      datasets: [{
        label: "Consumo km/L",
        data: dados.map(d => d.consumo),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function aplicarFiltro(dias) {
  const filtrado = dias === 30
    ? consumoHistorico.slice(-5)
    : consumoHistorico;

  criarGrafico(filtrado);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarKPIs();
  aplicarFiltro(30);
});

function logout() {
  window.location.href = "index.html";
}
