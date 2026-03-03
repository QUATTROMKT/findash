import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { formatBRL, cn } from '../../lib/utils';
import { Transaction } from '../../data/mock';

interface DashboardSummaryProps {
    transactions: Transaction[];
}

export default function DashboardSummary({ transactions }: DashboardSummaryProps) {
    // Calculando totais do "mês atual" baseados nos mocks (simplificado para todos)
    const totals = transactions.reduce(
        (acc, curr) => {
            if (curr.type === 'INCOME') acc.income += curr.amount;
            if (curr.type === 'EXPENSE') acc.expense += curr.amount;
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;

    const cards = [
        {
            title: 'Saldo Atual',
            amount: balance,
            icon: Wallet,
            color: 'text-primary',
            bgIcon: 'bg-primary/10',
        },
        {
            title: 'Receitas',
            amount: totals.income,
            icon: ArrowUpCircle,
            color: 'text-success',
            bgIcon: 'bg-success/10',
        },
        {
            title: 'Despesas',
            amount: totals.expense,
            icon: ArrowDownCircle,
            color: 'text-destructive',
            bgIcon: 'bg-destructive/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", card.bgIcon, card.color)}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {formatBRL(card.amount)}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
