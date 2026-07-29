// Data e tempo
const today = new Date();
const todayStr = today.toDateString();

// Mapeamento da semana: Seg = 0, Dom = 6
const getWeekIndex = (date) => (date.getDay() + 6) % 7;
const todayIndex = getWeekIndex(today);

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// LocalStorage
let totalMl = Number(localStorage.getItem("totalMl")) || 0;
let dailyGoal = Number(localStorage.getItem("dailyGoal")) || 2000; // Meta padrão: 2000ml
let weekData = JSON.parse(localStorage.getItem("weekData")) || Array(7).fill(0);
let savedDate = localStorage.getItem("savedDate");

// Reset diário e semanal
function checkDayChange() {
    if (savedDate && savedDate !== todayStr) {
        const yesterday = new Date(savedDate);
        const yesterdayIndex = getWeekIndex(yesterday);

        // Salva a quantidade do dia anterior
        weekData[yesterdayIndex] = totalMl;
        totalMl = 0; // Reseta o consumo diário
    }

    // Reset semanal na segunda-feira
    if (todayIndex === 0 && savedDate && getWeekIndex(new Date(savedDate)) !== 0) {
        weekData = Array(7).fill(0);
    }

    localStorage.setItem("totalMl", totalMl);
    localStorage.setItem("weekData", JSON.stringify(weekData));
    localStorage.setItem("savedDate", todayStr);
}

checkDayChange();

// DOM
const waterAmount = document.getElementById("waterAmount");
const goalDisplay = document.getElementById("goalDisplay");
const progressBar = document.getElementById("progressBar");
const weekContainer = document.getElementById("weekAmount");
const inputMl = document.getElementById("inputMl");
const goalInput = document.getElementById("goalInput");
const themeToggle = document.getElementById("themeToggle");

const modal = document.getElementById("goalModal");
const openBtn = document.getElementById("openGoalModal");
const closeBtn = document.getElementById("closeGoalModal");

// Botões que faltavam vincular
const btnSaveGoal = document.getElementById("btnSaveGoal");
const btnAddWater = document.getElementById("btnAddWater");

// Atualiza a interface
function updateProgress() {
    if (!dailyGoal) return;

    const percent = Math.min((totalMl / dailyGoal) * 100, 100);
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent >= 100 ? "Meta alcançada!" : `${Math.floor(percent)}%`;
    
    // Cor de destaque quando atinge a meta
    if (percent >= 100) {
        progressBar.style.backgroundColor = "#28a745";
    } else {
        progressBar.style.backgroundColor = "var(--primary-color)";
    }
}

function displayWeek() {
    weekContainer.innerHTML = "";

    weekData.forEach((ml, i) => {
        const box = document.createElement("div");
        box.className = "day-box";
        
        if (i === todayIndex) {
            box.classList.add("today");
        }

        box.innerHTML = `<strong>${weekDays[i]}</strong><br><small>${ml}ml</small>`;
        weekContainer.appendChild(box);
    });
}

function renderUI() {
    waterAmount.textContent = `${totalMl}ml`;
    goalDisplay.textContent = `Meta: ${dailyGoal}ml`;
    displayWeek();
    updateProgress();
}

// Lógica do consumo
function addWater() {
    const value = Number(inputMl.value);

    if (!value || value <= 0) return;

    totalMl += value;
    weekData[todayIndex] = totalMl;

    localStorage.setItem("totalMl", totalMl);
    localStorage.setItem("weekData", JSON.stringify(weekData));

    inputMl.value = "";
    renderUI();
}

function setGoal() {
    const value = Number(goalInput.value);

    if (!value || value <= 0) return;

    dailyGoal = value;
    localStorage.setItem("dailyGoal", dailyGoal);

    goalInput.value = "";
    closeModal();
    renderUI();
}

// Modal e eventos
function closeModal() {
    modal.style.display = "none";
}

openBtn.onclick = () => {
    modal.style.display = "flex";
    goalInput.value = dailyGoal;
};

if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = (e) => {
    if (e.target === modal) closeModal();
};

// VÍNCULO DOS BOTÕES DE AÇÃO (O que estava faltando)
if (btnSaveGoal) btnSaveGoal.addEventListener("click", setGoal);
if (btnAddWater) btnAddWater.addEventListener("click", addWater);

// Suporte para tecla Enter nos inputs
inputMl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addWater();
});

goalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") setGoal();
});

// Alternar tema
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Inicialização da tela ao carregar a página
renderUI();