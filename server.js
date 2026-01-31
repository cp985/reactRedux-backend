const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const connectDB = require('./config/db'); // Commenta per ora

dotenv.config();
// connectDB(); // Commenta per ora

const app = express();

app.use(cors());
app.use(express.json());

// Rotta di test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funziona correttamente su Render!' });
});

// Rotta prodotti mock (senza database)
app.get('/api/products', (req, res) => {
  const mockProducts = [
    { 
      id: 1, 
      name: 'Prodotto 1', 
      price: 29.99, 
      description: 'Descrizione prodotto 1',
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Elettronica'
    },
    { 
      id: 2, 
      name: 'Prodotto 2', 
      price: 49.99,
      description: 'Descrizione prodotto 2', 
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Abbigliamento'
    },
    { 
      id: 3, 
      name: 'Prodotto 3', 
      price: 19.99,
      description: 'Descrizione prodotto 3', 
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Casa'
    }
  ];
  res.json(mockProducts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));