const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Genera JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

// @desc    Registrazione nuovo utente
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { username, nome, cognome, email, password, telefono } = req.body;
    
    // Validazione input
    if (!username||!email || !password) {
      return res.status(400).json({ 
        message: 'Compila tutti i campi obbligatori' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La password deve essere di almeno 6 caratteri' 
      });
    }
    
    // Verifica se utente esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Email già registrata' 
      });
    }
    
    // Hash password con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crea utente
    const user = await User.create({
      username,
      nome,
      cognome,
      email,
      password: hashedPassword,
      telefono
    });
    
    // Genera token JWT
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo
      }
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ 
      message: 'Errore del server durante la registrazione',
      error: error.message 
    });
  }
};

// @desc    Login utente
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validazione input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Inserisci email e password' 
      });
    }
    
    // Trova utente
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenziali non valide' 
      });
    }
    
    // Verifica password con bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: 'Credenziali non valide' 
      });
    }
    
    // Genera token JWT
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo
      }
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ 
      message: 'Errore del server durante il login',
      error: error.message 
    });
  }
};

// @desc    Get profilo utente loggato
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Utente non trovato' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Errore get profile:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Aggiorna profilo utente
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Utente non trovato' 
      });
    }
    
    // Aggiorna campi
    user.nome = req.body.nome || user.nome;
    user.cognome = req.body.cognome || user.cognome;
    user.email = req.body.email || user.email;
    user.telefono = req.body.telefono || user.telefono;
    
    if (req.body.indirizzo) {
      user.indirizzo = req.body.indirizzo;
    }
    
    // Se viene inviata una nuova password
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ 
          message: 'La password deve essere di almeno 6 caratteri' 
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        nome: updatedUser.nome,
        cognome: updatedUser.cognome,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        indirizzo: updatedUser.indirizzo,
        ruolo: updatedUser.ruolo
      }
    });
  } catch (error) {
    console.error('Errore update profile:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Get tutti gli utenti (solo admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Errore get all users:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};

// @desc    Elimina utente (solo admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Utente non trovato' 
      });
    }
    
    await user.deleteOne();
    
    res.json({
      success: true,
      message: 'Utente eliminato con successo'
    });
  } catch (error) {
    console.error('Errore delete user:', error);
    res.status(500).json({ 
      message: 'Errore del server',
      error: error.message 
    });
  }
};