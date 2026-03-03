import { useState, useEffect } from 'react';
import { LayoutDashboard, PieChart, ArrowRightLeft, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { authService } from '../../services/firebase/auth';
import { User } from 'firebase/auth';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
    expanded?: boolean;
    activeItem: string;
    onNavigate: (id: string) => void;
}

export default function Sidebar({ expanded = true, activeItem, onNavigate }: SidebarProps) {
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Escutando ativamente o Header do Google para buscar a foto e o nome do usuário ativo (Avatar)
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUserProfile(user);
        });
        return () => unsubscribe();
    }, [])

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transações', icon: ArrowRightLeft },
        { id: 'goals', label: 'Metas', icon: PieChart },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    const handleLogout = async () => {
        await authService.logout();
    }

    return (
        <aside className={cn(
            "h-full bg-white dark:bg-card border-r border-border transition-all duration-300 flex flex-col",
            expanded ? "w-64" : "w-20"
        )}>
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 shadow-md">
                    💰
                </div>
                {expanded && <span className="ml-3 font-semibold text-xl tracking-tight text-foreground">FinDash</span>}
            </div>

            <nav className="flex-1 px-3 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {expanded && (
                                <span className="ml-3 font-medium text-sm">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Area */}
            {userProfile && expanded && (
                <div className="px-4 py-3 mx-2 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    {userProfile.photoURL ? (
                        <img src={userProfile.photoURL} alt="Avatar" className="w-8 h-8 rounded-full shadow-sm" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {userProfile.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{userProfile.displayName || "Usuário"}</p>
                        <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                </div>
            )}

            <div className="p-4 border-t border-border flex flex-col gap-2">
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "w-full flex items-center px-3 py-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                        !expanded && "justify-center"
                    )}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                    {expanded && <span className="ml-3 font-medium text-sm">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center px-3 py-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-destructive dark:hover:bg-slate-800",
                        !expanded && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {expanded && <span className="ml-3 font-medium text-sm">Desconectar</span>}
                </button>
            </div>
        </aside>
    );
}
