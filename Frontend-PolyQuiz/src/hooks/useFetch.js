// Ce hook abstrait toute la logique réseau (fetch) loin des composants graphiques.
// Il expose trois états : data, loading, error.

import { useState, useEffect } from "react";

/**
 * useFetch : Custom Hook générique pour les requêtes HTTP.
 * @param {string} url - L'URL à interroger.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur HTTP : statut ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]); // Re-déclenché uniquement si l'URL change.

  return { data, loading, error };
};

export default useFetch;
