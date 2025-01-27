import express from 'express';
import Dungeon from '../../models/dungeons/Dungeon.js';
import { startDungeon } from '../../service/dungeonService.js';
import mongoose from "mongoose";
import User from '../../models/User.js';
import Character from "../../models/Character.js"


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

//ЭТОТ РОУТ ОБНГВЛЯЕТ ДАНДЖЫ, ТОЕСТЬ НЕ ОБНОВЛЯЕТ А ДОБАВЛЯЕТЕТ
// ЕСЛИ ДЕЛАТЬ ИЗМЕНЕНИЯ ТО ПЕРЕД ДОБАВЛЕНИЕМ ОЧИСТИТЬ БАЗУ
router.post('/api/generate-dungeons', async (req, res) => {
const now = new Date()
const dungeons = [
  {
    telegramId: new mongoose.Types.ObjectId(), // Ссылка на пользователя (замените на реальный ObjectId)
    dungeonId: new mongoose.Types.ObjectId(), // Ссылка на подземелье (замените на реальный ObjectId)
    name: "Dungeon 1",
    level: 1,
    duration: 5,
    experienceReward: 50,
    goldReward: 50,
    cardDropChance: 1, // 1 = 100% шанс выпадения карты
    startTime: now, // Время старта
    endTime: new Date(now.getTime() + 300 * 1000), // Время завершения (длительность в миллисекундах)
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 2",
    level: 2,
    duration: 600,
    experienceReward: 100,
    goldReward: 50,
    cardDropChance: 0.1,
    startTime: now,
    endTime: new Date(now.getTime() + 600 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 3",
    level: 3,
    duration: 900,
    experienceReward: 200,
    goldReward: 50,
    cardDropChance: 0.2,
    startTime: now,
    endTime: new Date(now.getTime() + 900 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 4",
    level: 4,
    duration: 1200,
    experienceReward: 300,
    goldReward: 50,
    cardDropChance: 0.3,
    startTime: now,
    endTime: new Date(now.getTime() + 1200 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 5",
    level: 5,
    duration: 1500,
    experienceReward: 400,
    goldReward: 50,
    cardDropChance: 0.4,
    startTime: now,
    endTime: new Date(now.getTime() + 1500 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 6",
    level: 6,
    duration: 1800,
    experienceReward: 500,
    goldReward: 50,
    cardDropChance: 0.5,
    startTime: now,
    endTime: new Date(now.getTime() + 1800 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 7",
    level: 7,
    duration: 2100,
    experienceReward: 600,
    goldReward: 50,
    cardDropChance: 0.5,
    startTime: now,
    endTime: new Date(now.getTime() + 2100 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 8",
    level: 8,
    duration: 2400,
    experienceReward: 700,
    goldReward: 50,
    cardDropChance: 0.5,
    startTime: now,
    endTime: new Date(now.getTime() + 2400 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 9",
    level: 9,
    duration: 2700,
    experienceReward: 800,
    goldReward: 50,
    cardDropChance: 0.5,
    startTime: now,
    endTime: new Date(now.getTime() + 2700 * 1000),
  },
  {
    telegramId: new mongoose.Types.ObjectId(),
    dungeonId: new mongoose.Types.ObjectId(),
    name: "Dungeon 10",
    level: 10,
    duration: 3000,
    experienceReward: 900,
    goldReward: 50,
    cardDropChance: 0.5,
    startTime: now,
    endTime: new Date(now.getTime() + 3000 * 1000),
  },
];

  try {
    await Dungeon.insertMany(dungeons);
    res.status(201).json({ message: 'Данжи успешно созданы!' });
  } catch (error) {
    console.error('Ошибка при создании данжей:', error);
    res.status(500).json({ error: 'Ошибка при создании данжей' });
  }
});

// Пример маршрута
router.post("/api/dungeons/start", async (req, res) => {
  try {
    const { telegramId, dungeonId } = req.body;

    console.log("Параметры получены:", { telegramId, dungeonId });

    if (!dungeonId || !telegramId) {
      return res.status(400).json({ error: "ID пользователя и подземелья обязательны" });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const dungeon = await Dungeon.findById(dungeonId);

    if (!dungeon) {
      return res.status(404).json({ error: "Подземелье не найдено" });
    }

    // Проверяем, не запущено ли это подземелье уже
    const isDungeonActive = user.activeDungeons.some(
      (activeDungeon) => activeDungeon.dungeonId.toString() === dungeonId
    );

    if (isDungeonActive) {
      return res.status(400).json({ error: "Это подземелье уже активно" });
    }

    // Добавляем подземелье в activeDungeons
    const now = new Date();
    const newActiveDungeon = {
      dungeonId: dungeon._id,
      startTime: now,
      endTime: new Date(now.getTime() + dungeon.duration * 1000),
      duration: dungeon.duration,
    };

    user.activeDungeons.push(newActiveDungeon);
    await user.save();

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
    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Удаляем завершенные подземелья
    const now = new Date();
    user.activeDungeons = user.activeDungeons.filter((dungeon) => new Date(dungeon.endTime) > now);

    await user.save();

    res.status(200).json({
      telegramId: user.telegramId,
      username: user.username,
      activeDungeons: user.activeDungeons,
    });
  } catch (error) {
    console.error("Ошибка получения данных пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/api/dungeons/complete", async (req, res) => {
  try {
    const { telegramId, dungeonId } = req.body;

    console.log("Параметры получены:", { telegramId, dungeonId });

    // Получаем пользователя
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверяем, что подземелье активно
    const activeDungeon = user.activeDungeons.find(
      (dungeon) => dungeon.dungeonId.toString() === dungeonId
    );

    if (!activeDungeon) {
      return res.status(400).json({ error: "Подземелье не активно или уже завершено" });
    }

    // Проверяем, завершилось ли подземелье
    const now = new Date();
    if (new Date(activeDungeon.endTime) > now) {
      return res.status(400).json({ error: "Подземелье ещё не завершено" });
    }

    // Получаем данные о подземелье
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      return res.status(404).json({ error: "Подземелье не найдено" });
    }

    // Получаем персонажа пользователя
    const character = await Character.findById(user.characterId);
    if (!character) {
      return res.status(400).json({ error: "Персонаж не найден" });
    }

    // Начисляем награды персонажу
    character.gold += dungeon.goldReward; // Убедитесь, что поле gold существует в модели Character
    character.experience += dungeon.experienceReward; // Убедитесь, что поле experience существует
    await character.save();

    // Убираем подземелье из активных
    user.activeDungeons = user.activeDungeons.filter(
      (d) => d.dungeonId.toString() !== dungeonId
    );
    await user.save();

    res.status(200).json({
      message: "Подземелье завершено, награды начислены",
      rewards: {
        gold: dungeon.goldReward,
        experience: dungeon.experienceReward,
      },
    });
  } catch (error) {
    console.error("Ошибка завершения подземелья:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
