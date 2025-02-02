import mongoose from "mongoose"

const characterCreation = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gold: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    points: { type: Number, default: 0 }, // Поле из HEAD
    maxHealth: { type: Number, default: 100 },
    health: { type: Number, default: 100 },
    regenRate: { type: Number, default: 1 }, // Скорость регенерации (ХП/сек)
    maxMana: { type: Number, default: 20 },
    mana: { type: Number, default: 20 },
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    baseArmor: { type: Number, default: 0 },
    baseEvasion: { type: Number, default: 0 },
    baseAttack: { type: Number, default: 5 },
    equippedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], 
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], 
    lastHealthUpdate: { type: Date, default: Date.now }, 
  }, { timestamps: true });
  
  const Character = mongoose.model('Character', characterCreation);
  
export default Character;
  