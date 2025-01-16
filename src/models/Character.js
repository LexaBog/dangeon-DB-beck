import mongoose from "mongoose"

const characterCreation = new mongoose.Schema ({
    telegramId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    health: { type: Number, default: 10 },
    mana: {type: Number, default: 0},
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    baseArmor: { type: Number, default: 0 },
    baseEvasion: { type: Number, default: 0 },
    baseAttack: { type: Number, default: 5 },
    equippedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], // Надетые предметы
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }], // Инвентарь
}, { timestamps: true });

const Character = mongoose.model('Character', characterCreation);

export default Character;