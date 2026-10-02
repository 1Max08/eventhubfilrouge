import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      database: 'postgresql',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      status: 'error',
      database: 'postgresql',
    });
  }
});

export default router;
