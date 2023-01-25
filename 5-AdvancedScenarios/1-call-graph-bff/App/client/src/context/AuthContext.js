import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getAccount = async () => {
        const response = await fetch('/auth/isAuthenticated');
        const data =  await response.json();
        setIsLoading(false);
        setAccount(data);
    } 

    useEffect(() => {
        getAccount();
    },[])

    return (
        <AuthContext.Provider
            value={{
                account,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};