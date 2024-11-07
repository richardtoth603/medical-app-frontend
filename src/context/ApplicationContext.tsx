import { ApplicationUser } from "@/domain/models/ApplicationUser";
import { createContext, useState } from "react";

export class AuthenticationUrls {
    static loginUrl = "https://localhost:7062/Authentication/Login";
    static logoutUrl = "https://localhost:7062/Authentication/Logout";
    static registerUrl = "https://localhost:7062/Authentication/Register";
};

export type ApplicationContextType = {
    user: ApplicationUser | undefined;
    setUser: (user: ApplicationUser | undefined) => void;
    login: (email: string, password: string) => Promise<boolean>;
    token: string | undefined;
    logout: () => void;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
};

export const ApplicationContext = createContext<ApplicationContextType>({
    user: undefined,
    setUser: () => { },
    login: () => Promise.resolve(false),
    token: undefined,
    logout: () => { },
    register: () => Promise.resolve(false),
});

export const ApplicationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ApplicationUser | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);

    const login = async (email: string, password: string) => {
        const response = await fetch(AuthenticationUrls.loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.text();
            //decode from base64
            let decodedData = atob(data);
            //parse the data
            let parsedData = JSON.parse(decodedData);
            //get the token
            let token = parsedData.Token;
            let decodedToken = atob(token);
            let parsedToken = JSON.parse(decodedToken);
            localStorage.setItem("email", parsedToken.email);
            localStorage.setItem("role", parsedToken.role);
            localStorage.setItem("role_id", parsedToken.role_id);
            localStorage.setItem("token", data);
            //set the user
            setUser({
                id: 'testIdCauseIForgotToPassIt',
                firstName: 'testFirstNameCauseIForgotToPassIt',
                lastName: 'testLastNameCauseIForgotToPassIt',
                email: parsedToken.email,
                role: parsedToken.role,
                roleId: parsedToken.role_id
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("role_id");
        localStorage.removeItem("token");
        setUser(undefined);
    };

    const register = async (email: string, password: string, role: string) => {
        const response = await fetch(AuthenticationUrls.registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, role }),
        });
        return response.ok;
    }

    return (
        <ApplicationContext.Provider value={{ user, setUser, login, token, logout, register }}>
            {children}
        </ApplicationContext.Provider>
    );
}