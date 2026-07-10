/**main-cloud.js
 * ---------------------------------------------------------
 * Proyecto : memory-task-manager
 * Archivo  : main.js
 * Descripción:
 * Gestión de tareas mediante una API REST desarrollada
 * con Node.js y Express.
 * ---------------------------------------------------------
 */

//----------------------------------------------------------
// URL de la API
//----------------------------------------------------------

const API_URL = "http://localhost:3005/tasks";

//----------------------------------------------------------
// Referencias a elementos del DOM
//----------------------------------------------------------

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");

const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");

const formTitle = document.getElementById("formTitle");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const listaTareas = document.getElementById("listaTareas");

//----------------------------------------------------------
// Variables de control
//----------------------------------------------------------

let modoEdicion = false;

//==========================================================
// GET
// Obtener todas las tareas
//==========================================================

async function cargarTareas() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {

            throw new Error("Unable to load tasks.");

        }

        const tareas = await respuesta.json();

        listaTareas.innerHTML = "";

        if (tareas.length === 0) {

            listaTareas.innerHTML =
                "<p>There are no pending tasks.</p>";

            return;

        }

        tareas.forEach((tarea) => {

            const tituloSeguro =
                (tarea.titulo || "")
                    .replace(/'/g, "&apos;")
                    .replace(/\n/g, " ");

            const descripcionSegura =
                (tarea.descripcion || "")
                    .replace(/'/g, "&apos;")
                    .replace(/\n/g, " ");

            const tareaDiv = document.createElement("div");

            tareaDiv.className = "tarea-card";

            const html = `

                <div>

                    <strong>

                        [ID: ${tarea.id}] ${tarea.titulo}

                    </strong>

                    <p style="margin-top:5px;color:#555;">

                        ${tarea.descripcion || "No description"}

                    </p>

                </div>

                <div>

                    <button
                        class="btn-edit"
                        onclick="prepararEdicion(
                            ${tarea.id},
                            '${tituloSeguro}',
                            '${descripcionSegura}'
                        )">

                        Edit

                    </button>

                    <button
                        class="btn-delete"
                        onclick="eliminarTarea(${tarea.id})">

                        Delete

                    </button>

                </div>

            `;

            tareaDiv.innerHTML = html;

            listaTareas.appendChild(tareaDiv);

        });

    }

    catch (error) {

        console.error(error);

        listaTareas.innerHTML =
            "<p>Error loading tasks.</p>";

    }

}

//==========================================================
// POST / PUT
// Guardar o actualizar tareas
//==========================================================

taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const titulo = tituloInput.value.trim();

    if (titulo === "") {

        alert("Please enter the task title.");

        tituloInput.focus();

        return;

    }

    const datosTarea = {

        titulo,

        descripcion: descripcionInput.value.trim()

    };

    try {

        let respuesta;

        if (modoEdicion) {

            respuesta = await fetch(

                `${API_URL}/${taskIdInput.value}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(datosTarea)

                }

            );

        }

        else {

            respuesta = await fetch(

                API_URL,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(datosTarea)

                }

            );

        }

        const resultado = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(resultado.mensaje);

        }

        alert(resultado.mensaje);

        resetearFormulario();

        cargarTareas();

    }

    catch (error) {

        alert(error.message);

    }

});

//==========================================================
// DELETE
// Eliminar una tarea
//==========================================================

async function eliminarTarea(id) {

    const confirmar = confirm(

        `Are you sure you want to delete task ${id}?`

    );

    if (!confirmar) return;

    try {

        const respuesta = await fetch(

            `${API_URL}/${id}`,

            {

                method: "DELETE"

            }

        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(resultado.mensaje);

        }

        alert(resultado.mensaje);

        cargarTareas();

    }

    catch (error) {

        alert(error.message);

    }

}

//==========================================================
// Preparar edición
//==========================================================

function prepararEdicion(

    id,

    titulo,

    descripcion

) {

    modoEdicion = true;

    formTitle.textContent = "Edit Task";

    btnGuardar.textContent = "Update Task";

    btnCancelar.style.display = "inline-block";

    taskIdInput.value = id;

    tituloInput.value = titulo;

    descripcionInput.value = descripcion;

}

//==========================================================
// Restablecer formulario
//==========================================================

function resetearFormulario() {

    modoEdicion = false;

    formTitle.textContent = "New Task";

    btnGuardar.textContent = "Save Task";

    btnCancelar.style.display = "none";

    taskForm.reset();

    taskIdInput.value = "";

}

//----------------------------------------------------------
// Eventos
//----------------------------------------------------------

btnCancelar.addEventListener(

    "click",

    resetearFormulario

);

//----------------------------------------------------------
// Inicialización
//----------------------------------------------------------

cargarTareas();

//----------------------------------------------------------
// Exponer funciones para los botones HTML
//----------------------------------------------------------

window.prepararEdicion = prepararEdicion;

window.eliminarTarea = eliminarTarea;