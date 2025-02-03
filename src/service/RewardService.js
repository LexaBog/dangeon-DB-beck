// src/service/rewardService.js
import User from "../models/User.js";
import Character from "../models/Character.js";
import { checkAndLevelUp } from "./levelService.js";

/**
 * Завершает подземелье для пользователя, проверяет, что оно завершено,
 * и выдает награды, если они ещё не собраны.
 *
 * @param {string} telegramId - Telegram ID пользователя.
 * @param {string} dungeonId - ID подземелья.
 * @returns {Promise<Object>} - Объект с сообщением, наградами и данными подземелья.
 * @throws {Error} - В случае ошибок (пользователь не найден, подземелье активно и т.п.).
 */
export const completeDungeon  = async (telegramId, dungeonId) => {
  // Находим пользователя
  const user = await User.findOne({ telegramId });
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  // Ищем активное подземелье по ID
  const activeDungeon = user.activeDungeons.find(
    (dungeon) => dungeon.dungeonId.toString() === dungeonId
  );
  if (!activeDungeon) {
    throw new Error("Подземелье не найдено среди активных");
  }

  // Проверяем, что время завершения уже наступило
  if (new Date(activeDungeon.endTime) > new Date()) {
    throw new Error("Подземелье ещё не завершено");
  }

  // Проверяем, что награды присутствуют (золото и опыт)
  if (
    typeof activeDungeon.goldReward === "undefined" ||
    typeof activeDungeon.experienceReward === "undefined"
  ) {
    throw new Error("Награды отсутствуют");
  }

  // Если награды уже собраны, можно вернуть сообщение или выдать ошибку
  // Здесь предполагаем, что флаг isRewardCollected === true означает, что награды ещё не собраны.
  if (!activeDungeon.isRewardCollected) {
    throw new Error("Награды уже собраны");
  }

  // Помечаем награды как собранные
  console.log("Before updating flag, isRewardCollected =", activeDungeon.isRewardCollected);
  activeDungeon.isRewardCollected = false;
  console.log("After updating flag, isRewardCollected =", activeDungeon.isRewardCollected);
  
  const rewards = {
    gold: activeDungeon.goldReward,
    experience: activeDungeon.experienceReward,
  };

  // начисление наград 
  const character = await Character.findOne({telegramId});
  if (!character) {
    throw new Error("пурсонаж не найден для начисления наград");
  }

    // Проверяем, достаточно ли опыта для повышения уровня
  const updatedCharacter = await checkAndLevelUp(character);

  character.gold += activeDungeon.goldReward;
  character.experience += activeDungeon.experienceReward;
  await character.save();

  // Удаляем активное подземелье из массива
  user.activeDungeons = user.activeDungeons.filter(
    (d) => d._id.toString() !== activeDungeon._id.toString()
  );

  
  await user.save();
  
  return {
    message: "Награды собраны",
    rewards: {
      gold: activeDungeon.goldReward,
      experience: activeDungeon.experienceReward,
      cardHero: null,
    },
    updatedCharacter: character,
    dungeon: activeDungeon,
  };
};
