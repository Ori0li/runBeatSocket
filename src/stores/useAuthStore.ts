import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  accountId: number | null;
  role: "user" | "trainer" | null;
  setAuth: (token: string, accountId: number, role: "user" | "trainer") => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  accountId: null,
  role: null,
  setAuth: (token, accountId, role) =>
    set({ accessToken: token, accountId, role }),
  clearAuth: () => set({ accessToken: null, accountId: null, role: null }),
}));
