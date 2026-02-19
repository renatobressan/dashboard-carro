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
  // SAFE NUMBER DEFINITIVO (corrige 133,244)
  // ============================

  function safeNumber(value) {

    if (value === null || value === undefined) return 0;

    if (typeof value === "number") {
      return isFinite(value) ? value : 0;
    }

    if (typeof value === "string") {

      let v = value.trim();
      if (v === "") return 0;

      // remove separador de milhar corretamente
      if (/^\d{1,3}(\.\d{3})+,\d+$/.test(v)) {
        v = v.replace(/\./g, "").replace(",", ".");
      }
      else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(v)) {
        v = v.replace(/,/g, "");
      }
      else if (v.includes(",") && !v.includes(".")) {
        v = v.replace(",", ".");
      }

      const num = Number(v);
      return isFinite(num) ? num : 0;
    }

    return 0;
  }

  function safeText(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  }

  function safeDateBR(text) {
    if (!text) return null;
    const parts = String(text).split("/");
    if (parts.length !== 3) return null;
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return isNaN(d) ? null : d;
  }

  // ============================
  // NORMALIZAÇÃO
  // ============================

  data.forEach(row => {
    row._dataReal = safeDateBR(row["Data"]);
  });

  const dataValida = data.filter(r => r._dataReal instanceof Date);

  if (dataValida.length < 2) {
    console.warn("Datas inválidas.");
    return;
  }

  dataValida.sort((a, b) => b._dataReal.getTime() - a._dataReal.getTime());

  const ultimo = dataValida[0];
  const anterior = dataValida[1];

  const kmAtual = safeNumber(ultimo["Odômetro (KM)"]);
  const kmAnterior = safeNumber(anterior["Odômetro (KM)"]);
  const litros = safeNumber(ultimo["Quantidade"]);
  const valorTotal = safeNumber(ultimo["Valor Total"]);
  const valorUnit = safeNumber(ultimo["Valor Unitário"]);
  const localUltimo = safeText(ultimo["Local"]);

  // ============================
  // DISTÂNCIA CORRIGIDA
  // ============================

  let distancia = 0;

  if (
    kmAtual > kmAnterior &&
    (kmAtual - kmAnterior) > 0 &&
    (kmAtual - kmAnterior) < 2000
  ) {
    distancia = kmAtual - kmAnterior;
  }

  // ============================
  // CONSUMO CORRIGIDO
  // ============================

  let consumo = 0;

  if (litros > 0 && distancia > 0) {
    const calc = distancia / litros;

    if (isFinite(calc) && calc > 2 && calc < 40) {
      consumo = calc;
    }
  }

  const valorLitro =
    valorUnit > 0
      ? valorUnit
      : (litros > 0 ? valorTotal / litros : 0);

  // ============================
  // MÉDIA
  // ============================

  const ultimos20 = dataValida.slice(0, 20);

  let soma = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = safeNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = safeNumber(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = safeNumber(ultimos20[i]["Quantidade"]);

    const distTemp =
      km1 > km2 && (km1 - km2) < 2000
        ? km1 - km2
        : 0;

    if (litrosTemp > 0 && distTemp > 0) {
      const consTemp = distTemp / litrosTemp;
      if (isFinite(consTemp) && consTemp > 2 && consTemp < 40) {
        soma += consTemp;
        contador++;
      }
    }
  }

  const media = contador > 0 ? soma / contador : 0;

  // ============================
  // CARDS
  // ============================

  document.getElementById("cardData").innerText = safeText(ultimo["Data"]);
  document.getElementById("cardDataFooter").innerText = localUltimo;

  document.getElementById("cardValor").innerText =
    `R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("cardValorFooter").innerText =
    `R$ ${valorLitro.toFixed(3)} – ${litros.toFixed(2)} L`;

  document.getElementById("cardKm").innerText =
    kmAtual.toLocaleString("pt-BR");

  document.getElementById("cardKmFooter").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString("pt-BR")} KM`;

  document.getElementById("cardConsumo").innerText =
    consumo > 0 ? consumo.toFixed(2) : "--";

    const consumoFooter = document.getElementById("cardConsumoFooter");
    if (consumoFooter) {
      consumoFooter.innerText =
        "Cálculo: (KM Atual - KM Anterior) ÷ Litros";
    }

  // ============================
  // GRÁFICO
  // ============================

  const labels = [];
  const consumoArray = [];

  for (let i = ultimos20.length - 1; i > 0; i--) {

    const km1 = safeNumber(ultimos20[i]["Odômetro (KM)"]);
    const km2 = safeNumber(ultimos20[i - 1]["Odômetro (KM)"]);
    const litrosTemp = safeNumber(ultimos20[i - 1]["Quantidade"]);

    const distTemp =
      km2 > km1 && (km2 - km1) < 2000
        ? km2 - km1
        : 0;

    if (litrosTemp > 0 && distTemp > 0) {
      const consTemp = distTemp / litrosTemp;
      if (isFinite(consTemp) && consTemp > 2 && consTemp < 40) {
        labels.push(safeText(ultimos20[i - 1]["Data"]));
        consumoArray.push(consTemp);
      }
    }
  }

  const canvas = document.getElementById("consumoChart");

  if (canvas && consumoArray.length > 0) {

    const ctx = canvas.getContext("2d");

    if (window.consumoChartInstance) {
      window.consumoChartInstance.destroy();
    }

    const mediaArray = consumoArray.map(() => media);

    window.consumoChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
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
        maintainAspectRatio: false
      }
    });
  }

  // ============================
  // HISTÓRICO
  // ============================

  const container = document.getElementById("baseHistContainer");
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.zIndex = "1";

  dataValida.forEach(row => {

    const div = document.createElement("div");
    div.classList.add("hist-row");

    div.innerHTML = `
      <div>${safeText(row["Data"])}</div>
      <div>${safeText(row["Placa"])}</div>
      <div>${safeText(row["Tipo"])}</div>
      <div>${safeText(row["Item"])}</div>
      <div>${safeText(row["Local"])}</div>
      <div>${safeNumber(row["Odômetro (KM)"]).toLocaleString("pt-BR")}</div>
      <div>R$ ${safeNumber(row["Valor Unitário"]).toFixed(3)}</div>
      <div>${safeNumber(row["Quantidade"]).toFixed(2)}</div>
      <div>R$ ${safeNumber(row["Valor Total"]).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
      <div>${safeText(row["Anotações"])}</div>
    `;

    container.appendChild(div);
  });

}
