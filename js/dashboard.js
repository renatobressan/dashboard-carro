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

  // ===============================
  // FUNÇÕES DE PARSE
  // ===============================

  function parseKm(valor) {
    if (!valor) return 0;
    return Number(valor.toString().replace(/\./g, "").replace(",", "."));
  }

  function parseNumber(valor) {
    if (!valor) return 0;
    return Number(valor.toString().replace(",", "."));
  }

  // ===============================
  // ORDENAR POR KM DESC
  // ===============================

  data.sort((a, b) =>
    parseKm(b["Odômetro (KM)"]) - parseKm(a["Odômetro (KM)"])
  );

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = parseKm(ultimo["Odômetro (KM)"]);
  const kmAnterior = parseKm(anterior["Odômetro (KM)"]);
  const litros = parseNumber(ultimo["Quantidade"]);
  const valorTotal = parseNumber(ultimo["Valor Total"]);

  const distancia = kmAtual - kmAnterior;
  const consumo = distancia / litros;
  const valorLitro = valorTotal / litros;

  // ===============================
  // ATUALIZAR CARDS
  // ===============================

  document.getElementById("cardData").innerText = ultimo["Data"];
  document.getElementById("cardLocal").innerText = ultimo["Local"];

  document.getElementById("cardValor").innerText =
    `R$ ${valorTotal.toFixed(2)}`;

  document.getElementById("cardValorFooter").innerText =
    `R$ ${valorLitro.toFixed(2)} – ${litros.toFixed(2)} L`;

  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString("pt-BR");

  document.getElementById("cardKmFooter").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString("pt-BR")} KM`;

  document.getElementById("cardConsumo").innerText =
    consumo.toFixed(2);

  // ===============================
  // GRÁFICO (ÚLTIMOS 20)
  // ===============================

  const ultimos20 = data.slice(0, 20);

  const labels = [];
  const consumoData = [];

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = parseKm(ultimos20[i]["Odômetro (KM)"]);
    const km2 = parseKm(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = parseNumber(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;
    const consTemp = distTemp / litrosTemp;

    if (!isNaN(consTemp) && isFinite(consTemp)) {
      labels.push(ultimos20[i]["Data"]);
      consumoData.push(consTemp);
    }
  }

  const ctx = document.getElementById("consumoChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.reverse(),
      datasets: [{
        label: "Consumo (km/L)",
        data: consumoData.reverse(),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.15)",
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#cbd5e1" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: { color: "#cbd5e1" },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });

  // ===============================
  // HISTÓRICO COMPLETO
  // ===============================

  const container = document.getElementById("baseHistContainer");
  container.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.classList.add("hist-header");
  header.innerHTML = `
    <div>Data</div>
    <div>Item</div>
    <div>Local</div>
    <div>KM</div>
    <div>Qtd</div>
    <div>Total</div>
  `;
  container.appendChild(header);

  // Ordenar por data real desc
  data.forEach(row => {
    const [dia, mes, ano] = row["Data"].split("/");
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);
  });

  data.sort((a,b)=> b._dataReal - a._dataReal);

  data.forEach(row => {

    const linha = document.createElement("div");
    linha.classList.add("hist-row");

    linha.innerHTML = `
      <div>${row["Data"]}</div>
      <div>${row["Item"]}</div>
      <div>${row["Local"]}</div>
      <div>${parseKm(row["Odômetro (KM)"]).toLocaleString("pt-BR")}</div>
      <div>${parseNumber(row["Quantidade"]).toFixed(2)}</div>
      <div>R$ ${parseNumber(row["Valor Total"]).toFixed(2)}</div>
    `;

    container.appendChild(linha);

  });

}
