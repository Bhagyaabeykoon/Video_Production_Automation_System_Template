const modal =
    document.getElementById("scriptModal");

document.getElementById("openModalBtn")
.addEventListener("click", () => {

    modal.style.display = "block";
});

document.getElementById("closeModal")
.addEventListener("click", () => {

    modal.style.display = "none";
});

document.getElementById("saveScriptBtn")
.addEventListener("click", function(){

    const script = {

        projectId:
            document.getElementById("projectId").value,

        videoNumber:
            document.getElementById("videoNumber").value,

        requestedDate:
            document.getElementById("requestedDate").value,

        receivedDate:
            document.getElementById("receivedDate").value,

        scriptWriter:
            document.getElementById("scriptWriter").value,

        status:
            "Pending"
    };

    let scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    if(editingScriptIndex !== null){

        scripts[editingScriptIndex] = script;

        editingScriptIndex = null;

    }else{

        scripts.push(script);
    }

    localStorage.setItem(
        "scripts",
        JSON.stringify(scripts)
    );

    loadScripts();
    updateScriptCards();

    alert("Script Saved Successfully!");

    location.reload();

});

function loadScripts(){

    const scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    const tableBody =
        document.getElementById("scriptsBody");

    tableBody.innerHTML = "";

    scripts.forEach((script, index) => {

        tableBody.innerHTML += `
            <tr>
                <td>${script.projectId}</td>
                <td>${script.videoNumber}</td>
                <td>${script.requestedDate}</td>
                <td>${script.receivedDate}</td>
                <td>${script.scriptWriter}</td>
                <td>
                    <select onchange="updateScriptStatus(${index}, this.value)">
                        <option value="Pending"
                            ${script.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Received"
                            ${script.status === "Received" ? "selected" : ""}>
                            Received
                        </option>
                    </select>
                </td>

                <td>
                    <button onclick="editScript(${index})">
                        Edit
                    </button>

                    <button onclick="deleteScript(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

}


function loadProjectsDropdown(){

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

loadScripts();
loadProjectsDropdown();
updateScriptCards();

let editingScriptIndex = null;

function deleteScript(index){

    let scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    scripts.splice(index, 1);

    localStorage.setItem(
        "scripts",
        JSON.stringify(scripts)
    );

    loadScripts();
    updateScriptCards();
}

function editScript(index){

    const scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    const script = scripts[index];

    document.getElementById("projectId").value =
        script.projectId;

    document.getElementById("videoNumber").value =
        script.videoNumber;

    document.getElementById("requestedDate").value =
        script.requestedDate;

    document.getElementById("receivedDate").value =
        script.receivedDate;

    document.getElementById("scriptWriter").value =
        script.scriptWriter;

    editingScriptIndex = index;

    modal.style.display = "block";
}

function updateScriptStatus(index, newStatus){

    let scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    scripts[index].status = newStatus;

    localStorage.setItem(
        "scripts",
        JSON.stringify(scripts)
    );

    updateProjectScriptStatus(
        scripts[index].projectId
    );

    loadScripts();
    updateScriptCards();
}

document.getElementById("searchScript")
.addEventListener("keyup", function(){

    const search =
        this.value.toLowerCase();

    const rows =
        document.querySelectorAll("#scriptsBody tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(search)
            ? ""
            : "none";
    });

});

function updateScriptCards(){

    const scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    const totalScripts =
        scripts.length;

    const pendingScripts =
        scripts.filter(
            s => s.status === "Pending"
        ).length;

    const receivedScripts =
        scripts.filter(
            s => s.status === "Received"
        ).length;

    const overdueScripts =
        scripts.filter(script => {

            if(!script.receivedDate)
                return false;

            return (
                new Date(script.receivedDate)
                < new Date()
                &&
                script.status !== "Received"
            );

        }).length;

    document.getElementById("totalScripts").innerText =
        totalScripts;

    document.getElementById("pendingScripts").innerText =
        pendingScripts;

    document.getElementById("receivedScripts").innerText =
        receivedScripts;

    document.getElementById("overdueScripts").innerText =
        overdueScripts;
}
function updateProjectScriptStatus(projectId){

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const scripts =
        JSON.parse(localStorage.getItem("scripts")) || [];

    const projectScripts =
        scripts.filter(
            s => s.projectId === projectId
        );

    const allReceived =
        projectScripts.length > 0 &&
        projectScripts.every(
            s => s.status === "Received"
        );

    const project =
        projects.find(
            p => p.projectId === projectId
        );

    if(project){

        if(allReceived){
            project.status =
                "Script Received";
        }
        else{
            project.status =
                "Script Pending";
        }

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );
    }
}