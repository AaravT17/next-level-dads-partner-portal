import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../api/axios";

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    login: (accessToken: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

    useEffect(() => {
        const restoreSession = async () => {
            await refreshAccessToken();
            setIsCheckingAuth(false);
        }

        restoreSession();
    }, []);

    const refreshAccessToken = async (): Promise<string | null> => {
        try {
            const response = await api.post("/auth/refresh");

            const newAccessToken = response.data.access_token;

            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (err) {
            console.log(err);
            setAccessToken(null);
            return null;
        }
    }

    const login = (token: string) => {
        setAccessToken(token);
    };

    const logout = async () => {
        try {
            // console.log(accessToken);
            await api.post(
                "/auth/logout", 
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }
            );
        } catch (err){
            console.log(err);
        } finally {
            setAccessToken(null)
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated: accessToken != null,
                isCheckingAuth,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used with an AuthProvider"
        );
    }

    return context;
}
