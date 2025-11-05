import { createContext, useContext } from "react";
import type { AuthContextType } from "types/Context";
import { getContextErrorText } from "utils/contextHelper";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(getContextErrorText("useAuth", "AuthProvider"));
  return ctx;
};