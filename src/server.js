import app from './app.js';
import connectDB from './config/db.js'; // Импортируем функцию подключения к MongoDB
import session from "express-session";


// Подключаемся к базе данных
connectDB();

const PORT = 5021;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


app.use(
  session({
    secret: "b4a97c8f43a1b761d7f9a865fae72c8b414a3e5371b65fdf4398f56a6e8a4562", // Используйте безопасный случайный ключ
    resave: false,               // Не пересохранять сессию, если она не изменилась
    saveUninitialized: false,    // Не сохранять сессию, если она пустая
    cookie: { secure: false },   // Установите `true`, если используете HTTPS
  })
);

