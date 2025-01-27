import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; // Подключение MongoDB
import mongoose from 'mongoose';
import characterRoutes from './routes/characterRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import tokenRoutes from './routes/tokenRoutes.js';
import bodyParser from 'body-parser';
import dangeonRout from './routes/dangeonRout/dangeonRout.js'

const app = express();

// Подключаем к MongoDB
connectDB();
app.use(cookieParser());

const corsOptions = {
  origin:
  [
    'http://localhost:3000', // Укажите адрес вашего клиента
    'https://dungeon-crawler-game.vercel.app',
  ],
  credentials: true, // Разрешить отправку куки
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Укажите разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Укажите разрешенные заголовки
};
// app.options('*', cors(corsOptions)); // Разрешить preflight-запросы
app.use(cors());
// app.options("*", cors(corsOptions));

app.use(bodyParser.json())
app.use(tokenRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'CorsError') {
      res.status(500).send('Ошибка CORS');
  } else {
      next(err);
  }
});
// Middleware для обработки JSON
app.use(express.json());

// Подключение маршрутов для создания персонажа
app.use(characterRoutes);

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

app.use(authRoutes);
// app.use(getCharacter);

app.use(dangeonRout);



export default app;
