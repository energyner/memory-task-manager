/**
 *------------------------------------------------------------
 * Proyecto    : memory-task-manager
 * Archivo     : server.js
 * Descripción :
 * Servidor REST desarrollado con Node.js + Express
 * 
 * Versión     : 3.0.0
    Libro       : Libro 6 – Segundo Módulo
    Arquitectura: Cloud-Native
    Última revisión: Julio 2026
 *
 * Compatible con:
 *   ✔ PostgreSQL Local
 *   ✔ Docker
 *   ✔ Vercel Postgres
 *   ✔ Neon
 *   ✔ Supabase
 *   ✔ Railway
 *   ✔ Google Cloud SQL
 *------------------------------------------------------------
 */

/*======================
        1 - START-UP PROCESS
=======================*/

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// [PISTA]
// Ahora importamos también la función testConnection()
// para delegar al módulo db.js la responsabilidad de
// verificar la conexión con PostgreSQL.

/*
 * ETAPA DE DESARROLLO LOCAL
 * Descomente la siguiente línea y mantenga comentada la de producción.
 */
//import { pool,  testConnection } from "../config/db-local.js"; 
/*
 * ETAPA DE PRODUCCIÓN (VERCEL)
 * Antes del despliegue, comente la línea anterior y descomente la siguiente.
 */
import { pool,  testConnection } from "../config/db.js"; 


/*=======================
      General Configuration
========================*/

const app = express();

// [PISTA]
// Vercel asigna automáticamente el puerto mediante
// la variable PORT. En desarrollo utilizamos 8080.

const PORT = Number(process.env.PORT) || 8080;

const isProduction =
    process.env.NODE_ENV === "production";

// [PISTA]
// Detectamos automáticamente si el proyecto se está
// ejecutando en Vercel.

const isVercel =
    Boolean(process.env.VERCEL);

/*----------------------------------------------------
    Static Files Configuration
----------------------------------------------------*/
const __filename =
    fileURLToPath(import.meta.url);
const __dirname =
    path.dirname(__filename);
const publicPath =
    path.join(__dirname, "../public");
/*----------------------------------------------------
    Provider Detection
----------------------------------------------------*/

// [PISTA]
// El servidor ya no depende de Cloud SQL.
// Mostramos únicamente el proveedor detectado.

let databaseProvider = "Local PostgreSQL";
if (process.env.DATABASE_URL) {
    if (process.env.DATABASE_URL.includes("neon.tech"))
        databaseProvider = "Neon";
    else if (
        process.env.DATABASE_URL.includes("vercel-storage")
    )
        databaseProvider = "Vercel Postgres";
    else if (
        process.env.DATABASE_URL.includes("supabase")
    )
        databaseProvider = "Supabase";
    else if (
        process.env.DATABASE_URL.includes("railway")
    )
        databaseProvider = "Railway";
    else
        databaseProvider = "External PostgreSQL";
}
else if (
    process.env.DB_HOST?.startsWith("/cloudsql/")
) {
    databaseProvider = "Google Cloud SQL";
}

/*========================
        Server Banner
=========================*/
;
console.log("=================================================");
console.log("        MEMORY TASK MANAGER - REST API");
console.log("=================================================");
console.log(
    `Environment : ${
        isProduction
            ? "Production"
            : "Development"
    }`
);
console.log(
    `Platform    : ${
        isVercel
            ? "Vercel"
            : "Local Server"
    }`
);
console.log(
    `Database    : ${databaseProvider}`
);
console.log(
    `Static Path : ${publicPath}`
);
console.log("=================================================");
;

/*================================
            Middleware
=================================*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicPath));

/*----------------------------------------------------
    Initial Database Verification
----------------------------------------------------*/

// [PISTA]
// Toda la lógica de conexión queda centralizada
// en db.js mediante la función testConnection().
try {
    await testConnection();
}
catch (error) {
    console.error();
    console.error("========================================");
    console.error("DATABASE INITIALIZATION FAILED");
    console.error("========================================");
    console.error(error.message);
    console.error("========================================");
    console.error();
    process.exit(1);
}

/*===============================
         Default Route
================================*/
app.get("/", (req, res) => {
    res.json({
        application: "Memory Task Manager",
        version: "2.0",
        status: "Running",
        environment:
            isProduction
                ? "Production"
                : "Development",
        platform:
            isVercel
                ? "Vercel"
                : "Local",

        database:
            databaseProvider

    });

});

/*==============================
       Health Check
===============================*/

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message:
            "Service available."
    });
});

/*=============================
        Database Status
==============================*/
app.get("/db-status", async (req, res) => {
    try {
        const result =
            await pool.query(
                "SELECT NOW()"
            );
        res.status(200).json({
            status: "OK",
            database:
                process.env.DB_NAME || "PostgreSQL",
            provider:
                databaseProvider,
            server_time:
                result.rows[0].now
        });
    }
    catch (error) {
        console.error(error);
       res.status(500).json({
            status: "ERROR",
            message:
                "Unable to connect to PostgreSQL.",
            error:
                error.message
        });
    }
});

/*==============================
        Database Information
===============================*/

app.get("/db-info", async (req, res) => {
    try {
        const result =
            await pool.query(
                `SELECT
                    current_database() AS database,
                    current_user AS user_name,
                    version() AS version,
                    NOW() AS server_time`
            );
        res.status(200).json(
            result.rows[0]
        );
    }
    catch (error) {
        console.error(error);
       res.status(500).json({
            status: "ERROR",
            message:
                "Unable to retrieve database information.",
            error:
                error.message
        });
    }
});

/*=================================
       END BLOCK 1 - START-UP PROCESS
=================================*/

/*================================
  2.1 - CRUD OPERATIONS                     
=================================*/
/*------------------------------
 Retrieve all tasks
---------------------------------*/
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                created_at
            FROM tasks
            ORDER BY id DESC`
        );
        res.status(200).json(
            result.rows
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving tasks.",
            error: error.message
        });
    }
});

/*-----------------------------------------------
 GET
 Retrieve task by ID
------------------------------------------------*/
//============================================================
// GET
// Obtener una tarea por su ID
//============================================================

app.get("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                created_at
            FROM tasks
            WHERE id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }
        res.status(200).json(
           result.rows[0]
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving task.",
            error: error.message
        });
    }
});


/*======================
END BLOCK 2.1 - CRUD OPERATIONS               
=========================*/

/*======================
BLOCK 2.2 - CRUD OPERATIONS TWO               
=========================*/

/*---------------------------------------
 POST
 Create new task
------------------------------------------*/
app.post("/tasks", async (req, res) => {
    try {
        const {
            title,
            description
        } = req.body;
        //----------------------------------------------------
        // Validación
        //----------------------------------------------------
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "The task title is required."
            });
        }
        //----------------------------------------------------
        // Insertar registro
        //----------------------------------------------------
        const result = await pool.query(
            `INSERT INTO tasks
                (
                    title,
                    description
                )
             VALUES
                (
                    $1,
                    $2
                )
             RETURNING
                id,
                title,
                description,
                created_at`,
            [
                title.trim(),
                description?.trim() || ""
            ]
        );

        //----------------------------------------------------
        // Respuesta
        //----------------------------------------------------

        res.status(201).json({
            message: "Task successfully created.",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating task.",
            error: error.message
        });
    }
});

/*------------------------------------------------
   UPDATE OPERATIONS
------------------------------------------------*/

/*-----------------------------------------------
 PUT
 Update task
------------------------------------------------*/
app.put("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {
            title,
            description
        } = req.body;
        //----------------------------------------------------
        // Validación
        //----------------------------------------------------
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "The task title is required."
            });
        }
        //----------------------------------------------------
        // Actualizar registro
        //----------------------------------------------------
        const result = await pool.query(
            `UPDATE tasks
                SET
                    title = $1,
                    description = $2
             WHERE id = $3
             RETURNING
                    id,
                    title,
                    description,
                    created_at`,
            [
                title.trim(),
                description?.trim() || "",
                id
            ]
        );

        //----------------------------------------------------
        // Registro no encontrado
        //----------------------------------------------------
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }
        //----------------------------------------------------
        // Respuesta
        //----------------------------------------------------
        res.status(200).json({
            message: "Task successfully updated.",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating task.",
            error: error.message
        });
    }
});

/*------------------------------------------------
                DELETE OPERATIONS
------------------------------------------------*/

/*-----------------------------------------------
 DELETE
 Delete task
------------------------------------------------*/
app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        //----------------------------------------------------
        // Eliminar registro
        //----------------------------------------------------
        const result = await pool.query(
            `DELETE
             FROM tasks
             WHERE id = $1
             RETURNING
                id`,
            [
                id
            ]
        );
        //----------------------------------------------------
        // Registro inexistente
        //----------------------------------------------------
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }
        //----------------------------------------------------
        // Respuesta
        //----------------------------------------------------
        res.status(200).json({
            message: "Task successfully deleted."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting task.",
            error: error.message
        });
    }
});
/*======================
END BLOCK 2.2 - CRUD OPERATIONS TWO               
=========================*/

/*=======================
    3 - MIDDLEWARE - START                       
========================*/

/*-----------------------------------------
 Middleware 404
------------------------------------------*/
app.use((req, res) => {

    // [PISTA]
    // Este middleware se ejecuta únicamente cuando
    // ninguna ruta anterior coincide con la solicitud.
    res.status(404).json({
        status: "ERROR",
        message: "Endpoint not found.",
        endpoint: req.originalUrl
    });
});
/*----------------------------------------------------------
            Global Error Handler
-----------------------------------------------------------*/

app.use((error, req, res, next) => {

    // [PISTA]
    // Centralizamos el tratamiento de errores
    // inesperados del servidor.

    console.error();
    console.error("========================================");
    console.error("UNHANDLED SERVER ERROR");
    console.error("========================================");
    console.error(error);
    console.error("========================================");
    console.error();

    res.status(500).json({
        status: "ERROR",
        message: "Internal server error.",
        error: error.message
    });
});
/*=======================
   4 - START SERVER
=========================*/

// [PISTA]
// En Vercel NO ejecutamos app.listen().
// Vercel utiliza la aplicación Express como
// una función Serverless.

if (!isVercel) {
    app.listen(PORT, () => {
       
        console.log("=================================================");
        console.log("        MEMORY TASK MANAGER - REST API");
        console.log("=================================================");
       
        console.log("Application");
        console.log("   Memory Task Manager");
       
        console.log("Environment");
        console.log(
            `   ${isProduction ? "Production" : "Development"}`
        );

       
        console.log("Platform");
        console.log("   Local Development");       
        console.log("Server");
        console.log(`   http://localhost:${PORT}`);       
        console.log("Database Provider");
        console.log(`   ${databaseProvider}`);       
        console.log("Available Endpoints");
        console.log("--------------------------------------");
        console.log("GET      /");
        console.log("GET      /health");
        console.log("GET      /db-status");
        console.log("GET      /db-info");
        console.log("GET      /tasks");
        console.log("GET      /tasks/:id");
        console.log("POST     /tasks");
        console.log("PUT      /tasks/:id");
        console.log("DELETE   /tasks/:id");
        console.log("--------------------------------------");

       
        console.log("Server Ready.");
        console.log("=================================================");
       

    });
}
else {
    // [PISTA]
    // En Vercel el despliegue se realiza como una
    // función Serverless. No existe un servidor
    // escuchando permanentemente en un puerto.
   
    console.log("=================================================");
    console.log(" MEMORY TASK MANAGER - VERCEL DEPLOYMENT");
    console.log("=================================================");
    console.log("Environment");
    console.log("   Production");   
    console.log("Platform");
    console.log("   Vercel");    
    console.log("Database Provider");
    console.log(`   ${databaseProvider}`);    
    console.log("Application exported successfully.");
    console.log("=================================================");
    
}
/*----------------------------------------------------------
        Export Express Application

[PISTA]
La exportación permite que Vercel utilice este
servidor como una función Serverless.

En desarrollo local esta exportación no produce
ningún efecto secundario, por lo que el mismo
archivo funciona en ambos entornos.
-----------------------------------------------------------*/

export default app;