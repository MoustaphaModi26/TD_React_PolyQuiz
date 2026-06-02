// Bloque l'accès aux routes /quiz et /resultats si l'utilisateur n'a pas de pseudo.

import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * @param {{ children: React.ReactNode }} props
 */
const ProtectedRoute = ({ children }) => {
  const { pseudo } = useUser();

  // Vérification : l'utilisateur est-il "authentifié"
  if (!pseudo) {
    // Redirection immédiate vers la page d'accueil/login
    // replace=true évite d'ajouter une entrée supplémentaire dans l'historique
    return <Navigate to="/" replace />;
  }

  // L'utilisateur est authentifié : on rend le contenu protégé
  return children;
};

export default ProtectedRoute;
