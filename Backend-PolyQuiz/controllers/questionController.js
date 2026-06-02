const Question = require("../models/Question");

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}, { __v: 0 });

    if (!questions.length) {
      return res.status(404).json({ message: "Aucune question trouvée" });
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error("Erreur getQuestions :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = { getQuestions };