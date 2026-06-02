# PolyQuiz — Plateforme Interactive de Quiz
**TD React N°2**

## Structure du projet

'''
polyquiz/
├── public/
│   └── questions.json          # Données statiques (API simulée)
├── src/
│   ├── hooks/
│   │   └── useFetch.js         # Custom Hook réseau
│   ├── context/
│   │   └── UserContext.jsx     # API Context (bus de données)
│   ├── components/
│   │   └── ProtectedRoute.jsx  # Sécurisation des routes
│   ├── reducers/
│   │   └── quizReducer.js      # Machine à état (useReducer)
│   ├── pages/
│   │   ├── Accueil.jsx         # Route "/" — Login
│   │   ├── QuizEngine.jsx      # Route "/quiz"
│   │   └── Resultats.jsx       # Route "/resultats"(useMemo)
│   ├── styles/
│   │   └── index.css           # Design Racing/Tech
│   ├── App.jsx                 # Routeur + Provider
│   └── main.jsx                # Point de montage React
├── index.html
├── package.json
└── vite.config.js
'''

---

## Installation et lancement

'''bash
npm install
npm run dev
'''

---

## Jalons implémentés

### Jalon 1 — Custom Hook 'useFetch' (3 pts)
**Fichiers :** 'public/questions.json' · 'src/hooks/useFetch.js'

Le hook 'useFetch(url)' abstrait toute la logique réseau hors des composants.
Il gère trois états internes : 'data', 'loading' (booléen), 'error.
Il implémente un pattern **anti-fuite mémoire** via le flag 'isMounted' :
si le composant se démonte avant la fin du fetch, le résultat est ignoré.

'''js
const { data, loading, error } = useFetch("/questions.json");
'''

---

### Jalon 2 — API Context (4 pts)
**Fichier :** 'src/context/UserContext.jsx'

Le 'UserContext' expose un 'UserProvider' qui enveloppe toute l'application.
L'état global contient : 'pseudo' (null par défaut) et 'meilleurScore'.
Le hook utilitaire `useUser()` permet une consommation sécurisée du contexte.

'''jsx
// Dans App.jsx
<UserProvider>
  <BrowserRouter>...</BrowserRouter>
</UserProvider>
'''

---

### Jalon 3 — Routes Protégées (4 pts)
**Fichier :** 'src/components/ProtectedRoute.jsx'

Le composant '<ProtectedRoute>' interroge le 'UserContext'.
Si 'pseudo === null' -- redirection immédiate via '<Navigate to="/" replace />'.
Les routes '/quiz' et '/resultats' sont obligatoirement wrappées.

'''jsx
<Route path="/quiz" element={<ProtectedRoute><QuizEngine /></ProtectedRoute>} />
'''

---

### Jalon 4 — 'useReducer' (5 pts)
**Fichier :** 'src/reducers/quizReducer.js' · 'src/pages/QuizEngine.jsx'

'quizReducer' est défini **hors du composant** (séparation des responsabilités).
Il gère trois actions :
- 'START_QUIZ' : initialise l'état avec les questions reçues en payload
- 'ANSWER_QUESTION' : vérifie la réponse, incrémente le score, avance l'index
- 'FINISH_QUIZ' : force la fin (utilisé par le chronomètre)

'''js
const [etat, dispatch] = useReducer(quizReducer, etatInitial);
dispatch({ type: "ANSWER_QUESTION", payload: "Lewis Hamilton" });
'''

---

### Jalon 5 — 'useRef' & 'useMemo' (4 pts)
**Fichier :** 'src/pages/QuizEngine.jsx' · 'src/pages/Resultats.jsx'

**Chronomètre ('useRef')** :
L'ID du 'setInterval' est stocké dans 'intervalRef' (et **non** dans le state)
pour être accessible dans la fonction de cleanup sans déclencher de re-renders.
Quand le temps atteint 0 -- 'clearInterval(intervalRef.current)' + 'dispatch({ type: "FINISH_QUIZ" })'.

**Calcul mémoïsé ('seMemo')** :
Sur '/resultats', le calcul du ratio de bonnes réponses est enveloppé dans 'useMemo'.
Il ne se ré-exécute que si 'score', 'total' ou 'reponses' changent.
Un changement de thème (clair/sombre) ne le redéclenche pas.
Pour le démontrer, un bouton de changement de thème est présent sur la page résultats.

'''js
const statistiques = useMemo(() => {
  const ratio = (score / total) * 100;
  // ... calculs ...
}, [score, total, reponses]); // Thème NON inclus dans les dépendances
'''
