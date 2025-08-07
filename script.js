const today = new Date().toLocaleDateString();

let savedDate = localStorage.getItem("savedDate");
let totalMl = 0;

// Verifica se é um novo dia
if (savedDate !== today) {
    const yesterdayMl = localStorage.getItem("totalMl") || "0";
    localStorage.setItem("yesterdayMl", yesterdayMl);
    localStorage.setItem("totalMl", "0");
    localStorage.setItem("savedDate", today);
        totalMl = 0;
    } else {
        totalMl = parseInt(localStorage.getItem("totalMl")) || 0;
    }

// Exibir valores
document.getElementById("waterAmount").textContent = `${totalMl}ml`;
document.getElementById("yesterdayAmount").textContent = `${localStorage.getItem("yesterdayMl") || "0"}ml`;

//Adiciona uma quantidade de água
function addWater() {
    const input = document.getElementById("inputMl");
    const value = parseInt(input.value);
    if (!isNaN(value) && value > 0) {
        totalMl += value;
        document.getElementById("waterAmount").textContent = `${totalMl}ml`;
        localStorage.setItem("totalMl", totalMl);
        localStorage.setItem("savedDate", today);
        input.value = "";
    }
    alert(`${value} ml foram adicionados!`)
}

document.getElementById("inputMl").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
         addWater();
        }
    });

//Verifica se o dia acabou
function updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diff = midnight - now;
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    document.getElementById("countdown").textContent = `${hours}h:${minutes}min:${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Checar se o tema foi salvo anteriormente
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    // Atualiza o texto/ícone do botão
    themeToggle.textContent = isDark ? "☀️" : "🌙";

    // Salva preferência
    localStorage.setItem("theme", isDark ? "dark" : "light");
});