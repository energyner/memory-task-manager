# Memory Task Manager
# Languages:  English & Spanish

##================English=====

Description
Memory Task Manager is a modern web application developed using Node.js, Express, and PostgreSQL. Designed as a practical project for Book 6 (Module 2), it guides students through the end-to-end process of building and deploying a scalable web application on the Vercel platform with a Neon PostgreSQL database.

This project focuses on modern development workflows, clean architecture, and cloud-native deployment efficiency.

Project Objectives
Upon completing this project, the student will learn how to:

Develop a REST API using Node.js, Express, and ES Modules.

Integrate and manage a serverless PostgreSQL database using Neon.

Implement environment variables for configuration.

Configure vercel.json for serverless deployment.

Manage professional deployment workflows (CI/CD) with GitHub and Vercel.

ProjectArchitecture

memory-task-manager/
├── api/
│   └── server.js        # Serverless entry point
├── config/
│   └── db.js            # Neon PostgreSQL connection
├── public/              # Frontend assets
├── .env                 # Local configuration
├── .gitignore
├── package.json
├── vercel.json          # Deployment configuration
└── README.md

Technologies Used
Node.js (ES Modules)

Express.js

PostgreSQL (Neon)

Vercel (Deployment)

GitHub (Version Control)

Prerequisites
Node.js (LTS version)

npm

To GitHub account

A Vercel account

A Neon PostgreSQL account

Initial Setup
Clone the repository:
git clone <repository-url>

Install dependencies:

Bash
npm install
Configuration
Local Environment
Copy the .env.example file to .env and fill in your local database credentials:

Code snippet
DATABASE_URL=postgres://user:password@host:port/dbname
PORT=3000
Important: The .env file must never be committed to Git. Use Vercel's dashboard to add these variables for production.

Deployment to Vercel
This project is optimized for Vercel. Upon pushing your code to GitHub, connect your repository to Vercel. Ensure you add the DATABASE_URL in the Environment Variables section of your Vercel project dashboard.

The vercel.json file handles the routing and configuration automatically.

Implemented Best Practices
Modular Architecture: Separation of concerns between API logic and DB configuration.

Security: Use of .gitignore to protect sensitive credentials.

Standardization: Strict use of ES Modules ("type": "module").

Cloud-Ready: Seamless integration with Serverless platforms.

License
This project is for educational purposes and is part of the supporting material for Book 6 (Second Module) of the Programando Paso a Paso y Más instructional series.

Author
René F. Ruano Dominguez


##================Spanish=====

Descripción
Memory Task Manager es una aplicación web moderna desarrollada con Node.js, Express y PostgreSQL. Diseñada como un proyecto práctico para el Libro 6 (Módulo 2), guía a los estudiantes a través del proceso completo de creación y despliegue de una aplicación web escalable en la plataforma Vercel, utilizando una base de datos PostgreSQL de Neon.

Este proyecto se centra en flujos de trabajo de desarrollo modernos, arquitectura limpia y eficiencia en el despliegue nativo para la nube.

Objetivos del proyecto
Al finalizar este proyecto, el estudiante aprenderá a:

Desarrollar una API REST utilizando Node.js, Express y ES Modules.

Integrar y gestionar una base de datos PostgreSQL *serverless* (sin servidor) utilizando Neon.

Implementar variables de entorno para la configuración.

Configurar `vercel.json` para el despliegue *serverless*.

Gestionar flujos de trabajo de despliegue profesional (CI/CD) con GitHub y Vercel.

Arquitectura del proyecto

memory-task-manager/
├── api/
│   └── server.js        # Punto de entrada serverless
├── config/
│   └── db.js            # Conexión a Neon PostgreSQL
├── public/              # Recursos del frontend
├── .env                 # Configuración local
├── .gitignore
├── package.json
├── vercel.json          # Configuración de despliegue
└── README.md

Tecnologías utilizadas
Node.js (ES Modules)

Express.js

PostgreSQL (Neon)

Vercel (Despliegue)

GitHub (Control de versiones)

Requisitos previos
Node.js (versión LTS)

npm

Cuenta de GitHub

Cuenta de Vercel

Cuenta de Neon PostgreSQL

Configuración inicial
Clonar el repositorio:
git clone <url-del-repositorio>

Instalar dependencias:

Bash
npm install
Configuración
Entorno local
Copiar el archivo `.env.example` a `.env` y completar las credenciales de la base de datos local:

Fragmento de código
DATABASE_URL=postgres://user:password@host:port/dbname
PORT=3000
Importante: El archivo `.env` nunca debe subirse a Git. Utiliza el panel de control de Vercel para añadir estas variables para el entorno de producción.

Despliegue en Vercel
Este proyecto está optimizado para Vercel. Tras subir el código a GitHub, conecta tu repositorio a Vercel. Asegúrate de añadir la variable `DATABASE_URL` en la sección de Variables de Entorno (*Environment Variables*) del panel de control de tu proyecto en Vercel. El archivo vercel.json gestiona automáticamente el enrutamiento y la configuración.

Buenas prácticas implementadas
Arquitectura modular: Separación de responsabilidades entre la lógica de la API y la configuración de la base de datos.

Seguridad: Uso de .gitignore para proteger credenciales sensibles.

Estandarización: Uso estricto de módulos ES ("type": "module").

Listo para la nube: Integración fluida con plataformas *serverless*.

Licencia
Este proyecto tiene fines educativos y forma parte del material complementario del Libro 6 (segundo módulo) de la serie didáctica *Programando Paso a Paso y Más*.

Autor
René F. Ruano Dominguez


