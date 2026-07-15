const STORAGE_KEY = "editingTasks";

let editingTasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const modal = document.getElementById("editingModal");

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

document.getElementById("saveEditingBtn")
.addEventListener("click", saveEditingTask);

document.getElementById("searchEditing")
.addEventListener("keyup", searchEditing);

function loadProjects(){

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const dropdown =
        document.getElementById("projectId");

    dropdown.innerHTML =
        '<option value="">Select Project</option>';

    projects.forEach(project => {

        dropdown.innerHTML += `
            <option value="${project.projectId}">
                ${project.projectId} - ${project.businessName}
            </option>
        `;
    });
}

function saveEditingTask(){

    const task = {
        editingId:
            document.getElementById("editingId").value,

        projectId:
            document.getElementById("projectId").value,

        editorName:
            document.getElementById("editorName").value,

        assignedDate:
            document.getElementById("assignedDate").value,

        dueDate:
            document.getElementById("dueDate").value,

        status:
            document.getElementById("status").value
    };

    const editIndex =
        document.getElementById("editIndex").value;

    if(editIndex === ""){
        editingTasks.push(task);
    }
    else{
        editingTasks[editIndex] = task;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(editingTasks)
    );

    renderTasks();
    updateCards();

    modal.style.display = "none";
}

function renderTasks(){

    const body =
        document.getElementById("editingBody");

    body.innerHTML = "";

    editingTasks.forEach((task,index)=>{

        let statusClass = "status-pending";

        if(task.status === "In Progress"){
            statusClass = "status-progress";
        }

        if(task.status === "Completed"){
            statusClass = "status-completed";
        }

        body.innerHTML += `
            <tr>

                <td>${task.editingId}</td>

                <td>${task.projectId}</td>

                <td>${task.editorName}</td>

                <td>${task.assignedDate}</td>

                <td>${task.dueDate}</td>

                <td class="${statusClass}">
                    ${task.status}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editTask(${index})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${index})">
                        Delete
                    </button>

                </td>

            </tr>
        `;
    });
}

function editTask(index){

    loadProjects();

    const task = editingTasks[index];

    document.getElementById("editIndex").value =
        index;

    document.getElementById("editingId").value =
        task.editingId;

    document.getElementById("projectId").value =
        task.projectId;

    document.getElementById("editorName").value =
        task.editorName;

    document.getElementById("assignedDate").value =
        task.assignedDate;

    document.getElementById("dueDate").value =
        task.dueDate;

    document.getElementById("status").value =
        task.status;

    modal.style.display = "block";
}

function deleteTask(index){

    if(confirm("Delete this task?")){

        editingTasks.splice(index,1);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(editingTasks)
        );

        renderTasks();
        updateCards();
    }
}

function searchEditing(){

    const search =
        document.getElementById("searchEditing")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#editingBody tr"
        );

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase()
            .includes(search)
            ? ""
            : "none";
    });
}

function updateCards(){

    document.getElementById("totalTasks")
    .innerText = editingTasks.length;

    document.getElementById("pendingTasks")
    .innerText =
        editingTasks.filter(
            t => t.status === "Pending"
        ).length;

    document.getElementById("progressTasks")
    .innerText =
        editingTasks.filter(
            t => t.status === "In Progress"
        ).length;

    document.getElementById("completedTasks")
    .innerText =
        editingTasks.filter(
            t => t.status === "Completed"
        ).length;
}

function clearForm(){

    document.getElementById("editIndex").value = "";
    document.getElementById("editingId").value = "";
    document.getElementById("projectId").value = "";
    document.getElementById("editorName").value = "";
    document.getElementById("assignedDate").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("status").value = "Pending";
}

loadProjects();
renderTasks();
updateCards();