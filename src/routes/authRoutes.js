import express from "express";
import { generateTokens, authenticateToken } from "../middleware/middleware.js";
import User from "../models/User.js";
import Character from "../models/Character.js";

const router = express.Router();

router.get("/api/test-protected", authenticateToken, (req, res) => {
  res.json({
    message: "Мидлвар работает! Данные пользователя:",
    user: req.user, // Данные из токена
  });
});


// router.post("/api/auth", async (req, res) => {
//   const { telegramId, username } = req.body;

//   console.log("Полученный telegramId на сервере:", telegramId);
//   console.log("Имя пользователя на сервере:", username);

//   if (!telegramId || !username) {
//     return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
//   }

//   try {
//     let user = await User.findOne({ telegramId }).populate("characterId");

//     if (user) {
//       // Генерация токенов
//       const tokens = generateTokens({ telegramId: user.telegramId });

//       console.log("токен сгенеровован", tokens)

//       return res.status(200).json({
//         message: "Пользователь найден, переходите в игру",
//         user,
//         tokens,
//         redirect: "/game",
//       });
//     }

//     // Проверяем, существует ли персонаж
//     const existingCharacter = await Character.findOne({ telegramId });
//     if (existingCharacter) {
//       return res.status(400).json({ error: "Персонаж с таким telegramId уже существует" });
//     }

//     // Создаём нового персонажа
//     const character = new Character({ telegramId, name: username });
//     await character.save();

//     // Создаём нового пользователя
//     user = new User({ telegramId, username, characterId: character._id });
//     await user.save();

//     const tokens = generateTokens({ telegramId });

//     console.log("токен добавлен", tokens)
    
//     res.status(201).json({
//       message: "Пользователь и персонаж созданы",
//       user,
//       tokens,
//       redirect: "/game",
//     });
//   } catch (error) {
//     console.error("Ошибка проверки пользователя:", error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

router.post("/api/auth", async (req, res) => {
  const { telegramId, username } = req.body;

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
    let user = await User.findOne({ telegramId }).populate("characterId");

    console.log('теоеграм айди в api/auth', telegramId)

    if (user) {
      // Сохраняем telegramId в сессии
      req.session.telegramId = telegramId;
      

      return res.status(200).json({
        message: "Пользователь найден",
        user,
        redirect: "/game",
      });
    }

    // Если пользователь не найден, создаем нового
    const character = new Character({ telegramId, name: username });
    await character.save();

    user = new User({ telegramId, username, characterId: character._id });
    await user.save();

    // Сохраняем telegramId в сессии
    req.session.telegramId = telegramId;

    res.status(201).json({
      message: "Пользователь и персонаж созданы",
      user,
      redirect: "/game",
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});




// Пример защищённого маршрута
router.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Доступ разрешён", user: req.user });
});

export default router;
