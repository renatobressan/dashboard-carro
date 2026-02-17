document.addEventListener("DOMContentLoaded", async () => {

  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("userEmail").innerText = user.email;

  loadCars();
});


async function addCar() {

  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  if (!marca || !modelo || !placa) {
    alert("Preencha todos os campos");
    return;
  }

  const { data: { user } } = await sb.auth.getUser();

  const { error } = await sb
    .from("cars")
    .insert([
      {
        marca: marca,
        modelo: modelo,
        placa: placa,
        user_id: user.id
      }
    ]);

  if (error) {
    alert("Erro ao salvar: " + error.message);
    return;
  }

  document.getElementById("marca").value = "";
  document.getElementById("modelo").value = "";
  document.getElementById("placa").value = "";

  loadCars();
}


async function loadCars() {

  const { data: { user } } = await sb.auth.getUser();

  const { data, error } = await sb
    .from("cars")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    alert("Erro ao carregar carros: " + error.message);
    return;
  }

  const carList = document.getElementById("carList");
  carList.innerHTML = "";

  data.forEach(car => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>
        ${car.marca} - ${car.modelo} - ${car.placa}
      </p>
    `;
    carList.appendChild(div);
  });
}


async function logout() {
  await sb.auth.signOut();
  window.location.href = "index.html";
}
