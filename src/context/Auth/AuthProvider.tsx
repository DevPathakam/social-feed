import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthContextType } from "types/Context";
import { AuthContext } from "./useAuth";
import { validUser } from "context/Auth/userData";
import { AUTH_TOKEN_KEY, USER_DETAILS_KEY } from "utils/localStorageKeys";
import type { User } from "types/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initUserData: User = {
    firstName: validUser.firstName,
    lastName: validUser.lastName,
    isModerator: validUser.isModerator,
    email: validUser.email,
  };
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  );

  const [userDetails] = useState<User>(() => {
    const saved = localStorage.getItem(USER_DETAILS_KEY);
    return saved ? JSON.parse(saved) : initUserData;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token && window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, [token, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === validUser.email && password === validUser.password) {
          const mockToken = "mocked-access-token-123456";
          localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
          localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(initUserData));
          setToken(mockToken);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DETAILS_KEY);
    setToken(null);
    navigate("/login");
  };

  const value: AuthContextType = {
    isAuthenticated: Boolean(token),
    login,
    logout,
    token,
    userDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
