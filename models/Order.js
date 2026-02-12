const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'L\'utente è obbligatorio']
  },
  prodotti: [{
    prodottoId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true
    },
    nome: { type: String, required: true },
    quantita: { 
      type: Number, 
      required: true,
      min: 1
    },
    prezzo: { 
      type: Number, 
      required: true 
    }
  }],
  totale: { 
    type: Number, 
    required: true 
  },
  stato: { 
    type: String, 
    enum: ['pending', 'confermato', 'spedito', 'consegnato', 'annullato'],
    default: 'pending' 
  },
  indirizzoSpedizione: {
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    via: { type: String, required: true },
    citta: { type: String, required: true },
    cap: { type: String, required: true },
    paese: { type: String, required: true },
    telefono: { type: String }
  },
  metodoPagamento: {
    type: String,
    enum: ['carta', 'paypal', 'contrassegno'],
    default: 'carta'
  },
  pagato: {
    type: Boolean,
    default: false
  },
  dataPagamento: Date,
  dataSpedizione: Date,
  dataConsegna: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', orderSchema);