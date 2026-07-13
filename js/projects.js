let editingProjectId = null;
// Save Project
const saveProjectBtn = document.getElementById("saveProjectBtn");

if (saveProjectBtn) {

    saveProjectBtn.addEventListener("click", function () {

    const projectId = document.getElementById("projectId").value.trim();

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    if(editingProjectId === null){

        const exists = projects.some(
            project => project.projectId === projectId
        );

        if(exists){
            alert("Project ID already exists!");
            return;
        }
    }

    const project = {
        projectId: document.getElementById("projectId").value,
        clientName: document.getElementById("clientName").value,
        businessName: document.getElementById("businessName").value,
        videoCount: document.getElementById("videoCount").value,
        deadline: document.getElementById("deadline").value,
        priority: document.getElementById("priority").value,
        status: "Planning",
        createdDate: new Date().toISOString().split("T")[0]
    };

    if(editingProjectId){

        const index = projects.findIndex(
            p => p.projectId === editingProjectId
        );

        projects[index] = project;

        editingProjectId = null;

    }else{

        projects.push(project);
    }

    localStorage.setItem("projects", JSON.stringify(projects));

    alert("Project Saved Successfully!");

    location.reload();
});

function loadProjects() {

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    const tableBody = document.getElementById("projectsBody");

    tableBody.innerHTML = "";

    projects.forEach(project => {

        tableBody.innerHTML += `
            <tr>
                <td>${project.projectId}</td>
                <td>${project.clientName}</td>
                <td>${project.businessName}</td>
                <td>${project.videoCount}</td>
                <td>${project.deadline}</td>
                <td>${project.priority}</td>
                <td>
                    <select onchange="updateStatus('${project.projectId}', this.value)">
                        <option value="Planning" ${project.status === "Planning" ? "selected" : ""}>Planning</option>
                        <option value="Script Pending" ${project.status === "Script Pending" ? "selected" : ""}>Script Pending</option>
                        <option value="Script Received" ${project.status === "Script Received" ? "selected" : ""}>Script Received</option>
                        <option value="Shooting Scheduled" ${project.status === "Shooting Scheduled" ? "selected" : ""}>Shooting Scheduled</option>
                        <option value="Editing" ${project.status === "Editing" ? "selected" : ""}>Editing</option>
                        <option value="Revision" ${project.status === "Revision" ? "selected" : ""}>Revision</option>
                        <option value="Uploaded" ${project.status === "Uploaded" ? "selected" : ""}>Uploaded</option>
                        <option value="Completed" ${project.status === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                </td>

                <td>
                    <button onclick="editProject('${project.projectId}')">
                        Edit
                    </button>

                    <button onclick="deleteProject('${project.projectId}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}

loadProjects();

function deleteProject(projectId){

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projects = projects.filter(
        project => project.projectId !== projectId
    );

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    loadProjects();
}

function editProject(projectId){

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const project = projects.find(
        p => p.projectId === projectId
    );

    if(!project) return;

    document.getElementById("projectId").value =
        project.projectId;

    document.getElementById("clientName").value =
        project.clientName;

    document.getElementById("businessName").value =
        project.businessName;

    document.getElementById("videoCount").value =
        project.videoCount;

    document.getElementById("deadline").value =
        project.deadline;

    document.getElementById("priority").value =
        project.priority;

    editingProjectId = projectId;

    modal.style.display = "block";
}

document.getElementById("searchProject")
.addEventListener("keyup", function(){

    const search = this.value.toLowerCase();

    const rows =
        document.querySelectorAll("#projectsBody tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        row.style.display =
            text.includes(search)
            ? ""
            : "none";
    });

});

loadProjects();

const modal =
    document.getElementById("projectModal");

document.getElementById("openModalBtn")
.addEventListener("click", () => {
    modal.style.display = "block";
});

document.getElementById("closeModal")
.addEventListener("click", () => {
    modal.style.display = "none";
});

function updateStatus(projectId, newStatus){

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const project =
        projects.find(
            p => p.projectId === projectId
        );

    if(project){
        project.status = newStatus;
    }

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    loadProjects();
    updateProjectCards();
}


function updateProjectCards(){

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const totalProjects = projects.length;

    const activeProjects = projects.filter(
        p => p.status !== "Completed"
    ).length;

    const completedProjects = projects.filter(
        p => p.status === "Completed"
    ).length;

    const overdueProjects = projects.filter(project => {

        const today = new Date();

        const deadline =
            new Date(project.deadline);

        return (
            deadline < today &&
            project.status !== "Completed"
        );

    }).length;

    document.getElementById("totalProjects").innerText =
        totalProjects;

    document.getElementById("activeProjects").innerText =
        activeProjects;

    document.getElementById("completedProjects").innerText =
        completedProjects;

    document.getElementById("overdueProjects").innerText =
        overdueProjects;
}

    loadProjects();
    updateProjectCards();
}

