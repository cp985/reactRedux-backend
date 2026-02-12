const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'Il nome è obbligatorio'] 
  },
  cognome: { 
    type: String, 
    required: [true, 'Il cognome è obbligatorio'] 
  },
  email: { 
    type: String, 
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'La password è obbligatoria'],
    minlength: 6
  },
  ruolo: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  telefono: { 
    type: String 
  },
  indirizzo: {
    via: String,
    citta: String,
    cap: String,
    paese: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);