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
}

document.getElementById("inputMl").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
         addWater();
        }
    });

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