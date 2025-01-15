import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true }, // Уникальный Telegram ID
    username: { type: String, required: true },
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }, // Связь с персонажем
  },
  { timestamps: true } // Добавляем дату создания и обновления
);

const User = mongoose.model("User", userSchema);

export default User;
