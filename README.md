# Memory Task Manager
# Idioma SP e EN
## Descripción



Languages: Spanish and English

##================

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
plaintext
memory-task-manager/
├── api/
│ └── server.js # Serverless entry point
├── config/
│ └── db.js # Neon PostgreSQL connection
├── public/ # Frontend assets
├── .env # Local configuration
├── .gitignore
├── package.json
├── vercel.json # Deployment configuration
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


##=================
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

Project Architecture
Plaintext
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

A GitHub account

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

Fragmento de código
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



