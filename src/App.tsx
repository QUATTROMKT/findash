import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { authService } from './services/firebase/auth';
import { User } from 'firebase/auth';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            await authService.loginWithGoogle();
        } catch (error) {
            alert("Não foi possível autenticar no momento. Verifique se o Firebase está configurado corretamente.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-full mb-4"></div>
                    <p className="text-lg font-medium text-slate-500">Iniciando FinDash Seguramente...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
                <div className="max-w-md w-full p-8 bg-white dark:bg-card rounded-xl shadow-lg border border-border">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-xl mx-auto flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-md mb-4">
                            💰
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">FinDash</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Suas finanças de forma simples e segura.</p>
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 rounded-lg transition-colors shadow-sm dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:border-slate-600"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Entrar com Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <Dashboard />
        </Layout>
    );
}

export default App;
