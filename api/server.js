/**
 *------------------------------------------------------------
 * Proyecto    : memory-task-manager
 * Archivo     : server-cloud.js
 * Descripción :
 * Servidor REST desarrollado con Node.js + Express
 *
 * Compatible con:
 *   ✔ PostgreSQL Local
 *   ✔ Docker
 *   ✔ Google Cloud SQL
 *   ✔ Google Cloud Run
 *---------------------------------------
 */
/*======================
        1 - START-UP PROCESS        
=======================*/
import express from "express";
import cors from "cors";
import path from "path";                 // NUEVO: Importación para rutas
import { fileURLToPath } from "url";     // NUEVO: Para compatibilidad ES6
import { pool } from "../config/db-cloud.js";

/*=======================          
    General Configuration       
========================*/
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const isProduction = process.env.NODE_ENV === "production";
const isCloudSql = process.env.DB_HOST?.startsWith("/cloudsql/");

// Configuración de rutas para archivos estáticos (Frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../public");

/*========================
            Server Banner                                     
=========================*/
console.log();
console.log("===========================");
console.log("        MEMORY TASK MANAGER - REST API");
console.log("===========================");
console.log(`Environment : ${isProduction ? "Production" : "Development"}`);
console.log(`Port        : ${PORT}`);
console.log(`Database    : ${process.env.DB_NAME}`);
console.log(`Host        : ${process.env.DB_HOST}`);
console.log(`Cloud SQL   : ${isCloudSql ? "Enabled" : "Disabled"}`);
console.log(`Static Path : ${publicPath}`); // Verificación visual en consola
console.log("===========================");
console.log();

/*================================
            Middleware                                     
=================================*/
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);
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
                : "Development"
    });
});
/*==============================
       Health Check                                   
===============================*/
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Service available."
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
            database: process.env.DB_NAME,
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
            error: error.message
        });
    }
});
/*==============================
            Database Information                           
===============================*/
app.get("/db-info", async (req, res) => {
    try {
        const result = await pool.query(
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
            error: error.message
        });
    }
});
/*=================================
       END BLOCK 1 - START-UP PROCESS                     
=================================*/

/*================================
             2 - CRUD OPERATIONS                     
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
                completed,
                priority,
                due_date,
                created_at,
                updated_at
             FROM tasks
            ORDER BY id DESC`
        );
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            message: "Unable to retrieve tasks.",
            error: error.message
        });
    }
});
/*---------------------------------
 GET
 Retrieve task by ID
----------------------------------*/
app.get("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                completed,
                priority,
                due_date,
                created_at,
                updated_at
             FROM tasks
             WHERE id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Task not found."
            });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            message: "Unable to retrieve task.",
            error: error.message
        });
    }
});
/*---------------------------------------
 POST
 Create new task
------------------------------------------*/
app.post("/tasks", async (req, res) => {
    try {
        const {
            title,
            description,
            completed = false,
            priority = "Medium",
            due_date = null
        } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({
                status: "ERROR",
                message: "Task title is required."
            });
        }
        const result = await pool.query(
            `INSERT INTO tasks
            (
                title,
                description,
                completed,
                priority,
                due_date
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )

            RETURNING
                id,
                title,
                description,
                completed,
                priority,
                due_date,
                created_at,
                updated_at`,

            [
                title.trim(),
                description?.trim() || "",
                completed,
                priority,
                due_date
            ]
        );
        res.status(201).json({
            status: "OK",
            message: "Task successfully created.",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            message: "Unable to create task.",
            error: error.message
        });
    }
});
/*--------------------------------------
 PUT
 Update task
---------------------------------------*/
app.put("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {
            title,
            description,
            completed,
            priority,
            due_date
        } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({
                status: "ERROR",
                message: "Task title is required."
            });
        }
        const result = await pool.query(
            `UPDATE tasks
                SET
                    title = $1,
                    description = $2,
                    completed = $3,
                    priority = $4,
                    due_date = $5,
                    updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING
                    id,
                    title,
                    description,
                    completed,
                    priority,
                    due_date,
                    created_at,
                    updated_at`,
            [
                title.trim(),
                description?.trim() || "",
                completed,
               priority,
                due_date,
                id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Task not found."
            });
        }
        res.status(200).json({
            status: "OK",
            message: "Task successfully updated.",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            message: "Unable to update task.",
            error: error.message
        });
    }
});
/*-----------------------------------
 DELETE
 Delete task
----------------------------------------*/
app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             RETURNING id`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "ERROR",
                message: "Task not found."
            });
        }
        res.status(200).json({
            status: "OK",
            message: "Task successfully deleted."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            message: "Unable to delete task.",
            error: error.message
        });
    }
});
/*======================
              END BLOCK 2 - CRUD OPERATIONS               
=========================*/

/*=======================
            3 - MIDDLEWARE - START                       
========================*/

/*-----------------------------------------
 Middleware 404
------------------------------------------*/
app.use((req, res) => {
    res.status(404).json({
        status: "ERROR",
        message: "Endpoint not found.",
        endpoint: req.originalUrl
    });
});
/*----------------------------------------
 Global Error Handler
------------------------------------------*/
app.use((error, req, res, next) => {
    console.error();
    console.error("====================");
    console.error("SERVER ERROR");
    console.error("=====================");
    console.error(error);
    console.error("=====================");
    res.status(500).json({
        status: "ERROR",
        message: "Internal server error.",
        error: error.message
    });
});
/*----------------------------------------
 Start Server
------------------------------------------*/
app.listen(PORT, async () => {
    console.log();
    console.log("=======================");
    console.log("        MEMORY TASK MANAGER - REST API");
    console.log("=======================");
    console.log();
    console.log("Application");
    console.log("   Memory Task Manager");
    console.log();
    console.log("Environment");
    console.log(
        `   ${isProduction ? "Production" : "Development"}`
    );
    console.log();
    console.log("Execution");
    if (isCloudSql) {
        console.log("   Google Cloud Run");
    }
    else {
        console.log("   Local / Docker");
    }
    console.log();
    console.log("Server");
    if (isProduction) {
        console.log(`   Listening on PORT ${PORT}`);
    }
    else {
        console.log(
            `   http://localhost:${PORT}`
        );
    }
    console.log();
    console.log("Database");
    console.log(`   ${process.env.DB_NAME}`);
    console.log();
    console.log("Connection");
    console.log(
        `   ${isCloudSql ? "Cloud SQL Socket" : "TCP/IP"}`
    );
    console.log();
    console.log("Available Endpoints");
    console.log("-------------------------------");
    console.log("GET      /");
    console.log("GET      /health");
    console.log("GET      /db-status");
    console.log("GET      /db-info");
    console.log();
    console.log("GET      /tasks");
    console.log("GET      /tasks/:id");
    console.log("POST     /tasks");
    console.log("PUT      /tasks/:id");
    console.log("DELETE   /tasks/:id");
    console.log();
    /*----------------------------------------
         Automatic Database Test
    ------------------------------------------*/
    try {
        const result = await pool.query(
            `SELECT
                current_database(),
                current_user,
                NOW()`
        );
        console.log("---------------------------");
        console.log("Database Status");
        console.log();
        console.log("   Connected Successfully");
        console.log();
        console.log(
            `   Database : ${result.rows[0].current_database}`
        );
        console.log(
            `   User     : ${result.rows[0].current_user}`
        );
        console.log(
            `   Server   : ${result.rows[0].now}`
        );
        console.log();
        console.log("--------------------------");
    }
    catch (error) {
        console.log("--------------------------");
        console.log("Database Status");
        console.log();
        console.log("   Connection Failed");
        console.log();
        console.log(error.message);
        console.log();
        console.log("----------------------------");
    }
    console.log();
    console.log("Server Ready.");
    console.log("================================");
});