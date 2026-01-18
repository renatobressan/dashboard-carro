const ctx = document.getElementById('graficoConsumo');

let chart;

function renderGrafico(dados) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map(d => d.data),
      datasets: [{
        label: 'km/L',
        data: dados.map(d => d.valor),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.3,
        fill: true
      }]
    }
  });
}

function filtrar(dias) {
  const dados = dias === 30 ? dados30 : dados60;
  renderGrafico(dados);
}

const dados30 = [
  { data: '01/01', valor: 12.1 },
  { data: '05/01', valor: 12.5 },
  { data: '10/01', valor: 12.8 }
];

const dados60 = [
  { data: '01/12', valor: 11.9 },
  { data: '15/12', valor: 12.0 },
  { data: '01/01', valor: 12.1 },
  { data: '10/01', valor: 12.8 }
];

renderGrafico(dados30);

const historico = [
  ['10/01/2026','Abastecimento','Gasolina','132.745','279,90'],
  ['22/12/2025','Manutenção','Troca de óleo','130.500','180,00']
];

const tbody = document.getElementById('historico');
historico.forEach(r => {
  const tr = document.createElement('tr');
  r.forEach(c => {
    const td = document.createElement('td');
    td.innerText = c;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
});

function logout() {
  window.location.href = 'index.html';
}
