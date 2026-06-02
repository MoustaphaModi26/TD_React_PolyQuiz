// Gère l'intégralité de la logique du quiz via un reducer pur

export const etatInitial = {
  statut: "idle",          // "idle" | "en_cours" | "termine"
  questions: [],           // Tableau des questions chargées depuis l'API
  indexCourant: 0,         // Index de la question affichée
  reponsesSelectionnees: [],// Tableau des réponses choisies par l'utilisateur
  score: 0,                // Score temporaire calculé au fur et à mesure
};

/**
 * @param {typeof etatInitial} state - L'état courant
 * @param {{ type: string, payload?: any }} action - L'action dispatchée
 * @returns {typeof etatInitial} Le nouvel état
 */
const quizReducer = (state, action) => {
  switch (action.type) {

    // START_QUIZ : Initialise la partie avec les questions récupérées.
    case "START_QUIZ":
      return {
        ...etatInitial,
        statut: "en_cours",
        questions: action.payload,
        indexCourant: 0,
        reponsesSelectionnees: [],
        score: 0,
      };
    // ANSWER_QUESTION : Enregistre la réponse, calcule si elle est
    // correcte, incrémente le score, puis avance à la question suivante.
    // Si c'était la dernière question  passe en statut "termine".
    case "ANSWER_QUESTION": {
      const questionCourante = state.questions[state.indexCourant];
      const reponseChoisie = action.payload;

      // Vérification de la correction de la réponse
      const estCorrecte = reponseChoisie === questionCourante.bonne_reponse;

      // Nouveau tableau des réponses avec la réponse actuelle ajoutée
      const nouvellesReponses = [
        ...state.reponsesSelectionnees,
        {
          questionId: questionCourante.id,
          reponse: reponseChoisie,
          correcte: estCorrecte,
        },
      ];

      // Nouveau score : incrémenté si la réponse est correcte
      const nouveauScore = estCorrecte ? state.score + 1 : state.score;

      // Calcul du prochain index
      const prochainIndex = state.indexCourant + 1;
      const estDerniere = prochainIndex >= state.questions.length;

      return {
        ...state,
        reponsesSelectionnees: nouvellesReponses,
        score: nouveauScore,
        // Si c'était la dernière question, on termine. Sinon on avance.
        indexCourant: estDerniere ? state.indexCourant : prochainIndex,
        statut: estDerniere ? "termine" : "en_cours",
      };
    }

    // FINISH_QUIZ : Force la fin du quiz (ex: chronomètre à zéro).
    case "FINISH_QUIZ":
      return {
        ...state,
        statut: "termine",
      };

    // Action inconnue : on retourne l'état sans modification
    default:
      return state;
  }
};

export default quizReducer;
