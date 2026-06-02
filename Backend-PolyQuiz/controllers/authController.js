const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { pseudo } = req.body;

    if (!pseudo || pseudo.trim() === "") {
      return res.status(400).json({ message: "Le pseudonyme est obligatoire" });
    }

    const pseudoNettoye = pseudo.trim().toLowerCase();

    // Cherche l'utilisateur ou le crée s'il n'existe pas
    let user = await User.findOne({ pseudo: pseudoNettoye });

    if (!user) {
      user = await User.create({ pseudo: pseudoNettoye, bestScore: 0 });
      console.log(`👤 Nouvel utilisateur créé : ${pseudoNettoye}`);
    } else {
      console.log(`👤 Utilisateur existant connecté : ${pseudoNettoye}`);
    }

    // Génère le token JWT (valide 2 heures)
    const token = jwt.sign(
      { _id: user._id, pseudo: user.pseudo },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        pseudo: user.pseudo,
        bestScore: user.bestScore,
      },
    });
  } catch (err) {
    console.error("Erreur login :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = { login };