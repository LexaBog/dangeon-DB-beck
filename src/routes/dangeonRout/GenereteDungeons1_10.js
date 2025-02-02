import Dungeon from "../../models/dungeons/Dungeon.js";
import express from 'express';

const router = express.Router();

//ЭТОТ РОУТ ОБНоВЛЯЕТ ДАНДЖЫ, ТОЕСТЬ НЕ ОБНОВЛЯЕТ А ДОБАВЛЯЕТЕТ
// ЕСЛИ ДЕЛАТЬ ИЗМЕНЕНИЯ ТО ПЕРЕД ДОБАВЛЕНИЕМ ОЧИСТИТЬ БАЗУ
router.post('/api/generate-dungeons', async (req, res) => {
    const now = new Date()
    const dungeons = [
      {
        telegramId: new mongoose.Types.ObjectId(), // Ссылка на пользователя (замените на реальный ObjectId)
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

export default router;