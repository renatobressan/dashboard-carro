document.addEventListener("DOMContentLoaded", async () => {

  const { data: { user } } = await window.sb.auth.getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadDashboard();

});

async function loadDashboard() {

  const { data, error } = await window.sb
    .from("Base_Hist")
    .select("*")
    .ilike("Tipo", "%abastecimento%");

  if (error) {
    console.error("Erro ao buscar Base_Hist:", error);
    alert("Erro ao carregar dados.");
    return;
  }

  if (!data || data.length < 2) {
    console.warn("Dados insuficientes para cálculo.");
    return;
  }

  // Converter Data (texto dd/mm/yyyy) para objeto Date real
  data.forEach(row => {
    const [dia, mes, ano] = row["Data"].split("/");
    row._dataReal = new Date(`${ano}-${mes}-${dia}`);
  });

  // Ordenar corretamente pela data
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
  let somaConsumo = 0;
  let contador = 0;

  for (let i = 0; i < ultimos20.length - 1; i++) {

    const km1 = Number(ultimos20[i]["Odômetro (KM)"]);
    const km2 = Number(ultimos20[i + 1]["Odômetro (KM)"]);
    const litrosTemp = Number(ultimos20[i]["Quantidade"]);

    const distTemp = km1 - km2;
    const consTemp = distTemp / litrosTemp;

    if (!isNaN(consTemp) && isFinite(consTemp)) {
      somaConsumo += consTemp;
      contador++;
    }

  }

  const media = contador > 0 ? somaConsumo / contador : 0;

  // ===== ATUALIZAR CARDS =====

  const elData = document.getElementById("cardData");
  const elValor = document.getElementById("cardValor");
  const elKm = document.getElementById("cardKm");
  const elConsumo = document.getElementById("cardConsumo");
  const elMedia = document.getElementById("cardMedia");
  const elContainer = document.getElementById("baseHistContainer");

  if (!elData || !elValor || !elKm || !elConsumo || !elMedia || !elContainer) {
    console.error("Algum ID do dashboard não foi encontrado no HTML.");
    return;
  }

  elData.innerText = ultimo["Data"];
  elValor.innerText = `R$ ${valor.toFixed(2)}`;
  elKm.innerText = kmAtual.toLocaleString();
  elConsumo.innerText = consumo.toFixed(2) + " km/L";
  elMedia.innerText = "média: " + media.toFixed(2) + " km/L";

  // ===== BASE HIST =====

  elContainer.innerHTML = "";

  data.forEach(row => {

    const div = document.createElement("div");
    div.classList.add("hist-row");

    div.innerHTML = `
      <strong>${row["Data"]}</strong> |
      KM: ${Number(row["Odômetro (KM)"]).toLocaleString()} |
      Litros: ${row["Quantidade"]} |
      Total: R$ ${Number(row["Valor Total"]).toFixed(2)}
    `;

    elContainer.appendChild(div);

  });

}
