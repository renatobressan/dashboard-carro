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
    console.error("Erro ao buscar dados:", error);
    alert("Erro ao carregar dados.");
    return;
  }

  if (!data || data.length < 2) {
    console.warn("Dados insuficientes.");
    return;
  }

  // Converter data texto dd/mm/yyyy para Date real
  data.forEach(row => {
    const [dia, mes, ano] = row["Data"].split("/");
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);
  });

  // Ordenar por data mais recente
  data.sort((a, b) => b._dataReal - a._dataReal);

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = Number(ultimo["Odômetro (KM)"]);
  const kmAnterior = Number(anterior["Odômetro (KM)"]);
  const litros = Number(ultimo["Quantidade"]);
  const valor = Number(ultimo["Valor Total"]);

  const distancia = kmAtual - kmAnterior;
  const consumo = distancia / litros;

  // ===== MÉDIA ÚLTIMAS 20 =====

  const ultimos20 = data.slice(0, 20);

  let soma = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = Number(ultimos20[i]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;
    const consTemp = distTemp / litrosTemp;

    if (!isNaN(consTemp) && isFinite(consTemp)) {
      soma += consTemp;
      contador++;
    }
  }

  const media = contador > 0 ? soma / contador : 0;

  // ===== ATUALIZAR CARDS =====

  document.getElementById("cardData").innerText = ultimo["Data"];
  document.getElementById("cardValor").innerText = `R$ ${valor.toFixed(2)}`;
  document.getElementById("cardKm").innerText = kmAtual.toLocaleString();
  document.getElementById("cardConsumo").innerText = consumo.toFixed(2) + " km/L";
  document.getElementById("cardMedia").innerText = "média: " + media.toFixed(2) + " km/L";

  renderChart(ultimos20);
  renderHistorico(data);

}



function renderChart(dados) {

  const labels = [];
  const valores = [];

  for (let i = dados.length - 1; i > 0; i--) {

    const atual = dados[i - 1];
    const anterior = dados[i];

    const km1 = Number(atual["Odômetro (KM)"]);
    const km2 = Number(anterior["Odômetro (KM)"]);
    const litros = Number(atual["Quantidade"]);

    const distancia = km1 - km2;
    const consumo = distancia / litros;

    if (!isNaN(consumo)) {
      labels.push(atual["Data"]);
      valores.push(consumo.toFixed(2));
    }
  }

  const ctx = document.getElementById("consumoChart");

  if (window.consumoChartInstance) {
    window.consumoChartInstance.destroy();
  }

  window.consumoChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Consumo (km/L)",
        data: valores,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.1)",
        tension: 0.3,
        fill: true
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



function renderHistorico(data) {

  const container = document.getElementById("baseHistContainer");

  container.innerHTML = `
    <div class="hist-header">
      <div>Data</div>
      <div>Item</div>
      <div>Local</div>
      <div>KM</div>
      <div>Qtd</div>
      <div>Total</div>
    </div>
  `;

  data.forEach(row => {

    const div = document.createElement("div");
    div.classList.add("hist-row");

    div.innerHTML = `
      <div>${row["Data"]}</div>
      <div>${row["Item"] || "-"}</div>
      <div>${row["Local"] || "-"}</div>
      <div>${Number(row["Odômetro (KM)"]).toLocaleString()}</div>
      <div>${row["Quantidade"]}</div>
      <div>R$ ${Number(row["Valor Total"]).toFixed(2)}</div>
    `;

    container.appendChild(div);

  });

}
