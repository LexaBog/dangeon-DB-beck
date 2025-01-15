import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/api/auth", async (req, res) => {
  const { telegramId } = req.body;
  console.log("Полученный telegramId на сервере:", req.body.telegramId);


  if (!telegramId) {
    return res.status(400).json({ error: "Telegram ID is required" });
  }

  try {
    // Проверяем, существует ли пользователь с таким Telegram ID
    const user = await User.findOne({ telegramId: Number(telegramId) }).populate("characterId");


    if (user) {
      console.log("Пользователь найден:", user);
      // Если пользователь найден, возвращаем его данные
      return res.status(200).json({ 
        message: "Пользователь найден, переходите в игру", 
        user,
        redirect: "/game" // Указываем, куда перенаправить
      });
    }

    // Если пользователя нет, возвращаем команду открыть страницу создания персонажа
    res.status(200).json({ 
      message: "Пользователь не найден, откройте страницу создания персонажа", 
      redirect: "/" // Указываем, куда перенаправить
    });
  } catch (error) {
    console.error("Ошибка проверки пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
