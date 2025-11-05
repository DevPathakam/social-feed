import { createContext, useContext } from "react";
import type { CacheContextType } from "types/Context";
import { getContextErrorText } from "utils/contextHelper";

export const CacheContext = createContext<CacheContextType | undefined>(
  undefined
);

export const useCache = (): CacheContextType => {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error(getContextErrorText("useCache", "CacheProvider"));
  return ctx;
};
