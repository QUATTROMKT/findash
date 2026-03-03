import { useState, useEffect } from 'react';
import { Target, Save, AlertCircle } from 'lucide-react';
import { dbService } from '../../services/firebase/db';
import { formatBRL } from '../../lib/utils';
import { CATEGORIES } from '../../data/mock';

interface Goal {
    id: string;
    group: string;
    name: string;
    limit: number;
}

const DEFAULT_GOALS = [
    { group: 'ESSENTIALS', name: 'Gastos Essenciais (50%)', limit: 3000 },
    { group: 'LIFESTYLE', name: 'Estilo de Vida (30%)', limit: 1800 },
    { group: 'INVESTMENTS_DEBTS', name: 'Invest. e Dívidas (20%)', limit: 1200 },
];

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            const data = await dbService.getGoals();
            if (data.length === 0) {
                // Se não tem meta salva, inicializa com padrão localmente
                setGoals(DEFAULT_GOALS as Goal[]);
            } else {
                setGoals(data as Goal[]);
            }
            setLoading(false);
        };
        fetchGoals();
    }, []);

    const handleChangeLimit = (index: number, newLimit: string) => {
        const updated = [...goals];
        updated[index].limit = Number(newLimit);
        setGoals(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Como são apenas 3 metas fixas em estrutura, vamos salvá-las 
            // no banco deletando as antigas e subindo as novas para simplificar
            const oldGoals = await dbService.getGoals();
            for (const old of oldGoals) {
                await dbService.deleteGoal(old.id);
            }

            const newGoals = [];
            for (const g of goals) {
                const { id, ...rest } = g;
                const saved = await dbService.saveGoal(rest);
                newGoals.push(saved);
            }

            setGoals(newGoals);
            alert("Metas atualizadas com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar metas.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando carteira de envelopes...</div>;

    const totalLimits = goals.reduce((acc, g) => acc + g.limit, 0);

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Planejamento 50/30/20</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1 text-slate-500">
                    Defina seus limites de gastos por categoria (Envelopes virtuais).
                </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl flex gap-3 text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <strong>Dica de Ouro:</strong> Pela regra financeira, o total de todos os tetos somados deveria ser igual à sua Receita Líquida do Mês.
                    No FinDash, se você gastar mais que esse limite, o Conselheiro da Dashboard vai emitir um Alerta.
                </div>
            </div>

            <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                        <Target className="w-5 h-5 text-primary" />
                        Limites Faturados
                    </h2>
                    <div className="font-semibold text-foreground text-sm">
                        Total Parametrizado: <span className="text-primary">{formatBRL(totalLimits)}</span>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {goals.map((g, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">{g.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {g.group === 'ESSENTIALS' && "Aluguel, Moradia, Alimentação Básica"}
                                    {g.group === 'LIFESTYLE' && "Restaurantes, Streaming, Lazer"}
                                    {g.group === 'INVESTMENTS_DEBTS' && "Aportes em corretora ou quitação de empréstimos"}
                                </p>
                            </div>
                            <div className="w-full sm:w-48 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                                <input
                                    type="number"
                                    value={g.limit}
                                    onChange={(e) => handleChangeLimit(idx, e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-card border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 flex justify-end border-t border-border">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "Salvando Limites..." : "Salvar Configurações"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
