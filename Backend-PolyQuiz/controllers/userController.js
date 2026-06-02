const User = require("../models/User");

const updateScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user._id;

    if (score === undefined || score === null) {
      return res.status(400).json({ message: "Le score est obligatoire" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Met à jour uniquement si le nouveau score est strictement supérieur
    if (score > user.bestScore) {
      user.bestScore = score;
      await user.save();
      console.log(`🏆 Nouveau record pour ${user.pseudo} : ${score}`);
      return res.status(200).json({
        message: "Nouveau record enregistré !",
        bestScore: user.bestScore,
      });
    }

    res.status(200).json({
      message: "Score inférieur au record actuel, non mis à jour",
      bestScore: user.bestScore,
    });
  } catch (err) {
    console.error("Erreur updateScore :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find(
      {},
      { pseudo: 1, bestScore: 1, _id: 0 }
    )
      .sort({ bestScore: -1 })
      .limit(10);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Erreur getLeaderboard :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = { updateScore, getLeaderboard };