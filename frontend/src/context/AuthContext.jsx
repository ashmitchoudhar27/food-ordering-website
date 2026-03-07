import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Get fresh user data from backend to prevent role mismatch/tampering
                    const { data } = await api.get('/auth/me');
                    const freshUser = data.data.user;
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (error) {
                    console.error('Session validation failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setToken(data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return data.data.user;
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        setToken(data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return data.data.user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
