import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true }, // Уникальный Telegram ID
    username: { type: String, required: true },
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }, // Связь с персонажем
    currentDungeon: {
      dungeonId: { type: mongoose.Schema.Types.ObjectId, ref: "Dungeon" },
      startTime: { type: Date },
      duration: { type: Number },
    },
    activeDungeons: [
      {
        dungeonId: { type: mongoose.Schema.Types.ObjectId, ref: "Dungeon", required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true } // Добавляем дату создания и обновления
);

const User = mongoose.model("User", userSchema);

export default User;
