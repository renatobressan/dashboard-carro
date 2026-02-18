document.addEventListener("DOMContentLoaded", async () => {

  const { data: { user }, error } = await window.sb.auth.getUser();

  if (error || !user) {
    console.error("Usuário não autenticado");
    window.location.href = "index.html";
    return;
  }

  console.log("User logado:", user.id);

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
  // FUNÇÕES BLINDADAS
  // ============================

  function safeNumber(value) {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    if (typeof value === "string") {
      const cleaned = value
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "");
      return Number(cleaned) || 0;
    }

    return 0;
  }

  function safeText(value) {
    if (!value) return "";
    return String(value).trim();
  }

  function safeDateBR(text) {
    if (!text) return null;
    const parts = text.split("/");
    if (parts.length !== 3) return null;
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }

  // ============================
  // NORMALIZAÇÃO
  // ============================

  data.forEach(row => {
    row._dataReal = safeDateBR(row["Data"]);
  });

  data.sort((a, b) => b._dataReal - a._dataReal);

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = safeNumber(ultimo["Odômetro (KM)"]);
  const kmAnterior = safeNumber(anterior["Odômetro (KM)"]);
  const litros = safeNumber(ultimo["Quantidade"]);
  const valorTotal = safeNumber(ultimo["Valor Total"]);
  const valorUnit = safeNumber(ultimo["Valor Unitário"]);

  const distancia = kmAtual - kmAnterior;

  const consumo =
    litros > 0 && distancia > 0
      ? distancia / litros
      : 0;

  const valorLitro =
    litros > 0 && valorTotal > 0
      ? valorTotal / litros
      : valorUnit;

  // ============================
  // MÉDIA ÚLTIMOS 20
  // ============================

  const ultimos20 = data.slice(0, 20);

  let soma = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = safeNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = safeNumber(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = safeNumber(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;

    if (litrosTemp > 0 && distTemp > 0) {
      const consTemp = distTemp / litrosTemp;

      if (!isNaN(consTemp) && isFinite(consTemp)) {
        soma += consTemp;
        contador++;
      }
    }
  }

  const media = contador > 0 ? soma / contador : 0;

  // ============================
  // ATUALIZAR CARDS
  // ============================

  document.getElementById("cardData").innerText =
    safeText(ultimo["Data"]);

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

    const km1 = safeNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = safeNumber(ultimos20[i - 1]["Odômetro (KM)"]);
    const litrosTemp = safeNumber(ultimos20[i - 1]["Quantidade"]);

    const distTemp = km2 - km1;

    if (litrosTemp > 0 && distTemp > 0) {
      const consTemp = distTemp / litrosTemp;
      labels.push(safeText(ultimos20[i - 1]["Data"]));
      consumoArray.push(consTemp);
    }
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
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });

}
