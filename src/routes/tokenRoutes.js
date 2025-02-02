// import express from 'express';
// import jwt from 'jsonwebtoken';

// const router = express.Router();
// const SECRET_KEY = 'b4a97c8f43a1b761d7f9a865fae72c8b414a3e5371b65fdf4398f56a6e8a4562'; // Замените на ваш секретный ключ

// // Эндпоинт для валидации токена
// router.post('/api/validate-token', (req, res) => {
//     console.log(req.body)
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ valid: false, error: 'Token is required' });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     res.status(200).json({ valid: true, data: decoded });
//   } catch (err) {
//     res.status(401).json({ valid: false, error: 'Invalid token' });
//   }
// });

// export default router;
