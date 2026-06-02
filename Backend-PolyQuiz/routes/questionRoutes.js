const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionController");

// Route publique
router.get("/", getQuestions);

module.exports = router;