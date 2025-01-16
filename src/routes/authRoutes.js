import express from "express";
import User from "../models/User.js";
import Character from "../models/Character.js";

const router = express.Router();

router.post("/api/auth", async (req, res) => {
    const { telegramId, username } = req.body;

    console.log("Полученный telegramId на сервере:", telegramId);

    if (!telegramId) {
        return res.status(400).json({ error: "Telegram ID is required" });
    }

    try {
        // Проверяем, существует ли пользователь с таким Telegram ID
        let user = await User.findOne({ telegramId }).populate("characterId");

        if (user) {
            console.log("Пользователь найден:", user);
            // Если пользователь найден, возвращаем его данные
            return res.status(200).json({
                message: "Пользователь найден, переходите в игру",
                user,
                redirect: "/game",
            });
        }

        // Если пользователя нет, создаём нового персонажа и пользователя
        const character = new Character({
            _id: uuidv4(), // Генерация уникального ID
            telegramId,
            name: username || "Новый игрок",
        });
        await character.save();

        user = new User({
            telegramId,
            username: username || "Новый пользователь",
            characterId: character._id, // Ссылка на созданного персонажа
        });
        await user.save();

        console.log("Создан новый пользователь:", user);

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
