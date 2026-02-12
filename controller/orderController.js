const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Crea nuovo ordine
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { prodotti, indirizzoSpedizione, metodoPagamento } = req.body;
    
    // Validazione
    if (!prodotti || prodotti.length === 0) {
      return res.status(400).json({ 
        message: 'Nessun prodotto nell\'ordine' 
      });
    }
    
    if (!indirizzoSpedizione) {
      return res.status(400).json({ 
        message: 'Indirizzo di spedizione mancante' 
      });
    }
    
    // Calcola totale e verifica disponibilità
    let totale = 0;
    const prodottiOrdine = [];
    
    for (let item of prodotti) {
      const prodotto = await Product.findById(item.prodottoId);
      
      if (!prodotto) {
        return res.status(404).json({ 
          message: `Prodotto ${item.prodottoId} non trovato` 
        });
      }
      
      if (prodotto.stock < item.quantita) {
        return res.status(400).json({ 
          message: `Stock insufficiente per ${prodotto.nome}` 
        });
      }
      
      prodottiOrdine.push({
        prodottoId: prodotto._id,
        nome: prodotto.nome,
        quantita: item.quantita,
        prezzo: prodotto.prezzo
      });
      
      totale += prodotto.prezzo * item.quantita;
      
      // Aggiorna stock
      prodotto.stock -= item.quantita;
      await prodotto.save();
    }
    
    // Crea ordine
    const order = await Order.create({
      userId: req.user.id,
      prodotti: prodottiOrdine,
      totale,
      indirizzoSpedizione,
      metodoPagamento: metodoPagamento || 'carta'
    });
    
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Errore creazione ordine:', error);
    res.status(500).json({ 
      message: 'Errore del server durante la creazione dell\'ordine',
      error: error.message 
    });
  }
};

// @desc    Get ordini dell'utente loggato
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('prodotti.prodottoId', 'nome immagine')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Errore get my orders:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Get ordine specifico per ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'nome cognome email')
      .populate('prodotti.prodottoId', 'nome immagine');
    
    if (!order) {
      return res.status(404).json({ 
        message: 'Ordine non trovato' 
      });
    }
    
    // Verifica che l'utente sia proprietario o admin
    if (order.userId._id.toString() !== req.user.id && req.user.ruolo !== 'admin') {
      return res.status(403).json({ 
        message: 'Non autorizzato a visualizzare questo ordine' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Errore get order by id:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Get tutti gli ordini (solo admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'nome cognome email')
      .populate('prodotti.prodottoId', 'nome immagine')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Errore get all orders:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Aggiorna stato ordine
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { stato } = req.body;
    
    if (!stato) {
      return res.status(400).json({ 
        message: 'Stato mancante' 
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        message: 'Ordine non trovato' 
      });
    }
    
    order.stato = stato;
    
    // Aggiorna date in base allo stato
    if (stato === 'spedito' && !order.dataSpedizione) {
      order.dataSpedizione = Date.now();
    }
    
    if (stato === 'consegnato' && !order.dataConsegna) {
      order.dataConsegna = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Errore update order status:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Aggiorna pagamento ordine
// @route   PATCH /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        message: 'Ordine non trovato' 
      });
    }
    
    order.pagato = true;
    order.dataPagamento = Date.now();
    order.stato = 'confermato';
    
    const updatedOrder = await order.save();
    
    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Errore update order to paid:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Cancella ordine
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        message: 'Ordine non trovato' 
      });
    }
    
    // Ripristina stock prodotti
    for (let item of order.prodotti) {
      const prodotto = await Product.findById(item.prodottoId);
      if (prodotto) {
        prodotto.stock += item.quantita;
        await prodotto.save();
      }
    }
    
    await order.deleteOne();
    
    res.json({
      success: true,
      message: 'Ordine eliminato con successo'
    });
  } catch (error) {
    console.error('Errore delete order:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};