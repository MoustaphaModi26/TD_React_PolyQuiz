// App.jsx
// Point d'entrée de l'application React.
// Configure le routeur et applique la sécurisation des routes.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Accueil from "./pages/Accueil";
import QuizEngine from "./pages/QuizEngine";
import Resultats from "./pages/Resultats";
import "./styles/index.css";

function App() {
  return (

    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizEngine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resultats"
            element={
              <ProtectedRoute>
                <Resultats />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
