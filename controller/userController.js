const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { emailReg, textReg, usernameReg } = require("../util/auth");

// Genera JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Registrazione nuovo utente
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { username, nome, cognome, email, password, telefono } = req.body;

    // Validazione input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Compila tutti i campi obbligatori",
      });
    }

    if (!emailReg(email)) {
      return res.status(400).json({ message: "Email non valida" });
    }
    if (!textReg(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password non valida: almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale (@$!%*?&).",
        });
    }
    if (!usernameReg(username)) {
      return res
        .status(400)
        .json({
          message:
            "Username non valido: 3-20 caratteri, solo lettere, numeri e underscore.",
        });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        message: "Username già in uso",
      });
    }

    // Verifica se email esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email già registrata",
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
      telefono,
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
        ruolo: user.ruolo,
      },
    });
  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({
      message: "Errore del server durante la registrazione",
      error: error.message,
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
        message: "Inserisci email e password",
      });
    }
        if (!emailReg(email)) {
      return res.status(400).json({ message: "Email non valida" });
    }
    if (!textReg(password)) {
      return res.status(400).json({ message: "Password non valida" });
    }

    // Trova utente
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Credenziali non valide",
      });
    }

    // Verifica password con bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Credenziali non valide",
      });
    }

    // Genera token JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
      },
    });
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({
      message: "Errore del server durante il login",
      error: error.message,
    });
  }
};

// @desc    Get profilo utente loggato
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Utente non trovato",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Errore get profile:", error);
    res.status(500).json({
      message: "Errore del server",
      error: error.message,
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
        message: "Utente non trovato",
      });
    }

    // ========== CONTROLLO USERNAME DUPLICATO ==========
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({
        username: req.body.username,
        _id: { $ne: user._id }, // Escludi l'utente corrente
      });

      if (usernameExists) {
        return res.status(400).json({
          message: "Username già in uso da un altro utente",
        });
      }
    }

    // ========== CONTROLLO EMAIL DUPLICATA ==========
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id }, // Escludi l'utente corrente
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email già in uso da un altro utente",
        });
      }
    }

    // ========== AGGIORNA CAMPI ==========
    user.username = req.body.username || user.username;
    user.nome = req.body.nome || user.nome;
    user.cognome = req.body.cognome || user.cognome;
    user.email = req.body.email || user.email;
    user.telefono = req.body.telefono || user.telefono;

    if (req.body.indirizzo) {
      user.indirizzo = req.body.indirizzo;
    }

    // ========== AGGIORNA PASSWORD ==========
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: "La password deve essere di almeno 6 caratteri",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // ========== SALVA MODIFICHE ==========
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profilo aggiornato con successo",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        nome: updatedUser.nome,
        cognome: updatedUser.cognome,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        indirizzo: updatedUser.indirizzo,
        ruolo: updatedUser.ruolo,
      },
    });
  } catch (error) {
    console.error("Errore update profile:", error);

    // Gestione errore unique constraint di MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field === "username" ? "Username" : "Email"} già in uso`,
      });
    }

    res.status(500).json({
      message: "Errore del server",
      error: error.message,
    });
  }
};
// @desc    Get tutti gli utenti (solo admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Errore get all users:", error);
    res.status(500).json({
      message: "Errore del server",
      error: error.message,
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
        message: "Utente non trovato",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "Utente eliminato con successo",
    });
  } catch (error) {
    console.error("Errore delete user:", error);
    res.status(500).json({
      message: "Errore del server",
      error: error.message,
    });
  }
};
