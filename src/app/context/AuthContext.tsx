import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { api } from "../lib/api";
import { AuthContextType, LoginResponse, User, UserRole } from "../types/user";

// ── JWT decoder (no library needed) ──────────────────────────────────────────
function decodeJwt(token: string): Record<string, any> {
    try {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return {};
    }
}
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from localStorage on app start
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser  = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                // Check token hasn't expired
                const { exp } = decodeJwt(savedToken);
                if (exp && Date.now() / 1000 > exp) {
                    // Token expired — clear storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                } else {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                }
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post<LoginResponse>("/api/v1/auth/login", {
                email,
                password,
            });

            const result = response.data;

            if (result.status === 200 && result.token) {
                // Decode role from JWT
                const claims = decodeJwt(result.token);
                const role   = (claims.role as UserRole) ?? "TENANT";

                const userData: User = {
                    ...result.data,
                    role,
                };

                setToken(result.token);
                setUser(userData);

                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                throw new Error(result.message || "Login failed");
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Unable to connect. Check your internet.";
            throw new Error(msg);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post("/api/v1/auth/logout");
        } catch {
            console.info("Logout endpoint unreachable – continuing locally");
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};