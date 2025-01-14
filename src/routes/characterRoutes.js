import express from 'express';
import { v4 as uuidv4 } from 'uuid'; // Для генерации уникального ID
import Character from '../models/Character.js';

const router = express.Router();

// Создание нового персонажа
router.post('/api/characters', async (req, res) => {
    const { name } = req.body;
    console.log('Запрос на создание персонажа:', req.body);
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const character = new Character({
        _id: uuidv4(), // Генерация уникального ID
        name,
        // Остальные поля будут заполнены значениями по умолчанию
    });

    try {
        await character.save();
        res.status(201).json({ message: 'Character created successfully', character });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
