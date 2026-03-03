import { useState, useEffect } from 'react';
import { authService } from '../../services/firebase/auth';
import { User, updateProfile } from 'firebase/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, User as UserIcon, Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser?.displayName) {
                setDisplayName(currentUser.displayName);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        try {
            await updateProfile(user, { displayName });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            alert("Erro ao atualizar o perfil. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 text-slate-500">
                    Ajuste suas preferências e perfil visual da aplicação.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Perfil Selection */}
                <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-800/50">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                            <UserIcon className="w-5 h-5 text-primary" />
                            Perfil do Usuário
                        </h2>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Nome de Exibição</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">E-mail (Leitura apenas)</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                readOnly
                                disabled
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-input rounded-md text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 w-full mt-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </form>
                </div>

                {/* Theme Configuration */}
                <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-800/50">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                            <Monitor className="w-5 h-5 text-indigo-500" />
                            Aparência
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Escolha o tema perfeito para acompanhar suas finanças. O modo escuro protege sua visão durante a noite.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={toggleTheme}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3 text-foreground">
                                    <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-primary' : 'text-slate-500'}`} />
                                    <span className="font-medium">Modo Claro</span>
                                </div>
                                {theme === 'light' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                            </button>

                            <button
                                onClick={toggleTheme}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3 text-foreground">
                                    <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-primary' : 'text-slate-500'}`} />
                                    <span className="font-medium">Modo Escuro</span>
                                </div>
                                {theme === 'dark' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
