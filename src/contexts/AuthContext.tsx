import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authApi from "../store/features/auth/api";

// Define types for our context
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "manager";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(username, password);

      const { user, token } = response;

      const userInfo = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("authToken", token);

      setUser(userInfo);
      setIsLoading(false);
      return userInfo;
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed:", error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
