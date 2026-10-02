import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import databaseRoutes from './routes/database.routes.js';
import eventRoutes from './routes/event.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import reservationRoutes from './routes/reservation.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/database', databaseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.get('/api', (_req, res) => {
  res.json({
    message: "Bienvenue sur l'API EventHub",
  });
});

app.listen(PORT, () => {
  console.log(`EventHub API running on http://localhost:${PORT}`);
});
