const today = new Date();
const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
const todayStr = today.toLocaleDateString();

let totalMl = 0;
let dailyGoal = parseInt(localStorage.getItem("dailyGoal")) || 0;

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

// Reset diário
if(savedDate !== todayStr){
    if(savedDate){
        const yesterday = new Date(savedDate);
        const yesterdayIndex = yesterday.getDay();
        weekData[yesterdayIndex] = parseInt(localStorage.getItem("totalMl")) || 0;
    }
    totalMl = 0;
    localStorage.setItem("totalMl","0");
    localStorage.setItem("savedDate", todayStr);
    localStorage.setItem("weekData", JSON.stringify(weekData));
}else{
    totalMl = parseInt(localStorage.getItem("totalMl")) || 0;
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
document.getElementById("goalDisplay").textContent = `Meta: ${dailyGoal}ml`;
updateProgress();

// Função meta
function setGoal(){
    const inputGoal = document.getElementById("goalInput");
    const value = parseInt(inputGoal.value);

    if(!isNaN(value) && value > 0){
        dailyGoal = value;
        localStorage.setItem("dailyGoal", dailyGoal);
        document.getElementById("goalDisplay").textContent = `Meta: ${dailyGoal}ml`;
        updateProgress();
        closeModal();
        inputGoal.value = "";
    }
}

//ENTER para definir a meta
document.getElementById("goalInput").addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        setGoal();
    }
});

// Progresso
function updateProgress(){
    const progressBar = document.getElementById("progressBar");
    if(dailyGoal > 0){
        let percent = Math.min((totalMl / dailyGoal) * 100, 100);
        progressBar.style.width = percent + "%";
        progressBar.textContent = percent >= 100 ? "Meta alcançada! 🎉" : `${Math.floor(percent)}%`;
        progressBar.style.backgroundColor = percent >= 100 ? "#28a745" : "#007BFF";
    } else {
        progressBar.style.width = "0%";
        progressBar.textContent = "0%";
    }
}

// Semana
function displayWeek() {
    let weekContainer = document.getElementById("weekAmount");
    weekContainer.innerHTML = "";

    weekData.forEach((ml, i) => {
        const dayBox = document.createElement("div");
        if(i === dayOfWeek){
            dayBox.style.backgroundColor = "#007BFF";
        } else if(i < dayOfWeek){
            dayBox.style.backgroundColor = "#28a745";
        } else {
            dayBox.style.backgroundColor = "#6c757d";
        }
        dayBox.innerHTML = `<strong>${weekDays[i]}</strong><br>${ml}ml`;
        weekContainer.appendChild(dayBox);
    });
}
displayWeek();

// Função para criar a visualização da semana em caixas coloridas
function displayWeek() {
    let weekContainer = document.getElementById("weekAmount");
    if(!weekContainer){
        weekContainer = document.createElement("div");
        weekContainer.id = "weekAmount";
        weekContainer.style.display = "flex";
        weekContainer.style.justifyContent = "space-between";
        weekContainer.style.marginTop = "30px";
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
        updateProgress()
    }
}

//Enter como botão de adicionar o valor de ML
document.getElementById("inputMl").addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addWater();
    }
    updateProgress()
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

// Modal meta
const modal = document.getElementById("goalModal");
const openBtn = document.getElementById("openGoalModal");
const closeBtn = document.querySelector(".close");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => closeModal();
window.onclick = (event) => { if(event.target == modal) closeModal(); }

function closeModal(){
    modal.style.display = "none";
}