import User from "../models/User.js";
import Dungeon from "../models/dungeons/Dungeon.js";

export const startDungeon = async (telegramId, dungeonId) => {
  try {
    console.log("startDungeon вызван с параметрами:", { telegramId, dungeonId });

    // Проверяем существование подземелья
    const dungeon = await Dungeon.findById(dungeonId);
    if (!dungeon) {
      console.error("Подземелье не найдено:", dungeonId);
      throw new Error("Подземелье не найдено");
    }

    // Проверяем существование пользователя
    const user = await User.findOne({ telegramId });
    if (!user) {
      console.error("Пользователь не найден:", telegramId);
      throw new Error("Пользователь не найден");
    }

    // Проверяем, не находится ли пользователь в активном подземелье
    // if (user.currentDungeon && user.currentDungeon.startTime) {
    //   const now = new Date();
    //   const elapsedTime = (now - user.currentDungeon.startTime) / 1000; // В секундах
    //   if (elapsedTime < user.currentDungeon.duration) {
    //     throw new Error("Пользователь уже находится в подземелье");
    //   }
    // }
    const isDungeonActive = user.activeDungeons?.some(
        (activeDungeon) => activeDungeon.dungeonId.toString() === dungeonId.toString()
    );
  
    if (isDungeonActive) {
      throw new Error("Это подземелье уже активно");
    }

    // Добавляем подземелье в список активных
    const newActiveDungeon = {
        dungeonId: dungeon._id,
        startTime: new Date(),
        duration: dungeon.duration,
        endTime: new Date(Date.now() + dungeon.duration * 1000),
    };

    // Сохраняем данные активного подземелья для пользователя
    user.currentDungeon = {
      dungeonId: dungeon._id,
      startTime: new Date(),
      duration: dungeon.duration,
      endTime: new Date(Date.now() + dungeon.duration * 1000),
    };
    await user.save();

    return {
    //   message: "Подземелье успешно запущено",
    //   dungeon: {
    //     id: dungeon._id,
    //     name: dungeon.name,
    //     duration: dungeon.duration,
    //     experience: dungeon.experience,
    //     gold: dungeon.gold,
    //     endTime: new Date(Date.now() + dungeon.duration * 1000),
    //   },
        message: "Подземелье успешно запущено",
        dungeon: newActiveDungeon,
    };
  } catch (error) {
    console.error("Ошибка при запуске подземелья:", error);
    throw error;
  }
};
