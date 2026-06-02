// Permet de partager le pseudonyme et le score sans Props Drilling.

import { createContext, useContext, useState } from "react";

// Instanciation du contexte global (valeur par défaut = null)
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // État global : pseudonyme du joueur (null = non connecté)
  const [pseudo, setPseudo] = useState(null);
  // État global : meilleur score enregistré
  const [meilleurScore, setMeilleurScore] = useState(0);

  /**
   * @param {string} nom - Le pseudo saisi par l'utilisateur.
   */
  const connecter = (nom) => {
    setPseudo(nom.trim());
  };

  //Déconnecte l'utilisateur et réinitialise son pseudo.
  const deconnecter = () => {
    setPseudo(null);
  };

  /**
Met à jour le meilleur score si le nouveau score est supérieur.
   * @param {number} score - Le score obtenu à la fin d'une partie.
   */
  const mettreAJourScore = (score) => {
    setMeilleurScore((prev) => Math.max(prev, score));
  };

  // Valeur exposée à tous les consommateurs du contexte
  const valeurContexte = {
    pseudo,
    meilleurScore,
    connecter,
    deconnecter,
    mettreAJourScore,
  };

  return (
    <UserContext.Provider value={valeurContexte}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé à l'intérieur d'un <UserProvider>");
  }
  return context;
};
