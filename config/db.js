/**
 *----------------------------------------------------------
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
 *----------------------------------------------------------
 */

import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { Pool } = pkg;

/*==========================================================
    CARGA DEL ARCHIVO .ENV (SOLO DESARROLLO)
==========================================================*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

const envPath = path.resolve(__dirname, "../.env");

if (!isProduction && fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("Environment : Development (.env loaded)");
}

/*==========================================================
    VARIABLES NORMALIZADAS
==========================================================*/

const DB_HOST =
    process.env.DB_HOST ||
    process.env.POSTGRES_HOST;

const DB_PORT =
    process.env.DB_PORT ||
    process.env.POSTGRES_PORT ||
    5432;

const DB_NAME =
    process.env.DB_NAME ||
    process.env.POSTGRES_DATABASE;

const DB_USER =
    process.env.DB_USER ||
    process.env.POSTGRES_USER;

const DB_PASSWORD =
    process.env.DB_PASSWORD ||
    process.env.POSTGRES_PASSWORD;

/*==========================================================
    DETECCIÓN DEL MÉTODO DE CONEXIÓN
==========================================================*/

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const isCloudSql =
    DB_HOST?.startsWith("/cloudsql/");

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

/*==========================================================
    VALIDACIÓN DE VARIABLES
==========================================================*/

function validateEnvironment() {

    if (hasConnectionString)
        return;

    const variables = {
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_USER,
        DB_PASSWORD
    };

    for (const [key, value] of Object.entries(variables)) {

        if (!value) {

            throw new Error(
                `Missing required environment variable: ${key}`
            );

        }

    }

}

/*==========================================================
    CREACIÓN DEL POOL
==========================================================*/

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

        host: DB_HOST,
        port: Number(DB_PORT),
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,

        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,

        ssl:
            isCloudSql
                ? false
                : (
                    isProduction
                        ? { rejectUnauthorized: false }
                        : false
                )

    });

}

/*==========================================================
    EXPORTACIÓN
==========================================================*/

export const pool = createPool();

/*==========================================================
    INFORMACIÓN DEL SERVIDOR
==========================================================*/

console.log("\n=================================");
console.log(" POSTGRESQL CONNECTION MODULE");
console.log("=================================");
console.log(`Environment : ${isProduction ? "Production" : "Development"}`);
console.log(`Provider    : ${provider}`);

if (hasConnectionString)
    console.log("Method      : DATABASE_URL");

else if (isCloudSql)
    console.log("Method      : Cloud SQL Socket");

else
    console.log("Method      : Standard TCP/IP");

console.log("=================================\n");

/*==========================================================
    PRUEBA DE CONEXIÓN
==========================================================*/

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

        if (client)
            client.release();

    }

}