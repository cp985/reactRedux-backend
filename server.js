require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connetti al database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Porta del tuo frontend (Vite usa 5173)
  origin :'https://cp985.github.io/react-tanstack-shop/',
  credentials: true
}));
app.use(cors());
app.use(express.json());

// Routes (SOLO QUESTE!)
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Route di base
app.get('/', (req, res) => {
  res.json({ message: 'API Backend funzionante!' });
});

// Avvia server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});




