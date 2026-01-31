const Product = require('../models/Product');

// GET tutti i prodotti
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET prodotto singolo
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};