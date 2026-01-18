// Dados fake (simulando backend futuramente)
const fakeData = {
  veiculo: {
    modelo: "FOX 1.0",
    placa: "ABC-1234"
  },
  consumo: {
    medio: 12.4,
    periodo: "Últimos 30 dias"
  },
  km: {
    atual: 132745,
    atualizado: "Hoje"
  },
  manutencao: {
    tipo: "Óleo",
    restanteKm: 2300
  }
};

function carregarKPIs() {
  document.getElementById("kpi-veiculo").textContent = fakeData.veiculo.modelo;
  document.getElementById("kpi-veiculo-sub").textContent = "Placa " + fakeData.veiculo.placa;

  document.getElementById("kpi-consumo").textContent =
    fakeData.consumo.medio.toFixed(1).replace(".", ",") + " km/L";
  document.getElementById("kpi-consumo-sub").textContent = fakeData.consumo.periodo;

  document.getElementById("kpi-km").textContent =
    fakeData.km.atual.toLocaleString("pt-BR");
  document.getElementById("kpi-km-sub").textContent =
    "Atualizado " + fakeData.km.atualizado;

  document.getElementById("kpi-manut").textContent = fakeData.manutencao.tipo;
  document.getElementById("kpi-manut-sub").textContent =
    "em " + fakeData.manutencao.restanteKm.toLocaleString("pt-BR") + " km";
}

document.addEventListener("DOMContentLoaded", carregarKPIs);
