const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//! rotta test
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend funziona correttamente!' });
// });

// app.get('/api/products', (req, res) => {
//   const mockProducts = [
//     { id: 1, name: 'Prodotto 1', price: 29.99, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 2, name: 'Prodotto 2', price: 49.99, imageUrl: 'https://via.placeholder.com/150' },
//     { id: 3, name: 'Prodotto 3', price: 19.99, imageUrl: 'https://via.placeholder.com/150' }
//   ];
//   res.json(mockProducts);
// });

// Routes
app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));