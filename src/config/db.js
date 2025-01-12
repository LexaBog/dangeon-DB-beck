import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Добавьте эту строку

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Завершаем процесс с ошибкой
    }
};

export default connectDB;
