const STORAGE_KEY = "revisionTasks";

let revisionTasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const modal = document.getElementById("revisionModal");

document.getElementById("openModalBtn")
.addEventListener("click", () => {
    clearForm();
    loadProjects();
    modal.style.display = "block";
});

document.getElementById("closeModal")
.addEventListener("click", () => {
    modal.style.display = "none";
});

document.getElementById("saveRevisionBtn")
.addEventListener("click", saveRevision);

document.getElementById("searchRevision")
.addEventListener("keyup", searchRevision);

function loadProjects(){

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const dropdown =
        document.getElementById("projectId");

    dropdown.innerHTML =
        `<option value="">Select Project</option>`;

    projects.forEach(project => {

        dropdown.innerHTML += `
            <option value="${project.projectId}">
                ${project.projectId} - ${project.businessName}
            </option>
        `;
    });
}

function saveRevision(){

    const revision = {

        revisionId:
            document.getElementById("revisionId").value,

        projectId:
            document.getElementById("projectId").value,

        editorName:
            document.getElementById("editorName").value,

        revisionCount:
            document.getElementById("revisionCount").value,

        dueDate:
            document.getElementById("dueDate").value,

        status:
            document.getElementById("status").value
    };

    const editIndex =
        document.getElementById("editIndex").value;

    if(editIndex === ""){
        revisionTasks.push(revision);
    }
    else{
        revisionTasks[editIndex] = revision;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(revisionTasks)
    );

    renderRevisions();
    updateCards();

    modal.style.display = "none";
}

function renderRevisions(){

    const body =
        document.getElementById("revisionBody");

    body.innerHTML = "";

    revisionTasks.forEach((task,index)=>{

        let statusClass = "status-pending";

        if(task.status === "In Progress"){
            statusClass = "status-progress";
        }

        if(task.status === "Completed"){
            statusClass = "status-completed";
        }

        body.innerHTML += `
            <tr>
                <td>${task.revisionId}</td>
                <td>${task.projectId}</td>
                <td>${task.editorName}</td>
                <td>${task.revisionCount}</td>
                <td>${task.dueDate}</td>
                <td class="${statusClass}">
                    ${task.status}
                </td>

                <td>
                    <button class="edit-btn"
                        onclick="editRevision(${index})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteRevision(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function editRevision(index){

    loadProjects();

    const task = revisionTasks[index];

    document.getElementById("editIndex").value = index;
    document.getElementById("revisionId").value = task.revisionId;
    document.getElementById("projectId").value = task.projectId;
    document.getElementById("editorName").value = task.editorName;
    document.getElementById("revisionCount").value = task.revisionCount;
    document.getElementById("dueDate").value = task.dueDate;
    document.getElementById("status").value = task.status;

    modal.style.display = "block";
}

function deleteRevision(index){

    if(confirm("Delete this revision?")){

        revisionTasks.splice(index,1);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(revisionTasks)
        );

        renderRevisions();
        updateCards();
    }
}

function searchRevision(){

    const search =
        document.getElementById("searchRevision")
        .value.toLowerCase();

    const rows =
        document.querySelectorAll("#revisionBody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(search)
            ? ""
            : "none";
    });
}

function updateCards(){

    document.getElementById("totalRevisions").innerText =
        revisionTasks.length;

    document.getElementById("pendingRevisions").innerText =
        revisionTasks.filter(
            t => t.status === "Pending"
        ).length;

    document.getElementById("progressRevisions").innerText =
        revisionTasks.filter(
            t => t.status === "In Progress"
        ).length;

    document.getElementById("completedRevisions").innerText =
        revisionTasks.filter(
            t => t.status === "Completed"
        ).length;
}

function clearForm(){

    document.getElementById("editIndex").value = "";
    document.getElementById("revisionId").value = "";
    document.getElementById("projectId").value = "";
    document.getElementById("editorName").value = "";
    document.getElementById("revisionCount").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("status").value = "Pending";
}

loadProjects();
renderRevisions();
updateCards();