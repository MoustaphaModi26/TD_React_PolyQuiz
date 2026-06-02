// Page d'accueil : formulaire de saisie du pseudonyme avant d'entrer dans le quiz.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Accueil = () => {
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState("");
  const { connecter, meilleurScore } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saisie.trim().length < 2) {
      setErreur("Ton pseudo doit contenir au moins 2 caractères.");
      return;
    }
    connecter(saisie);
    navigate("/quiz");
  };

  return (
    <div className="page-accueil">
      <div className="hero">
        <div className="badge-categories">
          <span className="badge f1">F1</span>
          <span className="badge moto">MotoGP</span>
          <span className="badge nba">NBA</span>
          <span className="badge manga">Manga</span>
        </div>

        <h1 className="titre-principal">
          Poly<span className="accent">Quiz</span>
        </h1>
        <p className="sous-titre">
          La plateforme de compétition intellectuelle.<br />
          10 questions · 60 secondes · Niveau Expert
        </p>

        {meilleurScore > 0 && (
          <div className="meilleur-score-banner">
            Votre meilleur score : <strong>{meilleurScore} / 10</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-login">
          <div className="input-group">
            <label htmlFor="pseudo">Entrez votre pseudonyme pour commencer</label>
            <input
              id="pseudo"
              type="text"
              value={saisie}
              onChange={(e) => {
                setSaisie(e.target.value);
                setErreur("");
              }}
              placeholder="ex : Poly42"
              maxLength={20}
              autoFocus
              autoComplete="off"
            />
            {erreur && <p className="message-erreur">{erreur}</p>}
          </div>
          <button type="submit" className="btn-start">
            Lancer le Quiz
          </button>
        </form>

        <div className="regles">
          <div className="regle">
            <span>60 secondes pour tout répondre</span>
          </div>
          <div className="regle">
            <span>1 point par bonne réponse</span>
          </div>
          <div className="regle">
            <span>Pas de retour en arrière</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
