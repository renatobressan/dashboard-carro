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
    .ilike("Tipo", "%abastecimento%");

  if (error) {
    console.error("Erro ao buscar Base_Hist:", error);
    return;
  }

  if (!data || data.length < 2) {
    console.warn("Dados insuficientes.");
    return;
  }

  // ===== TRATAR DATAS =====
  data.forEach(row => {
    const [dia, mes, ano] = row["Data"].split("/");
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);
  });

  data.sort((a, b) => b._dataReal - a._dataReal);

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = Number(ultimo["Odômetro (KM)"]);
  const kmAnterior = Number(anterior["Odômetro (KM)"]);
  const litros = Number(ultimo["Quantidade"]);
  const valorTotal = Number(ultimo["Valor Total"]);
  const valorLitro = litros > 0 ? valorTotal / litros : 0;

  const distancia = kmAtual - kmAnterior;
  const consumo = litros > 0 ? distancia / litros : 0;

  // ===== MÉDIA 20 =====
  const ultimos20 = data.slice(0, 20);
  let soma = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = Number(ultimos20[i]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;
    const consTemp = litrosTemp > 0 ? distTemp / litrosTemp : 0;

    if (!isNaN(consTemp) && isFinite(consTemp)) {
      soma += consTemp;
      contador++;
    }
  }

  const media = contador > 0 ? soma / contador : 0;

  // =========================
  // ATUALIZAR 4 CARDS
  // =========================

  document.getElementById("cardData").innerText = ultimo["Data"];
  document.getElementById("cardDataFooter").innerText = ultimo["Local"] || "--";

  document.getElementById("cardValor").innerText =
    `R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("cardValorFooter").innerText =
    `R$ ${valorLitro.toFixed(2)} – ${litros} L`;

  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString("pt-BR");

  document.getElementById("cardKmFooter").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString("pt-BR")} KM`;

  document.getElementById("cardConsumo").innerText =
    consumo.toFixed(2);

  document.getElementById("cardConsumoFooter").innerText =
    "Cálculo: (KM Atual - KM Anterior) ÷ Litros";

  // =========================
  // GRÁFICO
  // =========================

  const labels = ultimos20
    .map(r => r["Data"])
    .reverse();

  const consumoArray = [];

  for (let i = ultimos20.length - 1; i > 0; i--) {

    const km1 = Number(ultimos20[i]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i - 1]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i - 1]["Quantidade"]);

    const distTemp = km2 - km1;
    const consTemp = litrosTemp > 0 ? distTemp / litrosTemp : 0;

    consumoArray.push(consTemp);
  }

  const mediaArray = new Array(consumoArray.length).fill(media);

  const ctx = document.getElementById("consumoChart").getContext("2d");

  if (window.consumoChartInstance) {
    window.consumoChartInstance.destroy();
  }

  window.consumoChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.slice(1),
      datasets: [
        {
          label: "Consumo (km/L)",
          data: consumoArray,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 4
        },
        {
          label: "Média (últimos 20)",
          data: mediaArray,
          borderColor: "#ff4d4d",
          borderDash: [8, 6],
          borderWidth: 2,
          tension: 0,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#cbd5e1" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });

}
