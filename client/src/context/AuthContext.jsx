import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(getAuthToken());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const currentToken = getAuthToken();
            if (currentToken) {
                try {
                    const data = await api.getMe();
                    setAdmin(data.admin);
                } catch (err) {
                    console.warn('Session expired or invalid token');
                    setAuthToken(null);
                    setAdmin(null);
                    setToken('');
                }
            }
            setLoading(false);
        }
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const res = await api.login(username, password);
        setAuthToken(res.token);
        setToken(res.token);
        setAdmin(res.admin);
        return res;
    };

    const logout = () => {
        setAuthToken(null);
        setToken('');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{
            admin,
            token,
            isAuthenticated: !!admin,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
