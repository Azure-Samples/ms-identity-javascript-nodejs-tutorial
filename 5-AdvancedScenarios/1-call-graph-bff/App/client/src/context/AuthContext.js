import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (postLoginRedirectUri, scopesToConsent) => {
        let url = "/auth/login";

        const searchParams = new URLSearchParams({});

        if (postLoginRedirectUri) {
            searchParams.append('postLoginRedirectUri', encodeURIComponent(postLoginRedirectUri));
        }

        if (scopesToConsent) {
            searchParams.append('scopesToConsent', encodeURIComponent(scopesToConsent));
        }

        url = `${url}?${searchParams.toString()}`;

        window.location.replace(url);
    }

    const logout = (postLogoutRedirectUri) => {
        setIsAuthenticated(false);
        setAccount(null);

        let url = "/auth/logout";

        const searchParams = new URLSearchParams({});

        if (postLogoutRedirectUri) {
            searchParams.append('postLoginRedirectUri', encodeURIComponent(postLogoutRedirectUri));
        }

        url = `${url}?${searchParams.toString()}`;

        window.location.replace(url);
    }

    const getAccount = async () => {
        const response = await fetch('/auth/account');
        const data = await response.json();
        setIsAuthenticated(data ? true : false);
        setAccount(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getAccount();
    }, [])

    return (
        <AuthContext.Provider
            value={{
                account,
                isLoading,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};