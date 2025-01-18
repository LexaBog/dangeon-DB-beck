import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";

const router = express.Router();

router.post('/api/auth', async (req, res) => {
  const { telegramId, username } = req.body;

  // if (typeof telegramId !== 'string') telegramId = String(telegramId);
  // if (typeof username !== 'string') username = String(username);

  console.log("Полученные данные:", { telegramId, username });

  if (!telegramId) {
      return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
      // Проверяем, существует ли уже пользователь
      let user = await User.findOne({ telegramId }).populate("characterId");
      if (user) {
          return res.status(200).json({
              message: "Пользователь найден",
              user,
          });
      }

      // Если пользователь не найден, создаем нового
      const character = new Character({ telegramId, name: username });
      await character.save();

      user = new User({ telegramId, username, characterId: character._id });
      console.log(user)
      await user.save();

      res.status(201).json({
          message: "Пользователь создан",
          user,
      });
  } catch (error) {
      console.error("Ошибка авторизации:", error);
      res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
