const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
    },
    text: {
      type: String,
      required: [true, "Le texte de la question est obligatoire"],
    },
    options: {
      type: [String],
      validate: {
        validator: (v) => v.length >= 2 && v.length <= 4,
        message: "Une question doit avoir entre 2 et 4 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "La bonne réponse est obligatoire"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);