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

/*----------------------------------------------------------
    API Configuration
----------------------------------------------------------*/

// [PISTA]
// Utilizamos una ruta relativa para que el mismo
// código funcione tanto en desarrollo local como
// en Vercel sin modificar la URL de la API.

const API_URL = "/tasks";

/*----------------------------------------------------------
    BLOCK 1 - DOM References
----------------------------------------------------------*/

// [PISTA]
// Centralizamos todas las referencias al DOM para
// facilitar el mantenimiento del código.

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("titulo");
const descriptionInput = document.getElementById("descripcion");
const formTitle = document.getElementById("formTitle");
const btnSave = document.getElementById("btnGuardar");
const btnCancel = document.getElementById("btnCancelar");
const taskList = document.getElementById("listaTareas");

/*----------------------------------------------------------
    Control Variables
----------------------------------------------------------*/

// [PISTA]
// Indica si el formulario está creando una nueva
// tarea o modificando una existente.

let isEditMode = false;

/*==========================================================
                LOAD TASKS (GET)
==========================================================*/

// [PISTA]
// Consume el endpoint GET /tasks definido en
// server.js. Este módulo desconoce completamente
// dónde se encuentra la base de datos.

async function loadTasks() {

    try {

        taskList.innerHTML =
            `<p class="status-message">Loading tasks...</p>`;

        const response = await fetch(API_URL);

        if (!response.ok)
            throw new Error("Unable to load tasks.");

        const tasks = await response.json();

        //--------------------------------------------------
        // No existen registros
        //--------------------------------------------------

        if (tasks.length === 0) {

            taskList.innerHTML =
                `<p class="status-message">No tasks available.</p>`;

            return;

        }

        //--------------------------------------------------
        // Limpiar listado
        //--------------------------------------------------

        taskList.innerHTML = "";

        //--------------------------------------------------
        // Crear tarjetas
        //--------------------------------------------------

        tasks.forEach(task => {

            //----------------------------------------------
            // Tarjeta principal
            //----------------------------------------------

            const card = document.createElement("div");
            card.className = "task-card";

            //----------------------------------------------
            // Información
            //----------------------------------------------

            const info = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent =
                `[ID: ${task.id}] ${task.title}`;

            const description =
                document.createElement("p");

            description.style.marginTop = "5px";
            description.style.color = "#555";

            description.textContent =
                task.description || "No description";

            info.appendChild(title);
            info.appendChild(description);

            //----------------------------------------------
            // Acciones
            //----------------------------------------------

            const actions =
                document.createElement("div");

            //----------------------------------------------
            // Botón Edit
            //----------------------------------------------

            const btnEdit =
                document.createElement("button");

            btnEdit.className = "btn-edit";
            btnEdit.textContent = "Edit";

            btnEdit.addEventListener("click", () => {

                prepareEdit(
                    task.id,
                    task.title,
                    task.description || ""
                );

            });

            //----------------------------------------------
            // Botón Delete
            //----------------------------------------------

            const btnDelete =
                document.createElement("button");

            btnDelete.className = "btn-delete";
            btnDelete.textContent = "Delete";

            btnDelete.addEventListener("click", () => {

                deleteTask(task.id);

            });

            //----------------------------------------------
            // Construcción de la tarjeta
            //----------------------------------------------

            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);

            card.appendChild(info);
            card.appendChild(actions);

            taskList.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);

        taskList.innerHTML =
            `<p class="status-message">Error loading tasks.</p>`;

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

taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    //------------------------------------------------------
    // Validación del formulario
    //------------------------------------------------------

    const title = titleInput.value.trim();

    if (title === "") {

        alert("Please enter the task title.");

        titleInput.focus();

        return;

    }

    //------------------------------------------------------
    // Datos de la tarea
    //------------------------------------------------------

    const taskData = {

        title,

        description:
            descriptionInput.value.trim()

    };

    //------------------------------------------------------
    // Configuración de la solicitud
    //------------------------------------------------------

    const method =
        isEditMode ? "PUT" : "POST";

    const url =
        isEditMode
            ? `${API_URL}/${taskIdInput.value}`
            : API_URL;

    try {

        //--------------------------------------------------
        // Enviar solicitud al servidor
        //--------------------------------------------------

        const response = await fetch(url, {

            method,

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(taskData)

        });

        //--------------------------------------------------
        // Procesar respuesta
        //--------------------------------------------------

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unexpected server error."
            );

        }

        //--------------------------------------------------
        // Operación exitosa
        //--------------------------------------------------

        alert(result.message);

        resetForm();

        await loadTasks();

    }
    catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Unexpected application error."
        );

    }

});

/*==========================================================
                END BLOCK 2
==========================================================*/

/*==========================================================
        3 - DELETE / EDIT / INITIALIZATION
==========================================================*/

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

async function deleteTask(id) {

    const confirmed = confirm(
        `Are you sure you want to delete task ${id}?`
    );

    if (!confirmed)
        return;

    try {

        //--------------------------------------------------
        // Enviar solicitud DELETE
        //--------------------------------------------------

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        //--------------------------------------------------
        // Procesar respuesta
        //--------------------------------------------------

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete task."
            );

        }

        //--------------------------------------------------
        // Actualizar interfaz
        //--------------------------------------------------

        alert(result.message);

        await loadTasks();

    }
    catch (error) {

        console.error(error);

        alert(

            error.message ||

            "Unexpected application error."

        );

    }

}

/*----------------------------------------------------------
        PREPARE EDIT
----------------------------------------------------------*/

// [PISTA]
// Carga la información de la tarea seleccionada
// dentro del formulario para permitir su edición.

function prepareEdit(id, title, description) {

    isEditMode = true;

    formTitle.textContent = "Edit Task";

    btnSave.textContent = "Update Task";

    btnCancel.style.display = "inline-block";

    taskIdInput.value = id;

    titleInput.value = title;

    descriptionInput.value = description;

}

/*----------------------------------------------------------
        RESET FORM
----------------------------------------------------------*/

// [PISTA]
// Restablece el formulario a su estado inicial
// para crear una nueva tarea.

function resetForm() {

    isEditMode = false;

    formTitle.textContent = "New Task";

    btnSave.textContent = "Save Task";

    btnCancel.style.display = "none";

    taskForm.reset();

    taskIdInput.value = "";

}

/*----------------------------------------------------------
        EVENTS
----------------------------------------------------------*/

// [PISTA]
// El botón Cancel únicamente restablece el
// formulario; no realiza ninguna operación
// sobre la base de datos.

btnCancel.addEventListener(

    "click",

    resetForm

);

/*----------------------------------------------------------
        APPLICATION STARTUP
----------------------------------------------------------*/

// [PISTA]
// Al cargar la página solicitamos inmediatamente
// la lista de tareas al servidor.

loadTasks();

/*==========================================================
                END BLOCK 3
==========================================================*/