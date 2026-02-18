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
    console.error("Erro ao buscar Base_Hist:", error);
    alert("Erro ao carregar dados.");
    return;
  }

  if (!data || data.length < 2) {
    console.warn("Dados insuficientes para cálculo.");
    return;
  }

  // Converter data texto para Date real
  data.forEach(row => {
    const [dia, mes, ano] = row["Data"].split("/");
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);
  });

  // Ordenar mais recente primeiro
  data.sort((a, b) => b._dataReal - a._dataReal);

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = Number(ultimo["Odômetro (KM)"]);
  const kmAnterior = Number(anterior["Odômetro (KM)"]);
  const litros = Number(ultimo["Quantidade"]);
  const valor = Number(ultimo["Valor Total"]);
  const local = ultimo["Local"];

  const distancia = kmAtual - kmAnterior;
  const consumo = distancia / litros;

  // ===== ATUALIZAR CARDS =====

  // DATA
  document.getElementById("cardData").innerText =
    ultimo["Data"];

  document.getElementById("cardLocal").innerText =
    local;

  // VALOR
  document.getElementById("cardValor").innerText =
    `R$ ${valor.toFixed(2)}`;

  document.getElementById("cardLitros").innerText =
    `Litros abastecidos: ${litros}`;

  // KM
  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString();

  document.getElementById("cardDistancia").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString()} KM`;

  // CONSUMO (somente número)
  document.getElementById("cardConsumo").innerText =
    consumo.toFixed(2);

  // ===== GRÁFICO =====

  const ultimos20 = data.slice(0, 20);

  const labels = ultimos20.map(r => r["Data"]).reverse();
  const consumoData = [];

  for (let i = ultimos20.length - 1; i > 0; i--) {
    const km1 = Number(ultimos20[i - 1]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i - 1]["Quantidade"]);
    consumoData.push((km1 - km2) / litrosTemp);
  }

  const ctx = document.getElementById("consumoChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.slice(1),
      datasets: [{
        label: "Consumo (km/L)",
        data: consumoData,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.1)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
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

  // ===== HISTÓRICO =====

  const container = document.getElementById("baseHistContainer");
  container.innerHTML = "";

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

  data.forEach(row => {
    const div = document.createElement("div");
    div.classList.add("hist-row");

    div.innerHTML = `
      <div>${row["Data"]}</div>
      <div>${row["Item"]}</div>
      <div>${row["Local"]}</div>
      <div>${Number(row["Odômetro (KM)"]).toLocaleString()}</div>
      <div>${row["Quantidade"]}</div>
      <div>R$ ${Number(row["Valor Total"]).toFixed(2)}</div>
    `;

    container.appendChild(div);
  });

}
