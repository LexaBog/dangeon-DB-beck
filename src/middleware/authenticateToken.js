import jwt from 'jsonwebtoken';
import Character from '../models/Character.js';

const SECRET_KEY = 'your_secret_key';

export const authenticateToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  try {
    // Расшифровываем токен
    const decoded = jwt.verify(token, SECRET_KEY);
    const { telegramId } = decoded;

    // Проверяем, существует ли пользователь
    const character = await Character.findOne({ telegramId });
    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    // Добавляем данные персонажа в запрос
    req.character = character;
    next();
  } catch (err) {
    console.error('Ошибка проверки токена:', err);
    return res.status(403).json({ error: 'Недействительный токен' });
  }
};
