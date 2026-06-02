import { useEffect, useRef, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import quizReducer, { etatInitial } from "../reducers/quizReducer";

const COULEURS_CATEGORIES = {
  "F1": "#e63946",
  "MotoGP": "#f4a261",
  "NBA": "#457b9d",
  "Manga/Anime": "#6d597a",
};

const QuizEngine = () => {

  const { data: questions, loading, error } = useFetch("/questions.json");

  const [etat, dispatch] = useReducer(quizReducer, etatInitial);

  const intervalRef = useRef(null);

  const tempsRef = useRef(60);
  const [tempsAffiche, setTempsAffiche] = useState(60);

  const { mettreAJourScore } = useUser();
  const navigate = useNavigate();


  // Démarre le quiz dès que les questions sont disponibles
  useEffect(() => {
    if (questions && questions.length > 0 && etat.statut === "idle") {
      dispatch({ type: "START_QUIZ", payload: questions });
    }
  }, [questions, etat.statut]);

  useEffect(() => {
    if (etat.statut !== "en_cours") return;

    // Réinitialisation à chaque démarrage de partie
    tempsRef.current = 60;
    setTempsAffiche(60);

    intervalRef.current = setInterval(() => {
      tempsRef.current -= 1;
      setTempsAffiche(tempsRef.current);

      if (tempsRef.current <= 0) {
        clearInterval(intervalRef.current);
        dispatch({ type: "FINISH_QUIZ" });
      }
    }, 1000);

    // Fonction de nettoyage (Cleanup) : évite les fuites mémoire
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [etat.statut]);


  // Redirection vers /resultats quand le quiz se termine
  useEffect(() => {
    if (etat.statut === "termine") {
      clearInterval(intervalRef.current);
      mettreAJourScore(etat.score);
      navigate("/resultats", {
        state: {
          score: etat.score,
          total: etat.questions.length,
          reponses: etat.reponsesSelectionnees,
          questions: etat.questions,
        },
      });
    }
  }, [etat.statut]);

  const handleReponse = (option) => {
    if (etat.statut !== "en_cours") return;
    dispatch({ type: "ANSWER_QUESTION", payload: option });
  };

  if (loading) {
    return (
      <div className="page-quiz etat-chargement">
        <div className="spinner" />
        <p>Chargement des questions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-quiz etat-erreur">
        <p> Erreur de chargement : {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (etat.statut === "idle" || !etat.questions.length) {
    return <div className="page-quiz"><p>Préparation du quiz…</p></div>;
  }

  const questionCourante = etat.questions[etat.indexCourant];
  const progression = (etat.indexCourant / etat.questions.length) * 100;
  const couleurTemps =
    tempsAffiche <= 10 ? "danger" :
    tempsAffiche <= 20 ? "warning" :
    "normal";

  return (
    <div className="page-quiz">
      {/* En-tête : progression, chronomètre, score live */}
      <header className="quiz-header">
        <div className="progression-info">
          <span className="label-progression">Question</span>
          <span className="numero-question">
            {etat.indexCourant + 1}
            <span className="total"> / {etat.questions.length}</span>
          </span>
        </div>

        <div className={`chronometre chrono-${couleurTemps}`}>
          <span className="chrono-valeur">{tempsAffiche}s</span>
        </div>

        <div className="score-live">
          <span className="label-score">Score</span>
          <span className="valeur-score">{etat.score}</span>
        </div>
      </header>

      {/* Barre de progression */}
      <div className="barre-progression">
        <div className="barre-fill" style={{ width: `${progression}%` }} />
      </div>

      {/* Corps : question et options */}
      <main className="quiz-body">
        <div
          className="badge-categorie"
          style={{ backgroundColor: COULEURS_CATEGORIES[questionCourante.categorie] || "#555" }}
        >
          {questionCourante.categorie}
        </div>

        <h2 className="libelle-question">{questionCourante.libelle}</h2>

        <div className="grille-options">
          {questionCourante.options.map((option, index) => (
            <button
              key={option}
              className="btn-option"
              onClick={() => handleReponse(option)}
            >
              <span className="option-lettre">
                {["A", "B", "C", "D"][index]}
              </span>
              <span className="option-texte">{option}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuizEngine;
