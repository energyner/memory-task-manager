/**
 *----------------------------------------------------------
 * Proyecto    : memory-task-manager
 * Archivo     : main.js
 * Versión     : 3.0.0
 * Libro       : Libro 6 – Segundo Módulo
 * Descripción :
 * Módulo Cliente para la Gestión de Tareas.
 * Responsable de la comunicación entre la
 * interfaz HTML y la API REST.
 * Compatible con:
 * ✔ Desarrollo Local
 * ✔ Docker
 * ✔ Vercel
 * ✔ Neon
 * ✔ Railway
 * ✔ Supabase
 * ✔ Google Cloud SQL
 *----------------------------------------------------------
*/

/*==========================================================
        1 - CLIENT INITIALIZATION
==========================================================*/

//----------------------------------------------------------
// API Configuration
//----------------------------------------------------------

// [PISTA]
// Utilizamos una ruta relativa para que el mismo
// código funcione tanto en desarrollo local como
// en Vercel sin modificar la URL de la API.

const API_URL="/tasks";

//----------------------------------------------------------
// DOM References
//----------------------------------------------------------

// [PISTA]
// Centralizamos todas las referencias al DOM para
// facilitar el mantenimiento del código.

const taskForm=document.getElementById("taskForm");
const taskIdInput=document.getElementById("taskId");
const titleInput=document.getElementById("titulo");
const descriptionInput=document.getElementById("descripcion");
const formTitle=document.getElementById("formTitle");
const btnSave=document.getElementById("btnGuardar");
const btnCancel=document.getElementById("btnCancelar");
const taskList=document.getElementById("listaTareas");

//----------------------------------------------------------
// Control Variables
//----------------------------------------------------------

// [PISTA]
// Indica si el formulario está creando una nueva
// tarea o modificando una existente.

let isEditMode=false;

/*==========================================================
                LOAD TASKS (GET)
==========================================================*/

// [PISTA]
// Consume el endpoint GET /tasks definido en
// server.js. Este módulo desconoce completamente
// dónde se encuentra la base de datos.


async function loadTasks(){

    try{
        taskList.innerHTML=`<p class="status-message"> Loading tasks...</p>`;
        const response=await fetch(API_URL);

        if(!response.ok)
            throw new Error("Unable to load tasks.");

        const tasks=await response.json();

      
        if(tasks.length===0){
            taskList.innerHTML=`<p class="status-message"> No tasks available.</p>`;
            return;
        }

        tasks.forEach(task=>{

            // [PISTA]
            // Escapamos caracteres especiales antes
            // de insertarlos dentro del HTML.

            const safeTitle=(task.title||"")
                .replace(/'/g,"&apos;")
                .replace(/\n/g," ");

            const safeDescription=(task.description||"")
                .replace(/'/g,"&apos;")
                .replace(/\n/g," ");

            const card=document.createElement("div");
            card.className="task-card";

            card.innerHTML=`
                <div>
                    <strong>[ID: ${task.id}] ${task.title}</strong>
                    <p style="margin-top:5px;color:#555;">
                        ${task.description||"No description"}
                    </p>
                </div>
                <div>
                    <button class="btn-edit"
                        onclick="prepareEdit(
                        ${task.id},
                        '${safeTitle}',
                        '${safeDescription}')">
                        Edit
                    </button>
                    <button class="btn-delete"
                        onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                </div>`;

            taskList.appendChild(card);

        });

    }
    catch(error){

        console.error(error);

        taskList.innerHTML=
            `<p class="status-message"> Error loading tasks.</p>`;

    }

}

/*==========================================================
                END BLOCK 1
==========================================================*/

/*==========================================================
            2 - SAVE TASK (POST / PUT)
==========================================================*/

// [PISTA]
// El mismo formulario permite crear una nueva
// tarea o actualizar una existente.
// La variable isEditMode determina la operación.



taskForm.addEventListener("submit",async(event)=>{

    event.preventDefault();

    const title=titleInput.value.trim();

    if(title===""){
        alert("Please enter the task title.");
        titleInput.focus();
        return;
    }

    const taskData={
        title,
        description:descriptionInput.value.trim()
    };

    try{

        let response;

        if(isEditMode){

            // [PISTA]
            // PUT actualiza una tarea existente.

            response=await fetch(
                `${API_URL}/${taskIdInput.value}`,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(taskData)
                });

        }else{

            // [PISTA]
            // POST crea una nueva tarea.

            response=await fetch(API_URL,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(taskData)
            });

        }

        const result=await response.json();

        if(!response.ok)
            throw new Error(result.message);

        alert(result.message);

        resetForm();

        loadTasks();

    }
    catch(error){

        console.error(error);

        alert(error.message);

    }

});

/*==========================================================
                END BLOCK 2
==========================================================*/

//*==========================================================
 //       3 - DELETE / EDIT / INITIALIZATION
//==========================================================*/

/*----------------------------------------------------------
        DELETE TASK
----------------------------------------------------------*/

// [PISTA]
// Elimina una tarea utilizando el endpoint:
//
//      DELETE /tasks/:id
//
// Antes de enviar la solicitud se solicita
// confirmación al usuario.

async function deleteTask(id){

    const confirmed=confirm(
        `Are you sure you want to delete task ${id}?`
    );

    if(!confirmed) return;

    try{

        const response=await fetch(`${API_URL}/${id}`,{
            method:"DELETE"
        });

        const result=await response.json();

        if(!response.ok)
            throw new Error(result.message);

        alert(result.message);

        loadTasks();

    }
    catch(error){

        console.error(error);

        alert(error.message);

    }

}

/*----------------------------------------------------------
        PREPARE EDIT
----------------------------------------------------------*/

// [PISTA]
// Carga la información de la tarea seleccionada
// dentro del formulario para permitir su edición.

function prepareEdit(id,title,description){

    isEditMode=true;

    formTitle.textContent="Edit Task";

    btnSave.textContent="Update Task";

    btnCancel.style.display="inline-block";

    taskIdInput.value=id;

    titleInput.value=title;

    descriptionInput.value=description;

}

/*----------------------------------------------------------
        RESET FORM
----------------------------------------------------------*/

// [PISTA]
// Restablece el formulario a su estado inicial
// para crear una nueva tarea.

function resetForm(){

    isEditMode=false;

    formTitle.textContent="New Task";

    btnSave.textContent="Save Task";

    btnCancel.style.display="none";

    taskForm.reset();

    taskIdInput.value="";

}

/*----------------------------------------------------------
        EVENTS
----------------------------------------------------------*/

// [PISTA]
// El botón Cancel únicamente restablece el
// formulario; no realiza ninguna operación
// sobre la base de datos.

btnCancel.addEventListener("click",resetForm);

/*----------------------------------------------------------
        APPLICATION STARTUP
----------------------------------------------------------*/

// [PISTA]
// Al cargar la página solicitamos inmediatamente
// la lista de tareas al servidor.

loadTasks();

/*----------------------------------------------------------
        GLOBAL FUNCTIONS
----------------------------------------------------------*/

// [PISTA]
// Estas funciones quedan disponibles para los
// botones creados dinámicamente mediante HTML.

window.prepareEdit=prepareEdit;

window.deleteTask=deleteTask;

/*==========================================================
                END BLOCK 3
==========================================================*/