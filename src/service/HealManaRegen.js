import Character from "../models/Character.js";

export const getCharacterWithRegen = async (character) => {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - character.lastHealthUpdate) / 1000);
  
    const healthRegenRate = 1;
    const manaRegenRate = 1;
  
    const newHealth = Math.min(character.health + elapsedSeconds * healthRegenRate, character.maxHealth);
    const newMana = Math.min(character.mana + elapsedSeconds * manaRegenRate, character.maxMana);
  
    if (newHealth !== character.health || newMana !== character.mana) {
      character.health = newHealth;
      character.mana = newMana;
      character.lastHealthUpdate = now;
      await character.save();
    }
  
    // Возвращаем только обновленные поля
    return {
      health: character.health,
      mana: character.mana,
      lastHealthUpdate: character.lastHealthUpdate,
    };
  };
  

export default getCharacterWithRegen
