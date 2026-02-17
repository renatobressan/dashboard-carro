document.addEventListener("DOMContentLoaded", async () => {

const { data: { user } } = await window.sb.auth.getUser();

if (!user) {
window.location.href = "index.html";
return;
}

loadCars();
});

async function addCar() {

const marca = document.getElementById("marca").value;
const modelo = document.getElementById("modelo").value;
const placa = document.getElementById("placa").value;

const { data: { user } } = await window.sb.auth.getUser();

const { error } = await window.sb.from("cars").insert([{
marca,
modelo,
placa,
user_id: user.id
}]);

if (error) {
alert(error.message);
return;
}

loadCars();
}

async function loadCars() {

const { data: { user } } = await window.sb.auth.getUser();

const { data, error } = await window.sb
.from("cars")
.select("*")
.eq("user_id", user.id)
.order("id", { ascending: false });

if (error) {
alert(error.message);
return;
}

const list = document.getElementById("carList");
list.innerHTML = "";

data.forEach(car => {
const div = document.createElement("div");
div.innerHTML = `<strong>${car.marca}</strong> - ${car.modelo} (${car.placa})`;
list.appendChild(div);
});
}

async function logout() {
await window.sb.auth.signOut();
window.location.href = "index.html";
}
