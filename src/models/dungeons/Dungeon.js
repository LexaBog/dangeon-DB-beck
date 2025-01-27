import mongoose from 'mongoose';

// Модель данджей. Это только модель, она пустая для заполнения данных
//   делаю файл сreateDangeon там будет наполнение для это ймодели
const dungeonSchema = new mongoose.Schema({
  telegramId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // Название данжа
  level: { type: Number, required: true }, // Уровень данжа
  duration: { type: Number, required: true }, // Длительность прохождения (в секундах)
  experienceReward: { type: Number, required: true }, // Опыт за прохождение
  cardDropChance: { type: Number, default: 0 }, // Шанс выпадения карточки
  goldReward: { type: Number, required: true }, // Количество золота за прохождение
  dungeonId: { type: mongoose.Schema.Types.ObjectId, ref: "Dungeon", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const Dungeon = mongoose.model('Dungeon', dungeonSchema);

export default Dungeon;
