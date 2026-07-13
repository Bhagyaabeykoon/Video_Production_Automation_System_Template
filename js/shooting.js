const modal =
    document.getElementById("shootingModal");

document.getElementById("openModalBtn")
.addEventListener("click", () => {

    modal.style.display = "block";
});

document.getElementById("closeModal")
.addEventListener("click", () => {

    modal.style.display = "none";
});

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

let editingShootIndex = null;

document.getElementById("saveShootBtn")
.addEventListener("click", function(){

    const shoot = {

        projectId:
            document.getElementById("projectId").value,

        videoNumber:
            document.getElementById("videoNumber").value,

        shootDate:
            document.getElementById("shootDate").value,

        shootTime:
            document.getElementById("shootTime").value,

        location:
            document.getElementById("location").value,

        presenter:
            document.getElementById("presenter").value,

        status:
            "Scheduled"
    };

    let shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    if(editingShootIndex !== null){

        shootings[editingShootIndex] = shoot;

        editingShootIndex = null;

    }else{

        shootings.push(shoot);
    }

    localStorage.setItem(
        "shootings",
        JSON.stringify(shootings)
    );

    alert("Shoot Saved Successfully!");

    location.reload();
});

function loadShoots(){

    const shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    const tableBody =
        document.getElementById("shootingBody");

    tableBody.innerHTML = "";

    shootings.forEach((shoot, index) => {

        tableBody.innerHTML += `
            <tr>
                <td>${shoot.projectId}</td>
                <td>${shoot.videoNumber}</td>
                <td>${shoot.shootDate}</td>
                <td>${shoot.shootTime}</td>
                <td>${shoot.location}</td>
                <td>${shoot.presenter}</td>

                <td>
                    <select onchange="updateShootStatus(${index}, this.value)">
                        <option value="Scheduled"
                        ${shoot.status === "Scheduled" ? "selected" : ""}>
                            Scheduled
                        </option>

                        <option value="Completed"
                        ${shoot.status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>
                    </select>
                </td>

                <td>
                    <button onclick="editShoot(${index})">
                        Edit
                    </button>

                    <button onclick="deleteShoot(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteShoot(index){

    let shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    shootings.splice(index,1);

    localStorage.setItem(
        "shootings",
        JSON.stringify(shootings)
    );

    loadShoots();
    updateShootCards();
}

function editShoot(index){

    const shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    const shoot =
        shootings[index];

    document.getElementById("projectId").value =
        shoot.projectId;

    document.getElementById("videoNumber").value =
        shoot.videoNumber;

    document.getElementById("shootDate").value =
        shoot.shootDate;

    document.getElementById("shootTime").value =
        shoot.shootTime;

    document.getElementById("location").value =
        shoot.location;

    document.getElementById("presenter").value =
        shoot.presenter;

    editingShootIndex = index;

    modal.style.display = "block";
}

function updateShootStatus(index,newStatus){

    let shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    shootings[index].status = newStatus;

    localStorage.setItem(
        "shootings",
        JSON.stringify(shootings)
    );

    loadShoots();
    updateShootCards();
}

function updateShootCards(){

    const shootings =
        JSON.parse(localStorage.getItem("shootings")) || [];

    document.getElementById("totalShoots").innerText =
        shootings.length;

    document.getElementById("scheduledShoots").innerText =
        shootings.filter(
            s => s.status === "Scheduled"
        ).length;

    document.getElementById("completedShoots").innerText =
        shootings.filter(
            s => s.status === "Completed"
        ).length;

    document.getElementById("pendingShoots").innerText =
        shootings.filter(
            s => s.status !== "Completed"
        ).length;
}

loadProjectsDropdown();
loadShoots();
updateShootCards();