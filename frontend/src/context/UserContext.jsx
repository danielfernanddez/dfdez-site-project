import React, { createContext, useState, useEffect } from 'react';
import SHA256 from 'crypto-js/sha256';
import { pushDataLayer } from '../lib/analytics';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                setUserInfo(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user info from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const hashData = (data) => data ? SHA256(data.toString().trim().toLowerCase()).toString() : "";

    const pushUserData = (event, userData) => {
        const userProperties = {
            user_fn_plain: userData.firstName,
            user_ln_plain: userData.lastName,
            user_em_plain: userData.email,
            user_ph_plain: userData.phone,
            user_ct_plain: userData.city,
            user_co_plain: userData.country,
            user_fn_hash: hashData(userData.firstName),
            user_ln_hash: hashData(userData.lastName),
            user_em_hash: hashData(userData.email),
            user_ph_hash: hashData(userData.phone),
            user_ct_hash: hashData(userData.city),
            user_co_hash: hashData(userData.country),
        };

        pushDataLayer({
            event: event,
            user_id: userData._id,
            user_status: 'logged_in',
            user: userProperties,
        });
    };

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5001/api/users/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
        
        pushUserData('login', data);
        
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('http://localhost:5001/api/users/register', userData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
        
        pushUserData('sign_up', data);

        return data;
    };

    const logout = () => {

        pushDataLayer({
            event: 'log_out',
            user_id: userInfo?._id,
        })

        localStorage.removeItem('userInfo');
        setUserInfo(null);
        pushDataLayer({ 'user_id': undefined });
    };

    const value = { userInfo, loading, login, register, logout, isLoggedIn: !!userInfo };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
