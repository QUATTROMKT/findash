import { subMonths, subDays } from 'date-fns';

export type TransactionType = 'INCOME' | 'EXPENSE';
export type CategoryGroup = 'ESSENTIALS' | 'LIFESTYLE' | 'INVESTMENTS_DEBTS';

export interface Category {
    id: string;
    name: string;
    group: CategoryGroup;
    type: TransactionType;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    date: string;
}

export const CATEGORIES: Category[] = [
    { id: 'cat_salary', name: 'Salário', group: 'ESSENTIALS', type: 'INCOME' },
    { id: 'cat_freelance', name: 'Freelance', group: 'ESSENTIALS', type: 'INCOME' },
    { id: 'cat_supermarket', name: 'Supermercado', group: 'ESSENTIALS', type: 'EXPENSE' },
    { id: 'cat_housing', name: 'Aluguel/Moradia', group: 'ESSENTIALS', type: 'EXPENSE' },
    { id: 'cat_utilities', name: 'Contas Básicas (Luz, Água)', group: 'ESSENTIALS', type: 'EXPENSE' },
    { id: 'cat_food_out', name: 'Restaurantes', group: 'LIFESTYLE', type: 'EXPENSE' },
    { id: 'cat_entertainment', name: 'Streaming/Lazer', group: 'LIFESTYLE', type: 'EXPENSE' },
    { id: 'cat_transport', name: 'Transporte/Uber', group: 'LIFESTYLE', type: 'EXPENSE' },
    { id: 'cat_investments', name: 'Ações/Renda Fixa', group: 'INVESTMENTS_DEBTS', type: 'EXPENSE' }, // treated as expense for envelope logic
    { id: 'cat_debts', name: 'Cartão de Crédito/Dívidas', group: 'INVESTMENTS_DEBTS', type: 'EXPENSE' },
];

export const GOALS = [
    { group: 'ESSENTIALS', name: 'Gastos Essenciais (50%)', limit: 3000, current: 2450 },
    { group: 'LIFESTYLE', name: 'Estilo de Vida (30%)', limit: 1800, current: 800 },
    { group: 'INVESTMENTS_DEBTS', name: 'Invest. e Dívidas (20%)', limit: 1200, current: 1200 },
];

const generateMockData = (): Transaction[] => {
    const data: Transaction[] = [];
    const now = new Date();

    // Gerar dados para os últimos 6 meses
    for (let i = 0; i < 6; i++) {
        const monthBase = subMonths(now, i);

        // Renda (Income) pseudo-fixa
        data.push({
            id: `inc_${i}_1`,
            description: 'Salário Mensal',
            amount: 6000,
            type: 'INCOME',
            categoryId: 'cat_salary',
            date: subDays(monthBase, 25).toISOString()
        });

        // Despesas fixas (Essenciais)
        data.push({
            id: `exp_${i}_aluguel`,
            description: 'Aluguel e Condomínio',
            amount: 2000,
            type: 'EXPENSE',
            categoryId: 'cat_housing',
            date: subDays(monthBase, 26).toISOString()
        });

        data.push({
            id: `exp_${i}_supermercado`,
            description: 'Supermercado Atacadão',
            amount: 800,
            type: 'EXPENSE',
            categoryId: 'cat_supermarket',
            date: subDays(monthBase, 20).toISOString()
        });

        // Lifestyle variable
        data.push({
            id: `exp_${i}_ifood`,
            description: 'iFood Fim de Semana',
            amount: 150 + Math.random() * 50,
            type: 'EXPENSE',
            categoryId: 'cat_food_out',
            date: subDays(monthBase, 15).toISOString()
        });

        // Investment
        data.push({
            id: `exp_${i}_inv`,
            description: 'Aporte Tesouro Direto',
            amount: 1000,
            type: 'EXPENSE', // Treat savings exit as expense to standard flow balancing
            categoryId: 'cat_investments',
            date: subDays(monthBase, 5).toISOString()
        });
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockTransactions = generateMockData();
