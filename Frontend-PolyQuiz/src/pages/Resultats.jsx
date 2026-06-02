import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Resultats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pseudo, meilleurScore, deconnecter } = useUser();

  // Récupération des données de jeu passées via navigate() state
  const { score = 0, total = 10, reponses = [], questions = [] } =
    location.state || {};

  // État pour la démo du useMemo (changement de thème)
  const [themeSombre, setThemeSombre] = useState(false);

  const statistiques = useMemo(() => {
    console.log("useMemo : calcul des statistiques exécuté");

    const ratio = total > 0 ? (score / total) * 100 : 0;
    const mention =
      ratio >= 80 ? "Excellent ! "
      : ratio >= 60 ? "Bien joué ! "
      : ratio >= 40 ? "Passable "
      : "À retravailler ";

    const bonnesReponses = reponses.filter((r) => r.correcte).length;
    const mauvaisesReponses = reponses.filter((r) => !r.correcte).length;
    const nonRepondues = total - reponses.length;

    return { ratio: Math.round(ratio), mention, bonnesReponses, mauvaisesReponses, nonRepondues };
  }, [score, total, reponses]);

  const handleRejouer = () => {
    navigate("/quiz");
  };

  const handleDeconnexion = () => {
    deconnecter();
    navigate("/");
  };

  return (
    <div className={`page-resultats ${themeSombre ? "theme-sombre" : ""}`}>
      {/* Bouton thème : démontre que useMemo ne recalcule pas */}
      <button
        className="btn-theme"
        onClick={() => setThemeSombre((t) => !t)}
        title="Changer le thème (le useMemo ne recalcule pas !)"
      >
        {themeSombre ? "Clair" : "Sombre"}
      </button>

      <div className="resultats-carte">
        {/* En-tête */}
        <div className="resultats-header">
          <h1 className="titre-resultats">Résultats de la partie</h1>
          <p className="pseudo-joueur">Joueur : <strong>{pseudo}</strong></p>
        </div>

        {/* Score principal */}
        <div className="score-principal">
          <div className="cercle-score">
            <span className="score-valeur">{score}</span>
            <span className="score-total">/{total}</span>
          </div>
          <p className="mention">{statistiques.mention}</p>
          <p className="ratio-label">
            Ratio de réussite : <strong>{statistiques.ratio}%</strong>
          </p>
        </div>

        {/* Statistiques détaillées (calculées par useMemo) */}
        <div className="stats-grille">
          <div className="stat-card correct">
            <span className="stat-valeur">{statistiques.bonnesReponses}</span>
            <span className="stat-label">Correctes</span>
          </div>
          <div className="stat-card incorrect">
            <span className="stat-valeur">{statistiques.mauvaisesReponses}</span>
            <span className="stat-label">Incorrectes</span>
          </div>
          <div className="stat-card non-repondu">
            <span className="stat-valeur">{statistiques.nonRepondues}</span>
            <span className="stat-label">Non répondues</span>
          </div>
        </div>

        {/* Meilleur score (depuis le contexte global) */}
        {meilleurScore > 0 && (
          <div className="meilleur-score-result">
            Meilleur score : <strong>{meilleurScore} / {total}</strong>
          </div>
        )}

        {/* Récapitulatif des réponses */}
        {questions.length > 0 && (
          <div className="recapitulatif">
            <h3>Récapitulatif</h3>
            <ul className="liste-reponses">
              {questions.map((q, i) => {
                const reponseJoueur = reponses.find((r) => r.questionId === q.id);
                const estCorrecte = reponseJoueur?.correcte;
                const nonRepondu = !reponseJoueur;

                return (
                  <li key={q.id} className={`item-reponse ${estCorrecte ? "ok" : nonRepondu ? "skip" : "ko"}`}>
                    <span className="q-num">Q{i + 1}</span>
                    <span className="q-texte">{q.libelle}</span>
                    <span className="q-statut">
                      {nonRepondu ? "" : estCorrecte ? "" : ` ${q.bonne_reponse}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="actions-resultats">
          <button className="btn-rejouer" onClick={handleRejouer}>
            Rejouer
          </button>
          <button className="btn-deconnexion" onClick={handleDeconnexion}>
            Changer de joueur
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resultats;
