// File: src/hooks/useApi.js
import { useState, useEffect, useRef } from 'react';

const useApi = (apiCall, params = [], initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        // Set mounted flag
        isMounted.current = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiCall(...params);

                if (isMounted.current) {
                    setData(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted.current) {
                    setError(err.message);
                    console.error('API Error:', err);
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted.current = false;
        };
    }, [apiCall, ...params]); // Dependency array

    return { data, loading, error };
};

export default useApi;