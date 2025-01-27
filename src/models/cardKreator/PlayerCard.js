const mongoose = require('mongoose');

const playerCardSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Название карты
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], required: true }, // Рарность
  image: { type: String, required: true }, // Ссылка на изображение
  level: { type: Number, required: true }, // Уровень карты
  stats: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    mana: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const PlayerCard = mongoose.model('PlayerCard', playerCardSchema);

module.exports = PlayerCard;
