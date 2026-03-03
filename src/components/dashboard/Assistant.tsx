import { useState, useEffect } from 'react';
import { Transaction } from '../../data/mock';
import { Bot, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

interface IAProps {
    transactions: Transaction[];
}

export default function Assistant({ transactions }: IAProps) {
    const [advice, setAdvice] = useState({ title: '', message: '', type: 'neutral' });

    useEffect(() => {
        // Lógica Rule-Based (Opção A)
        // 1. Filtrar transações deste mês
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let income = 0;
        let expenses = 0;

        let essentialExps = 0; // Ex: Moradia, Alimentação
        let lifestyleExps = 0; // Ex: Lazer, Streaming

        transactions.forEach(t => {
            const d = new Date(t.date);
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                if (t.type === 'INCOME') income += t.amount;
                if (t.type === 'EXPENSE') {
                    expenses += t.amount;
                    if (['cat_housing', 'cat_supermarket', 'cat_utilities'].includes(t.categoryId)) {
                        essentialExps += t.amount;
                    } else if (['cat_food_out', 'cat_entertainment', 'cat_transport'].includes(t.categoryId)) {
                        lifestyleExps += t.amount;
                    }
                }
            }
        });

        if (income === 0) {
            setAdvice({
                title: "Começando o Mês",
                message: "Registre suas receitas e salários deste mês para ativarmos seu termômetro financeiro.",
                type: "neutral"
            });
            return;
        }

        const essentialPercent = (essentialExps / income) * 100;
        const lifestylePercent = (lifestyleExps / income) * 100;

        if (expenses > income) {
            setAdvice({
                title: "Alerta Vermelho 🚨",
                message: "Você já gastou mais do que ganhou este mês! Congele os gastos com Lazer imediatamente até a virada do mês.",
                type: "danger"
            });
        }
        else if (essentialPercent > 55) {
            setAdvice({
                title: "Custos Fixos Altos",
                message: `Seus gastos essenciais (Moradia/Alimentação) consumiram ${essentialPercent.toFixed(1)}% da sua renda. O ideal na regra 50/30/20 é tentar manter em 50%.`,
                type: "warning"
            });
        }
        else if (lifestylePercent > 35) {
            setAdvice({
                title: "Cuidado com o Estilo de Vida",
                message: `Você está gastando ${lifestylePercent.toFixed(1)}% com lazer e compras não essenciais. O teto recomendado é 30% para não faltar no Teto de Investimentos!`,
                type: "warning"
            });
        }
        else {
            setAdvice({
                title: "Caminho Perfeito 🏆",
                message: "Você está equilibrando suas despesas maravilhosamente bem! Seus custos essenciais e de estilo de vida estão super saudáveis e alinhados à meta 50/30/20.",
                type: "success"
            });
        }

    }, [transactions]);

    const getIcon = () => {
        switch (advice.type) {
            case 'danger': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning': return <TrendingDown className="w-5 h-5 text-amber-500" />;
            case 'success': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
            default: return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
        }
    }

    const getBgColor = () => {
        switch (advice.type) {
            case 'danger': return "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20";
            case 'warning': return "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20";
            case 'success': return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20";
            default: return "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20";
        }
    }

    return (
        <div className={`w-full rounded-xl border p-5 ${getBgColor()} flex flex-col md:flex-row gap-4 items-start shadow-sm transition-all duration-300 relative overflow-hidden`}>
            {/* Efeito de Vidro */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-black/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="w-10 h-10 shrink-0 rounded-full bg-white dark:bg-card shadow-sm flex items-center justify-center border border-border">
                <Bot className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Conselheiro IA: {advice.title}</h3>
                    {getIcon()}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
                    {advice.message}
                </p>
            </div>
        </div>
    )
}
