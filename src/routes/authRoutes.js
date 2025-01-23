import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";
import jwt from 'jsonwebtoken';



const router = express.Router();

const SECRET_KEY = 'b4a97c8f43a1b761d7f9a865fae72c8b414a3e5371b65fdf4398f56a6e8a4562'; // Замените на ваш секретный ключ

// Эндпоинт для валидации токена
router.post('/api/validate-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Расшифровка токена
    const { telegramId, username } = decoded;

    if (!telegramId || !username) {
      return res.status(400).json({ error: "Некорректный токен" });
    }

    console.log("Токен успешно верифицирован:", decoded);
    res.json({ data: { telegramId, username } });
  } catch (err) {
    console.error("Ошибка валидации токена:", err.message);
    res.status(401).json({ error: "Недействительный токен" });
  }
});

router.post('/api/auth', async (req, res) => {
  const { telegramId, username } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
    // Проверяем, существует ли пользователь
    let user = await User.findOne({ telegramId }).populate("characterId");

    if (user) {
      // Обновляем имя пользователя, если оно изменилось
      if (user.username !== username) {
        user.username = username;
        await user.save();
      }

      // Работаем с `characterId`, обновляем здоровье
      if (user.characterId) {
        const now = Date.now();
        const lastUpdate = new Date(user.characterId.lastHealthUpdate).getTime();
        const secondsPassed = Math.floor((now - lastUpdate) / 1000);
        const healthToAdd = Math.floor(secondsPassed * 0.1); // Регенерация 0.1 HP в секунду

        if (user.characterId.health < user.characterId.maxHealth) {
          user.characterId.health = Math.min(user.characterId.health + healthToAdd, user.characterId.maxHealth);
          user.characterId.lastHealthUpdate = new Date();
          await user.characterId.save();
        }
      }

      return res.status(200).json({
        message: "Пользователь найден",
        user,
      });
    }

    // Создаём нового персонажа и пользователя
    const character = new Character({ telegramId, name: username });
    await character.save();

    user = new User({ telegramId, username, characterId: character._id });
    await user.save();

    res.status(201).json({
      message: "Пользователь и персонаж созданы",
      user,
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post('/api/characters/update', async (req, res) => {
  const { telegramId, updates } = req.body;

  if (!telegramId || !updates) {
    return res.status(400).json({ error: 'Telegram ID и изменения обязательны.' });
  }

  try {
    // Ищем персонажа по Telegram ID
    const character = await Character.findOne({ telegramId });

    if (!character) {
      return res.status(404).json({ error: 'Персонаж с таким Telegram ID не найден.' });
    }

    // Применяем остальные изменения
    Object.keys(updates).forEach((key) => {
      if (key !== 'experience') {
        character[key] = updates[key];
      }
    });

    // Сохраняем изменения в базе
    await character.save();

    console.log('Обновленный персонаж:', character);
    res.status(200).json({ message: 'Персонаж успешно обновлен.', character });
  } catch (error) {
    console.error('Ошибка при обновлении персонажа:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении персонажа.' });
  }
});




export default router;
