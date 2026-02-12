const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per proteggere le routes (utente loggato)
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Controlla se il token è nell'header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Verifica se il token esiste
    if (!token) {
      return res.status(401).json({ 
        message: 'Non autorizzato - Token mancante' 
      });
    }
    
    try {
      // Verifica token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Trova utente dal token (escludi password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Utente non trovato' 
        });
      }
      
      next();
    } catch (error) {
      console.error('Errore verifica token:', error);
      return res.status(401).json({ 
        message: 'Non autorizzato - Token non valido' 
      });
    }
  } catch (error) {
    console.error('Errore middleware protect:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// Middleware per verificare se l'utente è admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.ruolo === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Accesso negato - Solo admin' 
    });
  }
};