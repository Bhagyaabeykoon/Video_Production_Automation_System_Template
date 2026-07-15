function loadProjects() {
    const projectDropdown = document.getElementById("projectName");

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projectDropdown.innerHTML =
        `<option value="">Select Project</option>`;

    projects.forEach(project => {
        projectDropdown.innerHTML += `
            <option value="${project.projectId}">
                ${project.projectId} - ${project.businessName}
            </option>
        `;
    });
}

const STORAGE_KEY = "vpasBudgets";

let budgets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const budgetModal = document.getElementById("budgetModal");
const addBudgetBtn = document.getElementById("addBudgetBtn");
const closeModal = document.getElementById("closeModal");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");

addBudgetBtn.addEventListener("click", () => {
    clearForm();
    budgetModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    budgetModal.style.display = "none";
});

saveBudgetBtn.addEventListener("click", saveBudget);

document.getElementById("searchInput")
.addEventListener("keyup", searchBudget);

loadProjectsToDropdown();
renderBudgets();
updateKPIs();

function saveBudget(){

    const budget = {
        budgetId: document.getElementById("budgetId").value,
        projectName: document.getElementById("projectName").value,
        plannedBudget: Number(document.getElementById("plannedBudget").value),
        scriptCost: Number(document.getElementById("scriptCost").value),
        shootingCost: Number(document.getElementById("shootingCost").value),
        editingCost: Number(document.getElementById("editingCost").value),
        uploadCost: Number(document.getElementById("uploadCost").value),
        miscCost: Number(document.getElementById("miscCost").value)
    };

    budget.actualSpent =
        budget.scriptCost +
        budget.shootingCost +
        budget.editingCost +
        budget.uploadCost +
        budget.miscCost;

    budget.remaining =
        budget.plannedBudget - budget.actualSpent;

    if(budget.actualSpent < budget.plannedBudget){
        budget.status = "Under Budget";
    }
    else if(budget.actualSpent === budget.plannedBudget){
        budget.status = "Completed";
    }
    else{
        budget.status = "Over Budget";
    }

    const editIndex = document.getElementById("editIndex").value;

    if(editIndex === ""){
        budgets.push(budget);
    }
    else{
        budgets[editIndex] = budget;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(budgets)
    );

    loadProjectsToDropdown();
    renderBudgets();
    updateKPIs();

    budgetModal.style.display = "none";
}

function renderBudgets(){

    const tableBody =
        document.getElementById("budgetTableBody");

    tableBody.innerHTML = "";

    budgets.forEach((budget,index)=>{

        let statusClass = "status-under";

        if(budget.status === "Over Budget"){
            statusClass = "status-over";
        }

        if(budget.status === "Completed"){
            statusClass = "status-complete";
        }

        tableBody.innerHTML += `
            <tr>
                <td>${budget.budgetId}</td>
                <td>${budget.projectName}</td>
                <td>Rs. ${budget.plannedBudget}</td>
                <td>Rs. ${budget.actualSpent}</td>
                <td>Rs. ${budget.remaining}</td>
                <td class="${statusClass}">
                    ${budget.status}
                </td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="editBudget(${index})">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteBudget(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function loadProjectsToDropdown() {

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const dropdown =
        document.getElementById("projectName");

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

function editBudget(index){

    const budget = budgets[index];

    loadProjectsToDropdown();

    document.getElementById("editIndex").value = index;

    document.getElementById("budgetId").value =
        budget.budgetId;

    document.getElementById("projectName").value =
        budget.projectName;

    document.getElementById("plannedBudget").value =
        budget.plannedBudget;

    document.getElementById("scriptCost").value =
        budget.scriptCost;

    document.getElementById("shootingCost").value =
        budget.shootingCost;

    document.getElementById("editingCost").value =
        budget.editingCost;

    document.getElementById("uploadCost").value =
        budget.uploadCost;

    document.getElementById("miscCost").value =
        budget.miscCost;

    budgetModal.style.display = "block";
}

function deleteBudget(index){

    if(confirm("Delete this budget?")){

        budgets.splice(index,1);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(budgets)
        );

        loadProjectsToDropdown();
        renderBudgets();
        updateKPIs();
    }
}

function searchBudget(){

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#budgetTableBody tr"
        );

    rows.forEach(row=>{

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(search)
            ? ""
            : "none";
    });
}

function updateKPIs(){

    document.getElementById("totalBudgets").innerText =
        budgets.length;

    const totalPlanned =
        budgets.reduce(
            (sum,b)=>sum+b.plannedBudget,
            0
        );

    const totalSpent =
        budgets.reduce(
            (sum,b)=>sum+b.actualSpent,
            0
        );

    const remaining =
        totalPlanned - totalSpent;

    document.getElementById("totalPlanned").innerText =
        `Rs. ${totalPlanned}`;

    document.getElementById("totalSpent").innerText =
        `Rs. ${totalSpent}`;

    document.getElementById("remainingAmount").innerText =
        `Rs. ${remaining}`;
}

function clearForm(){

    document.getElementById("editIndex").value = "";
    document.getElementById("budgetId").value = "";
    document.getElementById("projectName").value = "";
    document.getElementById("plannedBudget").value = "";
    document.getElementById("scriptCost").value = "";
    document.getElementById("shootingCost").value = "";
    document.getElementById("editingCost").value = "";
    document.getElementById("uploadCost").value = "";
    document.getElementById("miscCost").value = "";
}