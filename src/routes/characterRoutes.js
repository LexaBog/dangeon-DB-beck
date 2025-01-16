import express from 'express';
import Character from '../models/Character.js';

const router = express.Router();


router.post('/api/characters', async (req, res) => {
    const { telegramId, name } = req.body;
    console.log("Ищем пользователя с telegramId:", telegramId);

    if (!telegramId || !name) {
        return res.status(400).json({ error: 'telegramId and name are required' });
    }
    try {
        // Проверяем, существует ли пользователь с таким telegramId
        const existingCharacter = await Character.findOne({ telegramId });
        if (existingCharacter) {
            return res.status(200).json({
                message: 'Character already exists',
                character: existingCharacter,
            });
        }

        // Создаем нового персонажа
        const character = new Character({
            // _id: uuidv4(),
            telegramId,
            name,
        });

        await character.save();
        res.status(201).json({ message: 'Character created successfully', character });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    console.log("Найденный пользователь:", user);

});

export default router;