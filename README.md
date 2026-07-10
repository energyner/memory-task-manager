# Memory Task Manager
# Idioma SP e EN
## Descripción

**Memory Task Manager** es una aplicación desarrollada con **Node.js**, **Express** y **PostgreSQL**, diseñada para demostrar el proceso completo de construcción, contenerización y despliegue de una aplicación **Cloud-Native** en Google Cloud.

El proyecto forma parte del proceso de aprendizaje del Libro 6 - Segundo Modulo  y permite al estudiante recorrer todas las etapas de un desarrollo profesional, desde la implementación local hasta su publicación en la nube utilizando Docker, Cloud SQL, Artifact Registry y Cloud Run.

---

# Objetivos del proyecto

Al completar este proyecto el estudiante aprenderá a:

* Desarrollar una API REST con Node.js y Express.
* Conectarse a una base de datos PostgreSQL.
* Administrar una base de datos Cloud SQL en Google Cloud.
* Utilizar variables de entorno para la configuración de la aplicación.
* Gestionar credenciales mediante Secret Manager.
* Construir imágenes Docker profesionales.
* Publicar imágenes en Artifact Registry.
* Desplegar aplicaciones en Cloud Run.
* Comprender el flujo completo de una arquitectura Cloud-Native.

---

# Arquitectura del proyecto


memory-task-manager
│
├── config
│     └── db-cloud.js
│
├── node_modules
│
├── public
│     ├── assets
│     │     ├── css
│     │     ├── doc
│     │     ├── img
│     │     └── js
│     │            └── main-cloud.js
│     │
│     └── index.html
│
├── server
│     └── server-cloud.js
│
├── .dockerignore
├── .gitignore
├── .env
├── .env.example
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md


# Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript (ES Modules)
* Node.js
* Express
* PostgreSQL
* Docker
* Google Cloud SQL
* Artifact Registry
* Cloud Run
* Secret Manager

---

# Requisitos previos

Antes de ejecutar el proyecto asegúrese de disponer de:

* Node.js (versión LTS recomendada)
* npm
* PostgreSQL
* Google Cloud CLI (gcloud)
* Cloud SQL Auth Proxy
* Docker Desktop
* Una cuenta de Google Cloud con un proyecto activo

---

# Configuración inicial

Clone el repositorio y acceda a la carpeta del proyecto.

Instale las dependencias:

bash
npm install


---

# Configuración del archivo .env

Copie el archivo:

text
.env

y complete los valores correspondientes a su entorno de trabajo.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memory-task
DB_USER=memory_user
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development


> **Importante:** El archivo `.env` contiene información sensible y nunca debe publicarse en un repositorio Git.

---

# Ejecución del proyecto

Inicie el servidor utilizando el script definido en `package.json`.

Una vez iniciado, abra el navegador y acceda a la dirección correspondiente para verificar el funcionamiento de la aplicación.

---

# Base de datos

El proyecto utiliza PostgreSQL.

Durante el desarrollo puede trabajar con una instancia local o con una instancia de Cloud SQL mediante Cloud SQL Auth Proxy.

La base de datos utilizada en este proyecto es:

memory-task

La tabla principal es:

tasks


---

# Docker

La aplicación incorpora un `Dockerfile` para construir una imagen completamente portable.

Construya la imagen mediante Docker y verifique su funcionamiento antes de proceder al despliegue en Google Cloud.

---

# Despliegue en Google Cloud

El proyecto está preparado para desplegarse utilizando:

* Artifact Registry
* Cloud Build
* Cloud SQL
* Secret Manager
* Cloud Run

Durante el despliegue, las credenciales dejarán de almacenarse en el archivo `.env` y serán suministradas mediante variables de entorno y secretos administrados por Google Cloud.

---

# Buenas prácticas implementadas

* Separación entre configuración y lógica de negocio.
* Variables de entorno para la configuración.
* Exclusión de archivos sensibles mediante `.gitignore`.
* Exclusión de archivos innecesarios mediante `.dockerignore`.
* Arquitectura modular.
* Preparado para entornos Cloud-Native.

---

# Licencia

Este proyecto tiene fines educativos y forma parte del material de apoyo del Libro 6 - Segundo Modulo de la serie Programando Paso a Paso y Mas. Instructivo.

Puede utilizarse como referencia para el aprendizaje y el desarrollo de aplicaciones modernas con Node.js, PostgreSQL y Google Cloud.

---

# Autor

**René RD**

Proyecto desarrollado como material didáctico para la enseñanza de arquitecturas modernas, aplicaciones Cloud-Native y despliegues profesionales sobre Google Cloud.

---

# Idioma Ingles

## Description

**Memory Task Manager** is an application developed using **Node.js**, **Express**, and **PostgreSQL**, designed to demonstrate the end-to-end process of building, containerizing, and deploying a **Cloud-Native** application on Google Cloud.

This project is part of the learning path for Book 6 (Second Module) and allows students to experience every stage of professional development—from local implementation to cloud deployment—using Docker, Cloud SQL, Artifact Registry, and Cloud Run.

---

# Project Objectives

Upon completing this project, students will learn how to:

* Develop a REST API using Node.js and Express.
* Connect to a PostgreSQL database.
* Manage a Cloud SQL database on Google Cloud.
* Use environment variables for application configuration.
* Manage credentials using Secret Manager.
* Build professional-grade Docker images.
* Publish images to Artifact Registry.
* Deploy applications to Cloud Run.
* Understand the complete workflow of a Cloud-Native architecture. ---

# Project Architecture


memory-task-manager
│
├── config
│     └── db-cloud.js
│
├── node_modules
│
├── public
│     ├── assets
│     │     ├── css
│     │     ├── doc
│     │     ├── img
│     │     └── js
│     │            └── main-cloud.js
│     │
│     └── index.html
│
├── server
│     └── server-cloud.js
│
├── .dockerignore
├── .gitignore
├── .env
├── .env.example
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md


# Technologies Used

* HTML5
* CSS3
* JavaScript (ES Modules)
* Node.js
* Express
* PostgreSQL
* Docker
* Google Cloud SQL
* Artifact Registry
* Cloud Run
* Secret Manager

---

# Prerequisites

Before running the project, ensure you have the following:

* Node.js (LTS version recommended)
* npm
* PostgreSQL
* Google Cloud CLI (gcloud)
* Cloud SQL Auth Proxy
* Docker Desktop
* A Google Cloud account with an active project

---

# Initial Setup

Clone the repository and navigate to the project folder.

Install the dependencies:

bash
npm install


---

# Configuring the .env File

Copy the file:

text
.env

and fill in the values ​​corresponding to your working environment.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memory-task
DB_USER=memory_user
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development


> **Important:** The `.env` file contains sensitive information and must never be published to a Git repository.

---

# Running the Project

Start the server using the script defined in `package.json`.

Once started, open your browser and access the corresponding address to verify that the application is working correctly.

---

# Database

The project uses PostgreSQL. During development, you can work with a local instance or a Cloud SQL instance using the Cloud SQL Auth Proxy.

The database used in this project is:

memory-task

The main table is:

tasks


---

# Docker

The application includes a `Dockerfile` to build a fully portable image.

Build the image using Docker and verify its functionality before proceeding with deployment to Google Cloud.

---

# Deployment to Google Cloud

The project is set up for deployment using:

* Artifact Registry
* Cloud Build
* Cloud SQL
* Secret Manager
* Cloud Run

During deployment, credentials will no longer be stored in the `.env` file; instead, they will be provided via environment variables and secrets managed by Google Cloud.

---

# Implemented Best Practices

* Separation of configuration and business logic.
* Environment variables for configuration.
* Exclusion of sensitive files via `.gitignore`.
* Exclusion of unnecessary files via `.dockerignore`.
* Modular architecture.
* Ready for cloud-native environments.

---

# License

This project is for educational purposes and is part of the supporting material for Book 6 (Module 2) of the *Programando Paso a Paso y Más* (Programming Step-by-Step and More) instructional series.

It can be used as a reference for learning and developing modern applications using Node.js, PostgreSQL, and Google Cloud.

---

# Author

**René RD**

Project developed as educational material for teaching modern architectures, cloud-native applications, and professional deployments on Google Cloud.

---