import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from './config';
import { Transaction } from '../../data/mock';

const TRANSACTIONS_COLLECTION = 'transactions';

export const dbService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const user = auth.currentUser;
        if (!user) return [];

        try {
            const q = query(
                collection(db, TRANSACTIONS_COLLECTION),
                where("userId", "==", user.uid),
                orderBy("date", "desc")
            );

            const querySnapshot = await getDocs(q);
            const data: Transaction[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Transaction);
            });
            return data;
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            return [];
        }
    },

    addTransaction: async (data: Omit<Transaction, 'id'>) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado");

        try {
            const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
                ...data,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error("Erro ao adicionar transação:", error);
            throw error;
        }
    },

    deleteTransaction: async (id: string) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado");

        try {
            await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
            return true;
        } catch (error) {
            console.error("Erro ao deletar:", error);
            throw error;
        }
    }
};
