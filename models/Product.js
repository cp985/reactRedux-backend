const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'Il nome del prodotto è obbligatorio'],
    trim: true
  },
  descrizione: { 
    type: String,
    required: [true, 'La descrizione è obbligatoria']
  },
  prezzo: { 
    type: Number, 
    required: [true, 'Il prezzo è obbligatorio'],
    min: 0
  },
  categoria: { 
    type: String,
    required: true
  },
  immagine: { 
    type: String,
    default: '/images/default-product.jpg'
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  disponibile: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numeroRecensioni: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Product', productSchema);