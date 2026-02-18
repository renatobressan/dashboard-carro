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

  // ============================
  // FUNÇÃO BLINDADA DE NÚMERO
  // ============================
  function parseNumber(value) {
    if (value === null || value === undefined) return 0;

    return Number(
      value
        .toString()
        .replace(/\./g, "")      // remove milhar
        .replace(",", ".")       // ajusta decimal
        .replace(/[^\d.-]/g, "") // remove lixo
    ) || 0;
  }

  // ============================
  // CONVERTER DATA
  // ============================
  data.forEach(row => {

    if (!row["Data"]) return;

    const partes = row["Data"].split("/");
    if (partes.length !== 3) return;

    const [dia, mes, ano] = partes;
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);

  });

  data = data.filter(r => r._dataReal instanceof Date && !isNaN(r._dataReal));

  data.sort((a, b) => b._dataReal - a._dataReal);

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = parseNumber(ultimo["Odômetro (KM)"]);
  const kmAnterior = parseNumber(anterior["Odômetro (KM)"]);
  const litros = parseNumber(ultimo["Quantidade"]);
  const valorTotal = parseNumber(ultimo["Valor Total"]);

  const valorLitro = litros > 0 ? valorTotal / litros : 0;
  const distancia = kmAtual > kmAnterior ? kmAtual - kmAnterior : 0;
  const consumo = litros > 0 && distancia > 0 ? distancia / litros : 0;

  // ============================
  // MÉDIA 20
  // ============================
  const ultimos20 = data.slice(0, 20);

  let soma = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = parseNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = parseNumber(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = parseNumber(ultimos20[i]["Quantidade"]);

    const distTemp = km1 > km2 ? km1 - km2 : 0;
    const consTemp = litrosTemp > 0 && distTemp > 0 ? distTemp / litrosTemp : 0;

    if (consTemp > 0 && isFinite(consTemp)) {
      soma += consTemp;
      contador++;
    }
  }

  const media = contador > 0 ? soma / contador : 0;

  // ============================
  // ATUALIZAR CARDS
  // ============================

  document.getElementById("cardData").innerText = ultimo["Data"] || "--";

  document.getElementById("cardValor").innerText =
    `R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString("pt-BR");

  document.getElementById("cardConsumo").innerText =
    consumo > 0 ? consumo.toFixed(2) : "--";

  // ============================
  // GRÁFICO
  // ============================

  const labels = [];
  const consumoArray = [];

  for (let i = ultimos20.length - 1; i > 0; i--) {

    const km1 = parseNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = parseNumber(ultimos20[i - 1]["Odômetro (KM)"]);
    const litrosTemp = parseNumber(ultimos20[i - 1]["Quantidade"]);

    const distTemp = km2 > km1 ? km2 - km1 : 0;
    const consTemp = litrosTemp > 0 && distTemp > 0 ? distTemp / litrosTemp : 0;

    labels.push(ultimos20[i - 1]["Data"]);
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
      labels: labels,
      datasets: [
        {
          label: "Consumo (km/L)",
          data: consumoArray,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.15)",
          tension: 0.3,
          fill: true
        },
        {
          label: "Média (últimos 20)",
          data: mediaArray,
          borderColor: "#ff4d4d",
          borderDash: [8, 6],
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          grid: { color: "rgba(255,255,255,0.05)" },
          beginAtZero: false
        }
      }
    }
  });

}
