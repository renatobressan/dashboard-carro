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
    .eq("Tipo", "Abastecimento")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return;
  }

  if (!data || data.length < 2) {
    console.warn("Dados insuficientes.");
    return;
  }

  // ================================
  // ORDENAR POR ODÔMETRO DESC
  // ================================

  data.sort((a, b) =>
    Number(b["Odômetro (KM)"]) - Number(a["Odômetro (KM)"])
  );

  const ultimo = data[0];     // maior KM
  const anterior = data[1];   // segundo maior KM

  const kmAtual = Number(ultimo["Odômetro (KM)"]);
  const kmAnterior = Number(anterior["Odômetro (KM)"]);
  const litros = Number(ultimo["Quantidade"]);
  const valorTotal = Number(ultimo["Valor Total"]);

  // ================================
  // CÁLCULOS CORRETOS
  // ================================

  const distancia = kmAtual - kmAnterior; // agora correto
  const consumo = distancia / litros;     // agora correto
  const valorLitro = valorTotal / litros;

  // ================================
  // ATUALIZAR CARDS
  // ================================

  document.getElementById("cardData").innerText =
    ultimo["Data"];

  document.getElementById("cardLocal").innerText =
    ultimo["Local"];

  document.getElementById("cardValor").innerText =
    `R$ ${valorTotal.toFixed(2)}`;

  document.getElementById("cardValorFooter").innerText =
    `R$ ${valorLitro.toFixed(2)} – ${litros.toFixed(2)} L`;

  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString();

  document.getElementById("cardKmFooter").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString()} KM`;

  document.getElementById("cardConsumo").innerText =
    consumo.toFixed(2);

  // ================================
  // GRÁFICO CONSUMO
  // ================================

  const ultimos20 = data.slice(0, 20);

  const labels = [];
  const consumoData = [];

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = Number(ultimos20[i]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;
    const consTemp = distTemp / litrosTemp;

    if (!isNaN(consTemp) && isFinite(consTemp)) {
      labels.push(ultimos20[i]["Data"]);
      consumoData.push(consTemp);
    }
  }

  new Chart(document.getElementById("consumoChart"), {
    type: "line",
    data: {
      labels: labels.reverse(),
      datasets: [{
        label: "Consumo (km/L)",
        data: consumoData.reverse(),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.1)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: { ticks: { color: "#cbd5e1" } },
        y: { ticks: { color: "#cbd5e1" } }
      }
    }
  });

}
