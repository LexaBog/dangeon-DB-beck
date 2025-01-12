import express from 'express';
import connectDB from './config/db.js'; // Подключение MongoDB
import mongoose from 'mongoose';

const app = express();

// Подключаем к MongoDB
connectDB();

// Middleware для обработки JSON
app.use(express.json());

// Пример схемы и модели
const playerSchema  = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
});

const Player = mongoose.model('Player', playerSchema);

// Тестовый GET-запрос
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Пример POST-запроса для добавления игрока
app.post('/api/players', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const player = new Player({ name });
      await player.save();
      res.status(201).json(player);
    } catch (error) {
      console.error('Error creating player:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Пример GET-запроса для получения всех игроков
app.get('/api/players', async (req, res) => {
    try {
      const players = await Player.find();
      res.status(200).json(players);
    } catch (error) {
      console.error('Error fetching players:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default app;
