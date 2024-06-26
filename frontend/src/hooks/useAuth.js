import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { user } = useSelector((state) => state.auth);

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setAuth(user)
        } else {
            setAuth(false)
        }

        setLoading(false);
    }, [user]);

    return { auth, loading };
}