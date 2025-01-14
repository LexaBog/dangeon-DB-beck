import app from './app.js';
import connectDB from './config/db.js'; // Импортируем функцию подключения к MongoDB


// Подключаемся к базе данных
connectDB();

const PORT = 5021;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
