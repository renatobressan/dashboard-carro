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
  // FUNÇÃO PARA LIMPAR KM
  // ================================

  function parseKm(valor) {
    if (!valor) return 0;
    return Number(valor.toString().replace(/\./g, "").replace(",", "."));
  }

  function parseNumber(valor) {
    if (!valor) return 0;
    return Number(valor.toString().replace(",", "."));
  }

  // ================================
  // ORDENAR POR KM REAL DESC
  // ================================

  data.sort((a, b) =>
    parseKm(b["Odômetro (KM)"]) - parseKm(a["Odômetro (KM)"])
  );

  const ultimo = data[0];
  const anterior = data[1];

  const kmAtual = parseKm(ultimo["Odômetro (KM)"]);
  const kmAnterior = parseKm(anterior["Odômetro (KM)"]);
  const litros = parseNumber(ultimo["Quantidade"]);
  const valorTotal = parseNumber(ultimo["Valor Total"]);

  // ================================
  // CÁLCULOS CORRETOS
  // ================================

  const distancia = kmAtual - kmAnterior;
  const consumo = distancia / litros;
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
    kmAtual.toLocaleString("pt-BR");

  document.getElementById("cardKmFooter").innerText =
    `Distância desde o anterior: ${distancia.toLocaleString("pt-BR")} KM`;

  document.getElementById("cardConsumo").innerText =
    consumo.toFixed(2);

}
