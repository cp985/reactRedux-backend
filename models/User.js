const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, 'Lo username è obbligatorio'],
    unique: true,
    trim: true
  },
  nome: { 
    type: String, 
  },
  cognome: { 
    type: String, 
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
  }

},{
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);