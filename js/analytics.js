/* ===========================
   VPAS Analytics Dashboard
=========================== */

// LocalStorage Data

const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

const budgets =
    JSON.parse(localStorage.getItem("budgets")) || [];

const editingTasks =
    JSON.parse(localStorage.getItem("editingTasks")) || [];

const revisionTasks =
    JSON.parse(localStorage.getItem("revisionTasks")) || [];

const uploadTasks =
    JSON.parse(localStorage.getItem("uploadTasks")) || [];



/* ===========================
   KPI Cards
=========================== */

function loadKPIs(){

    // Total Projects

    document.getElementById("totalProjects").innerText =
        projects.length;



    // Total Budget

    let totalBudget = 0;

    budgets.forEach(budget=>{

        totalBudget += Number(
            budget.actualCost || budget.amount || 0
        );

    });

    document.getElementById("totalBudget").innerText =
        "Rs. " + totalBudget.toLocaleString();



    // Completed Editing

    const completedEditing =

        editingTasks.filter(task=>

            task.status==="Completed"

        ).length;

    document.getElementById("completedVideos").innerText =
        completedEditing;



    // Upload Tasks

    document.getElementById("totalUploads").innerText =
        uploadTasks.length;



    // Uploaded

    const uploaded =

        uploadTasks.filter(task=>

            task.status==="Uploaded"

        ).length;

    document.getElementById("uploadedVideos").innerText =
        uploaded;



    // Revisions

    document.getElementById("revisionCount").innerText =
        revisionTasks.length;



    // Pending

    let pending = 0;

    editingTasks.forEach(task=>{

        if(task.status==="Pending")
            pending++;

    });

    revisionTasks.forEach(task=>{

        if(task.status==="Pending")
            pending++;

    });

    uploadTasks.forEach(task=>{

        if(task.status==="Pending")
            pending++;

    });

    document.getElementById("pendingTasks").innerText =
        pending;



    // Completion %

    let totalTasks =

        editingTasks.length +

        revisionTasks.length +

        uploadTasks.length;

    let completedTasks =

        completedEditing +

        uploaded +

        revisionTasks.filter(

            task=>task.status==="Completed"

        ).length;

    let percentage = 0;

    if(totalTasks>0){

        percentage = Math.round(

            completedTasks/totalTasks*100

        );

    }

    document.getElementById("completionRate").innerText =
        percentage + "%";

}



/* ===========================
   Analytics Table
=========================== */

function loadProjectTable(){

    const body =

        document.getElementById("analyticsBody");

    body.innerHTML="";



    projects.forEach(project=>{

        // Budget

        const budget =

            budgets.find(b=>

                b.projectId===project.projectId

            );



        // Editing

        const edit =

            editingTasks.find(e=>

                e.projectId===project.projectId

            );



        // Revisions

        const revision =

            revisionTasks.find(r=>

                r.projectId===project.projectId

            );



        // Upload

        const upload =

            uploadTasks.find(u=>

                u.projectId===project.projectId

            );



        let status = "Pending";
        let statusClass = "status-pending";



        if(upload && upload.status==="Uploaded"){

            status = "Completed";

            statusClass="status-completed";

        }
        else if(edit && edit.status==="Completed"){

            status = "In Progress";

            statusClass="status-progress";

        }



        body.innerHTML += `

            <tr>

                <td>${project.projectId}</td>

                <td>

                    Rs.

                    ${budget ?

                        Number(

                        budget.actualCost ||

                        budget.amount ||

                        0

                        ).toLocaleString()

                        :

                        0}

                </td>

                <td>

                    ${edit ?

                        edit.status

                        :

                        "-"}

                </td>

                <td>

                    ${revision ?

                        revision.status

                        :

                        "-"}

                </td>

                <td>

                    ${upload ?

                        upload.status

                        :

                        "-"}

                </td>

                <td class="${statusClass}">

                    ${status}

                </td>

            </tr>

        `;

    });

}



/* ===========================
   Initialize
=========================== */

loadKPIs();

loadProjectTable();

/* ===========================
   Charts
=========================== */

function loadCharts(){

    /* -------- Project Progress -------- */

    const projectLabels = projects.map(project => project.projectId);

    const progressData = projects.map(project=>{

        let score = 0;

        const edit = editingTasks.find(
            e => e.projectId === project.projectId
        );

        const revision = revisionTasks.find(
            r => r.projectId === project.projectId
        );

        const upload = uploadTasks.find(
            u => u.projectId === project.projectId
        );

        if(edit && edit.status==="Completed") score += 40;

        if(revision && revision.status==="Completed") score += 30;

        if(upload && upload.status==="Uploaded") score += 30;

        return score;

    });

    new Chart(

        document.getElementById("projectChart"),

        {

            type:"bar",

            data:{

                labels:projectLabels,

                datasets:[{

                    label:"Completion %",

                    data:progressData,

                    backgroundColor:"#2563eb"

                }]

            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true,

                        max:100

                    }

                }

            }

        }

    );



    /* -------- Platform Pie -------- */

    const platforms = [
    "Facebook",
    "Instagram",
    "TikTok",
    "YouTube",
    "LinkedIn",
    "X",
    "Website",
    "Other"
];

const platformData = platforms.map(platform =>
    uploadTasks.filter(
        task => task.platform === platform
    ).length
);

new Chart(
    document.getElementById("platformChart"),
    {

        type: "bar",

        data: {

            labels: platforms,

            datasets: [{

                label: "Uploads",

                data: platformData,

                backgroundColor: "#2563eb",

                borderRadius: 8

            }]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    beginAtZero: true,

                    grid: {

                        display: false

                    }

                },

                y: {

                    grid: {

                        display: false

                    }

                }

            }

        }

    }
);


    /* -------- Budget -------- */

    const budgetLabels =
        budgets.map(b => b.projectId);

    const planned =
        budgets.map(b =>
            Number(b.plannedBudget || 0)
        );

    const actual =
        budgets.map(b =>
            Number(b.actualCost || 0)
        );

    new Chart(
        document.getElementById("budgetChart"),
        {

            type: "bar",

            data: {

                labels: budgetLabels,

                datasets: [

                    {

                        label: "Planned",

                        data: planned,

                        backgroundColor: "#2563eb",

                        borderRadius: 8

                    },

                    {

                        label: "Actual",

                        data: actual,

                        backgroundColor: "#10b981",

                        borderRadius: 8

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }
    );



    /* -------- Upload Status -------- */

    const pending =
        uploadTasks.filter(
            t => t.status === "Pending"
        ).length;

    const scheduled =
        uploadTasks.filter(
            t => t.status === "Scheduled"
        ).length;

    const uploaded =
        uploadTasks.filter(
            t => t.status === "Uploaded"
        ).length;

    new Chart(
        document.getElementById("uploadChart"),
        {

            type: "bar",

            data: {

                labels: [

                    "Uploaded",

                    "Scheduled",

                    "Pending"

                ],

                datasets: [{

                    data: [

                        uploaded,

                        scheduled,

                        pending

                    ],

                    backgroundColor: [

                        "#10b981",

                        "#3b82f6",

                        "#f59e0b"

                    ],

                    borderRadius: 8

                }]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        grid: {

                            display: false

                        }

                    },

                    y: {

                        grid: {

                            display: false

                        }

                    }

                }

            }

        }
    );

}

/* ===========================
   Load Dashboard
=========================== */

loadCharts();