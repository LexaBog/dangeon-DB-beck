import express from 'express';
import Dungeon from '../../models/dungeons/Dungeon.js';
import mongoose from "mongoose";
import User from '../../models/User.js';
import { completeDungeon } from '../../service/RewardService.js';

const router = express.Router();

// Пример получения всех данжей
router.get('/api/dungeons', async (req, res) => {
  try {
    const dungeons = await Dungeon.find();
    res.status(200).json(dungeons);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данжей' });
  }
});

// Пример маршрута
router.post("/api/dungeons/start", async (req, res) => {
  try {
    const { telegramId, _id } = req.body;

    // Проверяем, что оба параметра переданы
    if (!_id || !telegramId) {
      return res.status(400).json({ error: "ID пользователя и подземелья обязательны" });
    }

    // Проверяем корректность идентификатора подземелья
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Некорректный ID подземелья" });
    }

    // Находим пользователя
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Находим подземелье по ID
    const dungeon = await Dungeon.findById(_id);
    if (!dungeon) {
      console.error("Подземелье не найдено в базе данных!");
      return res.status(404).json({ error: "Подземелье не найдено" });
    }

    // Проверяем, не запущено ли уже это подземелье
    const isDungeonActive = user.activeDungeons.some(
      (activeDungeon) => activeDungeon.dungeonId.toString() === _id
    );
    if (isDungeonActive) {
      return res.status(400).json({ error: "Это подземелье уже активно" });
    }

    // Формируем объект нового активного подземелья
    const now = new Date();
    const newActiveDungeon = {
      dungeonId: dungeon._id,
      startTime: now,
      endTime: new Date(now.getTime() + dungeon.duration * 1000),
      duration: dungeon.duration,
      // Здесь согласно вашей логике:
      // isRewardCollected === true означает, что награды ещё не собраны (то есть доступны для сбора)
      isRewardCollected: true,
      goldReward: dungeon.goldReward,
      experienceReward: dungeon.experienceReward,
      cardDropChance: dungeon.cardDropChance,
    };

    // Добавляем подземелье в список активных у пользователя
    user.activeDungeons.push(newActiveDungeon);
    await user.save();

    // Отправляем ответ на клиент с данными нового активного подземелья
    res.status(200).json({
      message: "Подземелье успешно запущено",
      dungeon: newActiveDungeon,
    });
  } catch (error) {
    console.error("Ошибка при запуске подземелья:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


router.get('/api/user/:telegramId', async (req, res) => {
  const { telegramId } = req.params;

  try {
    const user = await User.findOne({ telegramId }).populate("activeDungeons.dungeonId");

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const now = new Date();

    user.activeDungeons.forEach((dungeon) => {
      // console.log("Dungeon:", dungeon.dungeonId.toString());
      console.log("EndTime:", new Date(dungeon.endTime));
      console.log("Now:", now);
      console.log("isRewardCollected:", dungeon.isRewardCollected);
    });

    const filteredDungeons = user.activeDungeons.filter((dungeon) => {
      const dungeonEnd = new Date(dungeon.endTime);
      if (dungeonEnd > now) {
        return true;
      }
      if (dungeonEnd <= now && dungeon.isRewardCollected === true) {
        return true;
      }
      return false;
    });

    return res.status(200).json({
      telegramId: user.telegramId,
      username: user.username,
      activeDungeons: filteredDungeons,
    });
  } catch (error) {
    console.error("Ошибка получения данных пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


router.post("/api/dungeons/complete", async (req, res) => {
  try {
    const { telegramId, dungeonId } = req.body;
    if (!telegramId || !dungeonId) {
      return res.status(400).json({ error: "Отсутствуют параметры telegramId или dungeonId" });
    }

    // Вызываем корректно функцию completeDungeon
    const result = await completeDungeon(telegramId, dungeonId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Ошибка завершения подземелья:", error.message);
    return res.status(500).json({ error: error.message });
  }
});






export default router;
