require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seedBasicUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connesso a MongoDB');
    
    // Genera le password hashate
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('admin123', 10);
    
    const basicUsers = [
      {
        nome: "Mario",
        cognome: "Rossi",
        email: "mario@test.com",
        password: hashedPassword1,
        ruolo: "user",
        createdAt: new Date(),
      },
      {
        nome: "Admin",
        cognome: "Admin",
        email: "admin@test.com",
        password: hashedPassword2,
        ruolo: "admin",
        createdAt: new Date(),
      }
    ];
    
    await User.insertMany(basicUsers);
    
    console.log('✅ Utenti inseriti con successo!');
    console.log('📧 mario@test.com - password: password123');
    console.log('📧 admin@test.com - password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error);
    process.exit(1);
  }
};

seedBasicUsers();