let totalMl = 0;

function addWater() {
    const input = document.getElementById("inputMl");
    const value = parseInt(input.value);
    if (!isNaN(value) && value > 0) {
        totalMl += value;
        document.getElementById("waterAmount").textContent = `${totalMl}ml`;
        input.value = "";
    }
}

document.getElementById("inputMl").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addWater();
    }
})

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

setInterval(updateCountdown, 1000); // atualiza a cada segundo
updateCountdown(); // inicializa ao carregar