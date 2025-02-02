import Character from "../models/Character.js";

const calculateRegen = async (character) => {
  const now = new Date();
  const elapsedSeconds = Math.floor((now - character.lastHealthUpdate) / 1000);

  // Базовая скорость регенерации
  let totalRegenRate = character.regenRate;

  // Проверка экипировки
  if (character.equippedItems && character.equippedItems.length > 0) {
    // В будущем тут будет добавляться логика работы с бонусами экипировки
    const equippedItems = await Equipment.find({ _id: { $in: character.equippedItems } });
    equippedItems.forEach((item) => {
      if (item.regenBoost) {
        totalRegenRate += item.regenBoost; // Добавляем бонусы к скорости регенерации
      }
    });
  }

  // Рассчитываем новое здоровье
  const newHealth = Math.min(character.health + elapsedSeconds * totalRegenRate, character.maxHealth);

  // Если здоровье изменилось, сохраняем изменения
  if (newHealth !== character.health) {
    character.health = newHealth;
    character.lastHealthUpdate = now;
    await character.save();
  }

  return character;
};


export const getCharacterWithRegen = async (telegramId) => {
  const character = await Character.findOne({ telegramId });
  if (!character) throw new Error("Персонаж не найден");

  return await calculateRegen(character);
};

export default calculateRegen;
