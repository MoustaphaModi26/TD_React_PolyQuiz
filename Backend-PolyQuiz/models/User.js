const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: [true, "Le pseudonyme est obligatoire"],
      unique: true,
      trim: true,
      minlength: [3, "Le pseudonyme doit contenir au moins 3 caractères"],
      validate: {
        validator: (v) => !/\s/.test(v),
        message: "Le pseudonyme ne doit pas contenir d'espaces",
      },
      set: (v) => v.toLowerCase(),
    },
    bestScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);