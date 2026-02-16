require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔍 MONGO_URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB connesso con successo');
    
    // Attendi un momento e poi stampa i dettagli
    setTimeout(() => {
      console.log('📍 Database:', mongoose.connection.db?.databaseName || mongoose.connection.name || 'non trovato');
      console.log('🔗 Host:', mongoose.connection.host);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Errore connessione MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;