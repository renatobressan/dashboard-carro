// ===============================
// DASHBOARD - DADOS REAIS
// ===============================

(async () => {
  try {
    // 1) Verifica usuário autenticado
    const { data: authData, error: authError } = await sb.auth.getUser();

    if (authError || !authData?.user) {
      console.warn("Usuário não autenticado. Redirecionando...");
      window.location.href = "index.html";
      return;
    }

    const userId = authData.user.id;
    console.log("Usuário logado:", userId);

    // 2) Buscar dados reais da tabela Base_Hist
    const { data, error } = await sb
      .from("Base_Hist")
      .select("*")
      .eq("user_id", userId)
      .order("Data", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Erro ao buscar Base_Hist:", error);
      return;
    }

    console.log("Dados Base_Hist:", data);

    // 3) KPIs básicos (exemplo)
    if (data.length > 0) {
      const ultimo = data[0];

      document.getElementById("kpiVeiculo").innerText =
        ultimo.Modelo || "-";

      document.getElementById("kpiPlaca").innerText =
        ultimo.Placa || "-";

      document.getElementById("kpiKm").innerText =
        ultimo["Odômetro (KM)"] || "-";

      // Consumo médio simples (exemplo)
      const consumos = data
        .filter(d => d.Quantidade && d["Odômetro (KM)"])
        .map(d => Number(d.Quantidade));

      if (consumos.length) {
        const media =
          consumos.reduce((a, b) => a + b, 0) / consumos.length;
        document.getElementById("kpiConsumo").innerText =
          media.toFixed(2) + " km/L";
      }
    }

    // 4) Preencher tabela de histórico
    const tbody = document.getElementById("tabelaHistorico");
    tbody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.Data || "-"}</td>
        <td>${row.Tipo || "-"}</td>
        <td>${row.Item || "-"}</td>
        <td>${row["Odômetro (KM)"] || "-"}</td>
        <td>R$ ${row["Valor Total"] || "-"}</td>
      `;
      tbody.appendChild(tr);
    });

    // 5) Logout
    document.getElementById("btnLogout").onclick = async () => {
      await sb.auth.signOut();
      window.location.href = "index.html";
    };

  } catch (e) {
    console.error("Erro inesperado no dashboard:", e);
  }
})();
