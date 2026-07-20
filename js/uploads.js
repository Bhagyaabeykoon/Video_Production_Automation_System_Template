const STORAGE_KEY = "uploadTasks";

let uploadTasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const modal =
    document.getElementById("uploadModal");

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

window.onclick = function(e){

    if(e.target === modal){

        modal.style.display = "none";

    }

}

document.getElementById("saveUploadBtn")
.addEventListener("click", saveUpload);

document.getElementById("searchUpload")
.addEventListener("keyup", searchUpload);

function loadProjects(){

    const projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const dropdown =
        document.getElementById("projectId");

    dropdown.innerHTML =
        `<option value="">Select Project</option>`;

    projects.forEach(project=>{

        dropdown.innerHTML += `

            <option value="${project.projectId}">

                ${project.projectId} - ${project.businessName}

            </option>

        `;

    });

}

function saveUpload(){

    const upload = {

        uploadId:
            document.getElementById("uploadId").value.trim(),

        projectId:
            document.getElementById("projectId").value,

        platform:
            document.getElementById("platform").value,

        uploadDate:
            document.getElementById("uploadDate").value,

        uploadTime:
            document.getElementById("uploadTime").value,

        status:
            document.getElementById("status").value,

        socialLink:
            document.getElementById("socialLink").value.trim(),

        notes:
            document.getElementById("notes").value.trim()

    };

    if(
        upload.uploadId==="" ||
        upload.projectId==="" ||
        upload.uploadDate===""
    ){

        alert("Please fill all required fields.");

        return;

    }

    const editIndex =
        document.getElementById("editIndex").value;

    if(editIndex===""){

        uploadTasks.push(upload);

    }
    else{

        uploadTasks[editIndex]=upload;

    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(uploadTasks)
    );

    renderUploads();

    updateCards();

    modal.style.display="none";

}

function renderUploads(){

    const body =
        document.getElementById("uploadBody");

    body.innerHTML="";

    uploadTasks.forEach((task,index)=>{

        let statusClass="status-pending";

        if(task.status==="Scheduled"){

            statusClass="status-scheduled";

        }

        if(task.status==="Uploaded"){

            statusClass="status-uploaded";

        }

        const link =

            task.socialLink

            ?

            `<a
                class="link-btn"
                href="${task.socialLink}"
                target="_blank">

                Open

            </a>`

            :

            "-";

        body.innerHTML += `

            <tr>

                <td>${task.uploadId}</td>

                <td>${task.projectId}</td>

                <td>${task.platform}</td>

                <td>${task.uploadDate}</td>

                <td>${task.uploadTime}</td>

                <td class="${statusClass}">
                    ${task.status}
                </td>

                <td>
                    ${link}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editUpload(${index})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteUpload(${index})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}

function editUpload(index){

    loadProjects();

    const task =
        uploadTasks[index];

    document.getElementById("editIndex").value=index;

    document.getElementById("uploadId").value=
        task.uploadId;

    document.getElementById("projectId").value=
        task.projectId;

    document.getElementById("platform").value=
        task.platform;

    document.getElementById("uploadDate").value=
        task.uploadDate;

    document.getElementById("uploadTime").value=
        task.uploadTime;

    document.getElementById("status").value=
        task.status;

    document.getElementById("socialLink").value=
        task.socialLink;

    document.getElementById("notes").value=
        task.notes;

    modal.style.display="block";

}

function deleteUpload(index){

    if(confirm("Delete this upload task?")){

        uploadTasks.splice(index,1);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(uploadTasks)
        );

        renderUploads();

        updateCards();

    }

}

function searchUpload(){

    const search =
        document.getElementById("searchUpload")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#uploadBody tr");

    rows.forEach(row=>{

        row.style.display=

            row.innerText
            .toLowerCase()
            .includes(search)

            ?

            ""

            :

            "none";

    });

}

function updateCards(){

    document.getElementById("totalUploads").innerText =
        uploadTasks.length;

    document.getElementById("pendingUploads").innerText =
        uploadTasks.filter(
            task => task.status === "Pending"
        ).length;

    document.getElementById("scheduledUploads").innerText =
        uploadTasks.filter(
            task => task.status === "Scheduled"
        ).length;

    document.getElementById("uploadedUploads").innerText =
        uploadTasks.filter(
            task => task.status === "Uploaded"
        ).length;

}

function clearForm(){

    document.getElementById("editIndex").value = "";

    document.getElementById("uploadId").value = "";

    document.getElementById("projectId").value = "";

    document.getElementById("platform").value = "Facebook";

    document.getElementById("uploadDate").value = "";

    document.getElementById("uploadTime").value = "";

    document.getElementById("status").value = "Pending";

    document.getElementById("socialLink").value = "";

    document.getElementById("notes").value = "";

}

function sortUploadsByDate(){

    uploadTasks.sort((a,b)=>{

        const dateA = new Date(
            a.uploadDate + " " + a.uploadTime
        );

        const dateB = new Date(
            b.uploadDate + " " + b.uploadTime
        );

        return dateA - dateB;

    });

}

function refreshData(){

    sortUploadsByDate();

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(uploadTasks)

    );

    renderUploads();

    updateCards();

}

window.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        modal.style.display="none";

    }

});

window.addEventListener("storage",()=>{

    uploadTasks =

        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    refreshData();

});

loadProjects();

refreshData();