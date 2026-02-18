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
  // FUNÇÕES AUXILIARES
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

  // ===============================
  // CALCULAR MÉDIA
  // ===============================

  const soma = consumoData.reduce((acc, val) => acc + val, 0);
  const media = consumoData.length > 0 ? soma / consumoData.length : 0;

  // Criar array da média para desenhar linha horizontal
  const mediaArray = new Array(consumoData.length).fill(media);

  // ===============================
  // RENDERIZAR GRÁFICO
  // ===============================

  const ctx = document.getElementById("consumoChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.reverse(),
      datasets: [
        {
          label: "Consumo (km/L)",
          data: consumoData.reverse(),
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 4
        },
        {
          label: "Média (últimos 20)",
          data: mediaArray.reverse(),
          borderColor: "#ef4444",
          borderDash: [8, 6], // 🔴 Linha tracejada
          tension: 0,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#cbd5e1"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        },
        y: {
          ticks: {
            color: "#cbd5e1"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  });

}
