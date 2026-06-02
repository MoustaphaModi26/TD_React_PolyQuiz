const mongoose = require("mongoose");
const Question = require("./models/Question");
require("dotenv").config();

const questions = [
  {
    category: "F1",
    text: "Quel pilote a remporté le plus de championnats du monde de F1 ?",
    options: ["Michael Schumacher", "Lewis Hamilton", "Ayrton Senna", "Sebastian Vettel"],
    correctAnswer: "Lewis Hamilton",
  },
  {
    category: "F1",
    text: "Quelle écurie domine la F1 depuis 2014 ?",
    options: ["Ferrari", "Red Bull", "Mercedes", "McLaren"],
    correctAnswer: "Mercedes",
  },
  {
    category: "F1",
    text: "Sur quel circuit se déroule le Grand Prix de Monaco ?",
    options: ["Circuit de la Sarthe", "Circuit de Monte-Carlo", "Silverstone", "Monza"],
    correctAnswer: "Circuit de Monte-Carlo",
  },
  {
    category: "MotoGP",
    text: "Qui est surnommé 'Il Dottore' en MotoGP ?",
    options: ["Marc Márquez", "Valentino Rossi", "Jorge Lorenzo", "Casey Stoner"],
    correctAnswer: "Valentino Rossi",
  },
  {
    category: "MotoGP",
    text: "Combien de titres mondiaux Valentino Rossi a-t-il remportés ?",
    options: ["7", "8", "9", "6"],
    correctAnswer: "9",
  },
  {
    category: "MotoGP",
    text: "Quelle nationalité est Marc Márquez ?",
    options: ["Italienne", "Française", "Espagnole", "Portugaise"],
    correctAnswer: "Espagnole",
  },
  {
    category: "NBA",
    text: "Quel joueur est surnommé 'The Goat' par ses fans ?",
    options: ["Kobe Bryant", "LeBron James", "Michael Jordan", "Shaquille O'Neal"],
    correctAnswer: "Michael Jordan",
  },
  {
    category: "NBA",
    text: "Quelle franchise NBA a le plus de titres ?",
    options: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
    correctAnswer: "Boston Celtics",
  },
  {
    category: "Manga",
    text: "Quel est l'auteur de Dragon Ball ?",
    options: ["Eiichiro Oda", "Masashi Kishimoto", "Akira Toriyama", "Tite Kubo"],
    correctAnswer: "Akira Toriyama",
  },
  {
    category: "Manga",
    text: "Dans One Piece, quel est le rêve de Monkey D. Luffy ?",
    options: ["Devenir le plus fort", "Trouver le One Piece", "Sauver son frère", "Explorer le monde"],
    correctAnswer: "Trouver le One Piece",
  },
  {
    category: "Anime",
    text: "Dans Naruto, quel est le nom du renard à neuf queues ?",
    options: ["Shukaku", "Kurama", "Gyuki", "Matatabi"],
    correctAnswer: "Kurama",
  },
  {
    category: "Anime",
    text: "Quel studio a produit l'anime 'Demon Slayer' ?",
    options: ["Bones", "Madhouse", "Ufotable", "Mappa"],
    correctAnswer: "Ufotable",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté");

    await Question.deleteMany();
    console.log("  Collection questions purgée");

    await Question.insertMany(questions);
    console.log(`${questions.length} questions insérées avec succès`);

    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seeding :", err.message);
    process.exit(1);
  }
}

seed();