const today = new Date();
const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
const todayStr = today.toLocaleDateString();

let totalMl = 0;

// Dias da semana abreviados
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Recupera dados da semana do localStorage
let weekData = JSON.parse(localStorage.getItem("weekData")) || [0,0,0,0,0,0,0];
let savedDate = localStorage.getItem("savedDate");

// Reset semanal automático no domingo
if(dayOfWeek === 0 && savedDate && new Date(savedDate).getDay() !== 0){
    weekData = [0,0,0,0,0,0,0];
    localStorage.setItem("weekData", JSON.stringify(weekData));
}

// Verifica se é um novo dia
if(savedDate !== todayStr){
    // Salva o total do dia anterior
    if(savedDate){
        const yesterday = new Date(savedDate);
        const yesterdayIndex = yesterday.getDay();
        weekData[yesterdayIndex] = parseInt(localStorage.getItem("totalMl")) || 0;
    }
    // Zera o total do dia atual
    totalMl = 0;
    localStorage.setItem("totalMl","0");
    localStorage.setItem("savedDate", todayStr);
    localStorage.setItem("weekData", JSON.stringify(weekData));
}else{
    totalMl = parseInt(localStorage.getItem("totalMl")) || 0;
}

// Exibe consumo diário
document.getElementById("waterAmount").textContent = `${totalMl}ml`;
document.getElementById("yesterdayAmount").textContent = `${localStorage.getItem("yesterdayMl") || "0"}ml`;

// Função para criar a visualização da semana em caixinhas
function displayWeek() {
    let weekContainer = document.getElementById("weekAmount");
    if(!weekContainer){
        weekContainer = document.createElement("div");
        weekContainer.id = "weekAmount";
        weekContainer.style.display = "flex";
        weekContainer.style.justifyContent = "space-between";
        weekContainer.style.marginTop = "10px";
        document.querySelector(".container").appendChild(weekContainer);
    }
    weekContainer.innerHTML = "";

    weekData.forEach((ml, i) => {
        const dayBox = document.createElement("div");
        dayBox.style.flex = "1";
        dayBox.style.margin = "2px";
        dayBox.style.padding = "5px";
        dayBox.style.textAlign = "center";
        dayBox.style.borderRadius = "5px";
        dayBox.style.color = "#fff";

        // Diferenciar cores: dia atual, passado e futuro
        if(i === dayOfWeek){
            dayBox.style.backgroundColor = "#007BFF"; // azul dia atual
        } else if(i < dayOfWeek){
            dayBox.style.backgroundColor = "#28a745"; // verde dias passados
        } else {
            dayBox.style.backgroundColor = "#6c757d"; // cinza dias futuros
        }

        dayBox.innerHTML = `<strong>${weekDays[i]}</strong><br>${ml}ml`;
        weekContainer.appendChild(dayBox);
    });
}
displayWeek();

// Função para adicionar água
function addWater() {
    const input = document.getElementById("inputMl");
    const value = parseInt(input.value);

    if(!isNaN(value) && value > 0){
        totalMl += value;
        document.getElementById("waterAmount").textContent = `${totalMl}ml`;
        localStorage.setItem("totalMl", totalMl);
        localStorage.setItem("savedDate", todayStr);
        input.value = "";
        alert(`${value} ml foram adicionados!`);
        displayWeek(); // Atualiza a semana visual
    }
}

document.getElementById("inputMl").addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addWater();
    }
});

// Timer até a meia-noite
function updateCountdown(){
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24,0,0,0);

    const diff = midnight - now;
    const hours = String(Math.floor(diff / (1000*60*60))).padStart(2,'0');
    const minutes = String(Math.floor((diff % (1000*60*60))/(1000*60))).padStart(2,'0');
    const seconds = String(Math.floor((diff % (1000*60))/1000)).padStart(2,'0');

    document.getElementById("countdown").textContent = `${hours}h:${minutes}min:${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Tema (escuro/claro)
const themeToggle = document.getElementById("themeToggle");
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});