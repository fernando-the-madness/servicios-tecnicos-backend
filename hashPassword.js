import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ email: 'pedro@test.com' });
  if (!user) return console.log('Usuario no encontrado');

  user.password = await bcrypt.hash('123456', 10);
  await user.save();
  console.log('✅ Contraseña hasheada');
  process.exit();
});