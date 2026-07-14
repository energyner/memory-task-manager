/**
 *---------------------------
 * Archivo    : db.js
 * Proyecto   : memory-task-manager
 * Descripción:
 * Módulo de conexión PostgreSQL adaptable a múltiples
 * entornos de ejecución.
 *
 * Compatible con:
 *   ✔ PostgreSQL Local
 *   ✔ Docker
 *   ✔ Vercel Postgres
 *   ✔ Neon
 *   ✔ Supabase
 *   ✔ Railway
 *   ✔ Google Cloud SQL
 *
 * El módulo detecta automáticamente el método de conexión
 * según las variables de entorno disponibles, permitiendo
 * utilizar el mismo código fuente en desarrollo, pruebas
 * y producción sin modificaciones.
 *---------------------------
 */

import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { Pool } = pkg;

/*====================
        CARGA DEL ARCHIVO .ENV (SOLO DESARROLLO)
=====================*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
const envPath = path.resolve(__dirname, "../.env");

if (!isProduction && fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("Environment : Development (.env loaded)");
}

/*====================
        DETECCIÓN DEL MÉTODO DE CONEXIÓN
=====================*/
const hasConnectionString = Boolean(process.env.DATABASE_URL);
const isCloudSql =
    process.env.DB_HOST?.startsWith("/cloudsql/");
let provider = "Local PostgreSQL";

if (hasConnectionString) {
    if (process.env.DATABASE_URL.includes("neon.tech"))
        provider = "Neon";
    else if (process.env.DATABASE_URL.includes("vercel-storage"))
        provider = "Vercel Postgres";
    else if (process.env.DATABASE_URL.includes("supabase"))
        provider = "Supabase";
    else if (process.env.DATABASE_URL.includes("railway"))
        provider = "Railway";
    else
        provider = "External PostgreSQL";
}
else if (isCloudSql) {
    provider = "Google Cloud SQL";
}
/*====================
        VALIDACIÓN DE VARIABLES DE ENTORNO
=====================*/

function validateEnvironment() {
    if (hasConnectionString) return;
    const requiredVariables = [
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD"
    ];
    for (const variable of requiredVariables) {
        if (!process.env[variable]) {
            throw new Error(
                `Missing required environment variable: ${variable}`
            );
        }
    }
}

/*====================
        CREACIÓN DEL POOL DE CONEXIONES
======================*/
function createPool() {
    validateEnvironment();
    if (hasConnectionString) {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        });
    }
    return new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        ssl: isCloudSql
            ? false
            : (isProduction
                ? { rejectUnauthorized: false }
                : false)
    });
}

/*====================
        EXPORTACIÓN DEL POOL
=====================*/

export const pool = createPool();

/*====================
        BANNER DEL SERVIDOR
=====================*/
console.log("\n=============");
console.log(" POSTGRESQL CONNECTION MODULE");
console.log("===============");
console.log(`Environment : ${isProduction ? "Production" : "Development"}`);
console.log(`Provider    : ${provider}`);

if (hasConnectionString)
    console.log("Method      : DATABASE_URL");
else if (isCloudSql)
    console.log("Method      : Cloud SQL Socket");
else
    console.log("Method      : Standard TCP/IP");
console.log("================\n");

/*====================
        VERIFICAR CONEXIÓN
=====================*/

export async function testConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log("POSTGRESQL CONNECTION SUCCESSFUL");
    }
    catch (error) {
        console.error("POSTGRESQL CONNECTION ERROR");
        console.error(error.message);
        throw error;
    }
    finally {
        if (client) client.release();
    }
}