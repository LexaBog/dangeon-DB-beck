const PlayerCard = require('../models/PlayerCard');

const generateRandomCard = async (levelRange, images) => {
  const rarities = ['common', 'rare', 'epic', 'legendary'];
  const rarityChances = [50, 30, 15, 5]; // Вероятности выпадения

  const getRarity = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < rarities.length; i++) {
      cumulative += rarityChances[i];
      if (random <= cumulative) return rarities[i];
    }
    return 'common';
  };

  const rarity = getRarity();
  const level = Math.floor(Math.random() * levelRange) + 1;

  const statsCount = {
    common: [1, 2],
    rare: [2, 3],
    epic: [3, 4],
    legendary: [5, 6],
  };

  const numStats = Math.floor(
    Math.random() * (statsCount[rarity][1] - statsCount[rarity][0] + 1)
  ) + statsCount[rarity][0];

  const stats = {};
  const possibleStats = ['strength', 'agility', 'intelligence', 'health', 'mana'];

  for (let i = 0; i < numStats; i++) {
    const stat = possibleStats.splice(Math.floor(Math.random() * possibleStats.length), 1)[0];
    stats[stat] = Math.floor(Math.random() * (level * 5)) + 1;
  }

  const image = images[Math.floor(Math.random() * images.length)];

  const newCard = new PlayerCard({
    name: `Card ${Date.now()}`,
    rarity,
    image,
    level,
    stats,
  });

  await newCard.save();
  return newCard;
};

module.exports = generateRandomCard;
