/**
 *----------------------------------------------------------
 * Archivo    : db.js
 * Proyecto   : memory-task-manager
 * Descripción:
 * Módulo de conexión PostgreSQL.
 *
 * Compatible con:
 *   ✔ Desarrollo Local (PostgreSQL)
 *   ✔ Producción (Vercel + Neon)
 *
 * En producción se utiliza automáticamente la variable
 * DATABASE_URL generada por Vercel.
 *
 * En desarrollo se utilizan las variables definidas
 * en el archivo .env.
 *----------------------------------------------------------
 */

import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

/*==========================================================
    CARGA DEL ARCHIVO .ENV (SOLO DESARROLLO)
==========================================================*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {

    const envPath = path.resolve(__dirname, "../.env");

    if (fs.existsSync(envPath)) {

        dotenv.config({ path: envPath });

        console.log("Environment : Development (.env loaded)");

    }

}

/*==========================================================
    DETECCIÓN DEL MÉTODO DE CONEXIÓN
==========================================================*/

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const provider = hasConnectionString
    ? "Vercel + Neon"
    : "Local PostgreSQL";

/*==========================================================
    VALIDACIÓN DE VARIABLES (SOLO DESARROLLO)
==========================================================*/

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

        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),

        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,

        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,

        ssl: false

    });

}

/*==========================================================
    EXPORTACIÓN
==========================================================*/

export const pool = createPool();

/*==========================================================
    INFORMACIÓN DEL MÓDULO
==========================================================*/

console.log("\n=================================");
console.log(" POSTGRESQL CONNECTION MODULE");
console.log("=================================");
console.log(`Environment : ${isProduction ? "Production" : "Development"}`);
console.log(`Provider    : ${provider}`);
console.log(`Method      : ${hasConnectionString ? "DATABASE_URL" : "Standard TCP/IP"}`);
console.log("=================================\n");

/*==========================================================
    PRUEBA DE CONEXIÓN
==========================================================*/

export async function testConnection() {

    let client;

    try {

        client = await pool.connect();

        console.log("=================================");
        console.log(" PostgreSQL Connected");
        console.log("=================================");
        console.log(`Provider : ${provider}`);

        if (!hasConnectionString) {

            console.log(`Host     : ${process.env.DB_HOST}`);
            console.log(`Database : ${process.env.DB_NAME}`);
            console.log(`User     : ${process.env.DB_USER}`);

        }

        console.log("=================================\n");

    }
    catch (error) {

        console.error("=================================");
        console.error(" PostgreSQL Connection Error");
        console.error("=================================");
        console.error(error.message);
        console.error("=================================\n");

        throw error;

    }
    finally {

        if (client)
            client.release();

    }

}