'use client';
const { useRouter } = require("next/navigation");
const { createContext, useEffect, useState, useContext } = require("react");

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const router = useRouter();

    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setUserLoggedIn(Boolean(localStorage.getItem("token")));
        setEmail(localStorage.getItem("email") || '');
        setRole(localStorage.getItem("role") || '');
        setUserId(localStorage.getItem("userId") || '');
    }, []);



    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        setUserLoggedIn(false);
        setEmail('');
        setRole('');
        setUserId('');
        router.push('/login');
    }


    return <AppContext.Provider value={{ userLoggedIn, setUserLoggedIn, logout, email, setEmail, role, setRole, userId }}>
        {children}
    </AppContext.Provider>

}

const useAppContext = () => useContext(AppContext);

export default useAppContext;