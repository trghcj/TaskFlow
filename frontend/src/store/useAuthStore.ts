import { create } from 'zustand';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User 
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, microsoftProvider, yahooProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithYahoo: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
  updateUser: (userUpdates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signInWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  signInWithGithub: async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Error signing in with Github:", error);
      throw error;
    }
  },

  signInWithMicrosoft: async () => {
    try {
      await signInWithPopup(auth, microsoftProvider);
    } catch (error) {
      console.error("Error signing in with Microsoft:", error);
      throw error;
    }
  },

  signInWithYahoo: async () => {
    try {
      await signInWithPopup(auth, yahooProvider);
    } catch (error) {
      console.error("Error signing in with Yahoo:", error);
      throw error;
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  initializeAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  updateUser: (userUpdates) => {
    set((state) => {
      if (!state.user) return state;
      // Object.assign allows us to update the User object while keeping its prototype/methods intact
      const updatedUser = Object.assign(state.user, userUpdates);
      return { user: updatedUser };
    });
  }
}));
