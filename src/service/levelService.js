// src/service/levelService.js
import Character from "../models/Character.js";

/**
 * Функция для вычисления требуемого опыта для следующего уровня
 * по заданным правилам:
 * - Для уровней 1–10: требуемый опыт = уровень * 1000.
 * - Для уровней 11–50: прирост опыта увеличивается на 1000 за уровень
 *   с множителем 1.30 для каждого следующего уровня.
 * - Для уровней 51–90: прирост умножается на 1.40.
 * - Для уровней 91+ : прирост умножается на 1.50.
 *
 * @param {number} currentLevel - текущий уровень персонажа.
 * @param {number} currentXP - текущий накопленный опыт (оставшийся после повышения уровня).
 * @returns {number} Требуемый опыт для повышения уровня.
 */
export const getNextLevelXPRequirement = (currentLevel, currentXP) => {
  // Если уровень 1–10, требуемый опыт = level * 1000
  if (currentLevel < 10) {
    return currentLevel * 1000 - currentXP;
  }
  
  let requiredXP = 1000; // базовый прирост
  // Для уровней 2-10 прирост фиксированный, но если у вас уже достигнут уровень 10,
  // общий опыт до уровня 10 будет равен 10,000. Мы начнем расчёт с уровня 10.
  let xpForLevel10 = 10000;
  if (currentLevel === 10) {
    // Требуется опыт для повышения с 10-го на 11-й уровень:
    requiredXP = 1000 * 1.30; 
    return requiredXP - currentXP;
  }
  
  // Если уровень больше 10, начнем с уровня 10.
  let nextXPIncrement = 1000 * 1.30; // прирост для перехода с 10 на 11
  let nextLevelXP = xpForLevel10 + nextXPIncrement; // XP до 11 уровня
  
  // Для уровней 11-50: множитель 1.30
  for (let lvl = 11; lvl < Math.min(currentLevel, 50); lvl++) {
    nextXPIncrement *= 1.30;
    nextLevelXP += nextXPIncrement;
  }
  
  // Если текущий уровень до 50, требуемый опыт для следующего уровня:
  if (currentLevel < 50) {
    // Если у персонажа уже накоплено некоторое XP сверх уровня (остался опыт после повышения),
    // то требуемый опыт для следующего уровня = (nextLevelXP - общий XP до текущего уровня)
    // Здесь упрощенно: возвращаем разницу между XP для следующего уровня и уже набранным опытом (currentXP в "остатке")
    return nextXPIncrement - currentXP;
  }
  
  // Для уровней 51-90: множитель 1.40
  if (currentLevel >= 50 && currentLevel < 90) {
    // Пусть для перехода с 50 на 51 XPIncrement уже вычислен на последней итерации предыдущего цикла.
    for (let lvl = 50; lvl < currentLevel; lvl++) {
      nextXPIncrement *= 1.40;
      nextLevelXP += nextXPIncrement;
    }
    return nextXPIncrement - currentXP;
  }
  
  // Для уровней 91+ : множитель 1.50
  if (currentLevel >= 90) {
    for (let lvl = 90; lvl < currentLevel; lvl++) {
      nextXPIncrement *= 1.50;
      nextLevelXP += nextXPIncrement;
    }
    return nextXPIncrement - currentXP;
  }
  
  // Если по какой-то причине не попали ни в один случай
  return nextXPIncrement - currentXP;
};

/**
 * Функция проверки и повышения уровня персонажа.
 * Если у персонажа накоплено достаточно опыта, он повышается на один или несколько уровней.
 *
 * @param {Object} character - Документ персонажа (mongoose document)
 * @returns {Promise<Object>} - Обновлённый персонаж
 */
export const checkAndLevelUp = async (character) => {
  let leveledUp = false;
  // Предположим, что currentXP – это оставшийся опыт, накопленный для следующего уровня.
  // Если у вас XP хранится как общее значение, то можно сначала вычислить общий XP для текущего уровня.
  // Здесь для простоты считаем, что experience – это XP, накопленный для повышения уровня.
  while (true) {
    const xpNeeded = getNextLevelXPRequirement(character.level, 0); // требуемый прирост для следующего уровня без учета текущего "остатка"
    if (character.experience >= xpNeeded) {
      character.experience -= xpNeeded;
      character.level += 1;
      // Можно увеличить максимальное здоровье, силу и т.п.
      character.maxHealth += 10; // пример бонуса
      character.maxMana += 10;
      character.points += 5;
      leveledUp = true;
    } else {
      break;
    }
  }

  if (leveledUp) {
    await character.save();
  }
  return character;
};
