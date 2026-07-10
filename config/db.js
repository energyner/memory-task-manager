/**
 *----------------------------------------------------------
 * Archivo    : db-cloud.js
 * Proyecto   : memory-task-manager
 * Descripción:
 * Módulo de conexión PostgreSQL
 *
 * Compatible con:
 *   ✔ Desarrollo Local (.env)
 *   ✔ PostgreSQL Local
 *   ✔ Docker
 *   ✔ Google Cloud SQL
 *   ✔ Google Cloud Run
 *   ✔ Secret Manager
 *----------------------------------------------------------
 */
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { Pool } = pkg;

//----------------------------------------------------------
// Localizar el directorio actual del módulo
//----------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//----------------------------------------------------------
// Cargar variables de entorno (solo desarrollo local)
//----------------------------------------------------------

const isProduction = process.env.NODE_ENV === "production";

const envPath = path.resolve(__dirname, "../.env");

if (!isProduction && fs.existsSync(envPath)) {\q

    dotenv.config({
        path: envPath
    });

    console.log("========================================");
    console.log("Environment : Development");
    console.log("Configuration loaded from .env");
    console.log(`.env file   : ${envPath}`);
    console.log("========================================");
}
else {
    console.log("========================================");
    console.log("Environment : Production");
    console.log("Configuration loaded from Environment Variables");
    console.log("========================================");
}

//----------------------------------------------------------
// Verificar variables de entorno obligatorias
//----------------------------------------------------------

const requiredVariables = [

    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD"

];

for (const variable of requiredVariables) {

    if (!process.env[variable]) {

        console.error();
        console.error("========================================");
        console.error("CONFIGURATION ERROR");
        console.error("========================================");
        console.error(`Missing environment variable: ${variable}`);
        console.error("========================================");
        console.error();

        process.exit(1);

    }

}

//----------------------------------------------------------
// Detectar el tipo de conexión
//----------------------------------------------------------

const isCloudSql =
    process.env.DB_HOST.startsWith("/cloudsql/");

console.log();

console.log("========================================");
console.log("DATABASE CONNECTION");
console.log("========================================");

if (isCloudSql) {

    console.log("Connection : Google Cloud SQL");
    console.log("Method     : Cloud SQL Socket");

}
else if (isProduction) {

    console.log("Connection : PostgreSQL");
    console.log("Method     : TCP/IP + SSL");

}
else {

    console.log("Connection : PostgreSQL");
    console.log("Method     : Local Development");

}

console.log("========================================");
console.log();

//----------------------------------------------------------
// Crear Pool de conexiones PostgreSQL
//----------------------------------------------------------

export const pool = new Pool({

    host: process.env.DB_HOST.trim(),

    port: Number(process.env.DB_PORT) || 5432,

    database: process.env.DB_NAME.trim(),

    user: process.env.DB_USER.trim(),

    password: process.env.DB_PASSWORD,

    max: 20,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 5000,

    ssl: isCloudSql
        ? false
        : (
            isProduction
                ? { rejectUnauthorized: false }
                : false
        )

});

//----------------------------------------------------------
// Verificación inicial de la conexión
//----------------------------------------------------------

(async () => {

    try {

        const client = await pool.connect();

        console.log();

        console.log("========================================");
        console.log("POSTGRESQL CONNECTION SUCCESSFUL");
        console.log("========================================");
        console.log("Host      :", process.env.DB_HOST);
        console.log("Database  :", process.env.DB_NAME);
        console.log("User      :", process.env.DB_USER);
        console.log("Status    : Connected");

        if (isCloudSql) {

            console.log("Mode      : Cloud SQL");

        }
        else if (isProduction) {

            console.log("Mode      : Production");

        }
        else {

            console.log("Mode      : Development");

        }

        console.log("========================================");
        console.log();

        client.release();

    }
    catch (error) {

        console.error();

        console.error("========================================");
        console.error("POSTGRESQL CONNECTION ERROR");
        console.error("========================================");
        console.error(error.message);
        console.error("========================================");
        console.error();

        process.exit(1);

    }

})();