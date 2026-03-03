import { signInWithPopup, signOut, onAuthStateChanged as firebaseOnAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from './config';

export const authService = {
    // Login via Google Popup
    loginWithGoogle: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error("Erro no login com Google:", error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
            return true;
        } catch (error) {
            console.error("Erro no logout:", error);
            throw error;
        }
    },

    // Observador Global de Estado
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return firebaseOnAuthStateChanged(auth, callback);
    }
};
