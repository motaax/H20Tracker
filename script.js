/*DATA / TEMPO*/
const today = new Date()
const todayStr = today.toDateString()

// Semana(Seg = 0, Dom = 6)
const getWeekIndex = (date) => (date.getDay() + 6) % 7
const todayIndex = getWeekIndex(today)

/*CONSTANTES*/
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

/*STORAGE*/
let totalMl = Number(localStorage.getItem("totalMl")) || 0
let dailyGoal = Number(localStorage.getItem("dailyGoal")) || 0
let weekData = JSON.parse(localStorage.getItem("weekData")) || Array(7).fill(0)
let savedDate = localStorage.getItem("savedDate")

/*RESET DIÁRIO / SEMANAL*/
function checkDayChange() {
    if (savedDate !== todayStr && savedDate) {
        const yesterday = new Date(savedDate)
        const yesterdayIndex = getWeekIndex(yesterday)

        // salva ontem
        weekData[yesterdayIndex] = totalMl
        totalMl = 0
    }

    // reset semanal automático (segunda-feira)
    if (todayIndex === 0 && savedDate && getWeekIndex(new Date(savedDate)) !== 0) {
        weekData = Array(7).fill(0)
    }

    localStorage.setItem("totalMl", totalMl)
    localStorage.setItem("weekData", JSON.stringify(weekData))
    localStorage.setItem("savedDate", todayStr)
}

checkDayChange()

/*UI*/
const waterAmount = document.getElementById("waterAmount")
const goalDisplay = document.getElementById("goalDisplay")
const progressBar = document.getElementById("progressBar")
const weekContainer = document.getElementById("weekAmount")

waterAmount.textContent = `${totalMl}ml`
goalDisplay.textContent = `Meta: ${dailyGoal}ml`

/*PROGRESSO*/
function updateProgress() {
    if (!dailyGoal) return

    const percent = Math.min((totalMl / dailyGoal) * 100, 100)
    progressBar.style.width = percent + "%"
    progressBar.textContent = percent >= 100 ? "Meta alcançada!" : `${Math.floor(percent)}%`
    progressBar.style.backgroundColor = percent >= 100 ? "#28a745" : "#007BFF"
}

/*SEMANA*/
function displayWeek() {
    weekContainer.innerHTML = ""

    weekData.forEach((ml, i) => {
        const box = document.createElement("div")
        box.className = "day-box"
        box.style.background = i === todayIndex ? "#007BFF" : "#6c757d"
        box.innerHTML = `<strong>${weekDays[i]}</strong><br>${ml}ml`
        weekContainer.appendChild(box)
    })
}

displayWeek()
updateProgress()

/*AÇÕES*/
function addWater() {
    const input = document.getElementById("inputMl")
    const value = Number(input.value)

    if (!value) return

    totalMl += value
    weekData[todayIndex] = totalMl

    localStorage.setItem("totalMl", totalMl)
    localStorage.setItem("weekData", JSON.stringify(weekData))

    waterAmount.textContent = `${totalMl}ml`
    input.value = ""

    displayWeek()
    updateProgress()
}

function setGoal() {
    const input = document.getElementById("goalInput")
    const value = Number(input.value)

    if (!value) return

    dailyGoal = value
    localStorage.setItem("dailyGoal", dailyGoal)
    goalDisplay.textContent = `Meta: ${dailyGoal}ml`

    input.value = ""
    updateProgress()
}

/*EVENTOS*/
document.getElementById("inputMl").addEventListener("keydown", e => {
    if (e.key === "Enter") addWater()
})

document.getElementById("goalInput").addEventListener("keydown", e => {
    if (e.key === "Enter") setGoal()
})

//Alternar Temas
const themeToggle = document.getElementById("themeToggle")

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark")
    themeToggle.textContent = "☀️"
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark")

    const isDark = document.body.classList.contains("dark")
    themeToggle.textContent = isDark ? "☀️" : "🌙"
    localStorage.setItem("theme", isDark ? "dark" : "light")
})

const modal = document.getElementById("goalModal")
const openBtn = document.getElementById("openGoalModal")
const closeBtn = document.querySelector(".close")

openBtn.onclick = () => modal.style.display = "flex"
closeBtn.onclick = closeModal

window.onclick = (e) => {
    if (e.target === modal) closeModal()
}

function closeModal() {
    modal.style.display = "none"
}

function setGoal() {
    const input = document.getElementById("goalInput")
    const value = Number(input.value)

    if (!value) return

    dailyGoal = value
    localStorage.setItem("dailyGoal", dailyGoal)
    goalDisplay.textContent = `Meta: ${dailyGoal}ml`

    input.value = ""
    closeModal()
    updateProgress()
}