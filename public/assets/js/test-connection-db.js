//test-connection-db.js

import express from 'express';
import { pool } from '../../db.js'; // conexión con pg

const app = express();

app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Conexión exitosa a PostgreSQL',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'No se pudo conectar a PostgreSQL',
      error: error.message
    });
  }
});

