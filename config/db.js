const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI non definita nelle variabili d\'ambiente di Render');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connesso con successo');
  } catch (error) {
    console.error('❌ Errore connessione MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;