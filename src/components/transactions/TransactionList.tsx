import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatBRL, cn } from '../../lib/utils';
import { Transaction, CATEGORIES } from '../../data/mock';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
    const getCategoryName = (id: string) => CATEGORIES.find(c => c.id === id)?.name || 'Outros';

    return (
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border overflow-hidden mt-6">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Transações Recentes</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium">Descrição</th>
                            <th scope="col" className="px-6 py-4 font-medium">Categoria</th>
                            <th scope="col" className="px-6 py-4 font-medium">Data</th>
                            <th scope="col" className="px-6 py-4 font-medium text-right">Valor</th>
                            <th scope="col" className="px-6 py-4 font-medium text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.slice(0, 10).map((t) => (
                            <tr key={t.id} className="border-b border-border last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        t.type === 'INCOME' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                                    )}>
                                        {t.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    </div>
                                    {t.description}
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-medium">
                                        {getCategoryName(t.categoryId)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {format(new Date(t.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                </td>
                                <td className={cn(
                                    "px-6 py-4 font-semibold text-right whitespace-nowrap",
                                    t.type === 'INCOME' ? "text-success" : "text-foreground"
                                )}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatBRL(t.amount)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="p-2 text-slate-400 hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
