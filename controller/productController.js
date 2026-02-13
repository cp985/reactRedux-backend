const Product = require('../models/Product');

// @desc    Get tutti i prodotti
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Errore get all products:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Get prodotto singolo per ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Prodotto non trovato' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Errore get product by id:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Crea nuovo prodotto
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { nome, descrizione, prezzo, categoria, immagine, stock, rarità, classe } = req.body;
    
    // Validazione
    if (!nome || !descrizione || !prezzo || !categoria) {
      return res.status(400).json({ 
        message: 'Compila tutti i campi obbligatori' 
      });
    }
    
    const product = await Product.create({
      nome,
      descrizione,
      prezzo,
      categoria,
      immagine,
      stock: stock || 0,
      rarità,
      classe
    });
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Errore create product:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Aggiorna prodotto
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Prodotto non trovato' 
      });
    }
    
    // Aggiorna campi
    product.nome = req.body.nome || product.nome;
    product.descrizione = req.body.descrizione || product.descrizione;
    product.prezzo = req.body.prezzo !== undefined ? req.body.prezzo : product.prezzo;
    product.categoria = req.body.categoria || product.categoria;
    product.immagine = req.body.immagine || product.immagine;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.disponibile = req.body.disponibile !== undefined ? req.body.disponibile : product.disponibile;
    product.rarità = req.body.rarità || product.rarità;
    product.classe = req.body.classe || product.classe;
    
    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Errore update product:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Elimina prodotto
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Prodotto non trovato' 
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Prodotto eliminato con successo'
    });
  } catch (error) {
    console.error('Errore delete product:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Get prodotti per categoria
// @route   GET /api/products/category/:categoria
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      categoria: req.params.categoria 
    });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Errore get products by category:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};