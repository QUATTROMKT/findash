import React, { useState, useEffect } from 'react';
import DashboardSummary from './DashboardSummary';
import Charts from './Charts';
import GoalsProgress from './GoalsProgress';
import TransactionList from '../transactions/TransactionList';
import TransactionForm from '../transactions/TransactionForm';
import { dbService } from '../../services/firebase/db';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction, GOALS } from '../../data/mock';
import { Plus } from 'lucide-react';

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        dbService.getTransactions().then((data) => {
            setTransactions(data as Transaction[]);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="text-center py-10 animate-pulse text-slate-500">Buscando informações analíticas...</div>;
    }

    // Preparando dados para o Gráfico de Barras
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), i)).reverse();
    const barData = last6Months.map(date => {
        const monthName = format(date, 'MMM', { locale: ptBR });
        const monthIndex = date.getMonth();

        let inc = 0, exp = 0;
        transactions.forEach(t => {
            const d = new Date(t.date);
            if (d.getMonth() === monthIndex) {
                if (t.type === 'INCOME') inc += t.amount;
                if (t.type === 'EXPENSE') exp += t.amount;
            }
        });

        return {
            month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            Receita: inc,
            Despesa: exp
        };
    });

    const donutData = GOALS.map(g => ({
        name: g.name.split(' (')[0],
        value: g.current,
    }));

    const handleDeleteTransaction = async (id: string) => {
        await dbService.deleteTransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleAddTransaction = async (data: Omit<Transaction, 'id'>) => {
        const newTransaction = await dbService.addTransaction(data) as Transaction;
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return (
        <div className="flex flex-col gap-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Visão Geral</h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 text-slate-500">
                        Acompanhe seu fluxo de caixa e metas.
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nova Transação</span>
                </button>
            </div>

            <DashboardSummary transactions={transactions} />
            <Charts expenseData={barData} ruleData={donutData} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                </div>
                <div className="xl:col-span-1">
                    <GoalsProgress goals={GOALS} />
                </div>
            </div>

            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleAddTransaction}
            />
        </div>
    );
}
