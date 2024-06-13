import { createContext, useState } from 'react';

//contexts should alwys have their own files
const AuthContext = createContext({});

export const AuthProvider = ({children}) =>
{
    const [loginState, setLoginState] = useState(false);
    const [authToken, setAuthToken] = useState("");

    return (
        <AuthContext.Provider value={{loginState, setLoginState, authToken, setAuthToken}}>
            {children}
        </AuthContext.Provider>

    )
 }

 export default AuthContext;