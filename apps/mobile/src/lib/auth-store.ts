import { create } from "zustand";
import { authStorage, getJSON, setJSON } from "./storage";

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    organizationId: string;
    organizationSlug: string;
  };
};

type AuthState = {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  restore: () => void;
  signOut: () => void;
};

const SESSION_KEY = "v1.session";

export const useAuth = create<AuthState>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => {
    if (session) setJSON(authStorage, SESSION_KEY, session);
    else authStorage.delete(SESSION_KEY);
    set({ session, loading: false });
  },
  restore: () => {
    const session = getJSON<Session>(authStorage, SESSION_KEY);
    set({ session, loading: false });
  },
  signOut: () => {
    authStorage.delete(SESSION_KEY);
    set({ session: null, loading: false });
  },
}));
