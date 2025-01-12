import express from 'express'

const router = express.Router();

//Тестовый маршрут
router.get('/', (req, res) =>{
    res.send('Сервер работает!');
});

export default router; 