import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";

const router = express.Router();

router.post("/api/auth", async (req, res) => {
  const { telegramId, username } = req.body;

  console.log("Полученный telegramId на сервере:", telegramId);
  console.log("Имя пользователя на сервере:", username);

  if (!telegramId || !username) {
    return res.status(400).json({ error: "Telegram ID и имя пользователя обязательны" });
  }

  try {
    let user = await User.findOne({ telegramId }).populate("characterId");

    if (user) {
      return res.status(200).json({
        message: "Пользователь найден, переходите в игру",
        user,
        redirect: "/game",
      });
    }

    const character = new Character({ telegramId, name: username });
    await character.save();

    user = new User({ telegramId, username, characterId: character._id });
    await user.save();

    res.status(201).json({
      message: "Пользователь и персонаж созданы",
      user,
      redirect: "/game",
    });
  } catch (error) {
    console.error("Ошибка проверки пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
