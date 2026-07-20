// Load Data
const projects = JSON.parse(localStorage.getItem("projects")) || [];
const budgets = JSON.parse(localStorage.getItem("vpasBudgets")) || [];
const editingTasks = JSON.parse(localStorage.getItem("editingTasks")) || [];
const revisionTasks = JSON.parse(localStorage.getItem("revisionTasks")) || [];

// -----------------------------
// KPI Cards
// -----------------------------

// Total Projects
document.getElementById("totalProjects").textContent = projects.length;

// Active Videos
const activeVideos = projects.reduce((total, project) => {
    return total + Number(project.videoCount || 0);
}, 0);

document.getElementById("activeVideos").textContent = activeVideos;

// In Editing
const editingCount = editingTasks.filter(task =>
    task.status !== "Completed"
).length;

document.getElementById("editingCount").textContent = editingCount;

// Pending Revisions
const pendingRevisionCount = revisionTasks.filter(task =>
    task.status === "Pending"
).length;

document.getElementById("pendingRevisions").textContent = pendingRevisionCount;

// Uploaded Videos
document.getElementById("uploadedVideos").textContent = 0;

// Revenue (Total Planned Budget)
const totalRevenue = budgets.reduce((sum, budget) => {
    return sum + Number(budget.plannedBudget || 0);
}, 0);

document.getElementById("revenue").textContent =
    "Rs. " + totalRevenue.toLocaleString();


// -----------------------------
// Recent Activities
// -----------------------------

const activityList = document.getElementById("recentActivities");

if (activityList) {

    activityList.innerHTML = "";

    projects.slice(-5).reverse().forEach(project => {

        activityList.innerHTML += `
            <div class="activity-item">
                <span>📁 New Project Created : ${project.projectId}</span>
                <small>${project.clientName}</small>
            </div>
        `;
    });

}


// -----------------------------
// Upcoming Shoots
// -----------------------------

const upcomingShoots = document.getElementById("upcomingShoots");

if (upcomingShoots) {

    const shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    upcomingShoots.innerHTML = "";

    shootings
        .filter(shoot => shoot.status === "Scheduled")
        .sort((a, b) => new Date(a.shootDate) - new Date(b.shootDate))
        .slice(0, 5)
        .forEach(shoot => {

            upcomingShoots.innerHTML += `
                <div class="shoot-item">
                    <strong>${shoot.projectId}</strong>
                    <p>${shoot.shootDate} - ${shoot.shootTime}</p>
                </div>
            `;

        });

}