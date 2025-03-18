
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definición del tipo de transacción
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  isFixed?: boolean;
  type: 'Ingreso' | 'Gasto';
}

// Interfaz del contexto
interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
}

// Storage key
const TRANSACTIONS_STORAGE_KEY = 'ahorrapp_transactions';

// Crear el contexto
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

// Proveedor del contexto
export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load transactions from localStorage on initial render
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Función para agregar una nueva transacción
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    // Generar un nuevo ID (en una app real, esto vendría del backend)
    const newId = Math.max(0, ...transactions.map(t => t.id)) + 1;
    
    // Crear la nueva transacción con el ID
    const newTransaction: Transaction = {
      ...transaction,
      id: newId,
      // Aseguramos que el amount tenga el signo correcto según el tipo
      amount: transaction.type === 'Ingreso' ? Math.abs(Number(transaction.amount)) : -Math.abs(Number(transaction.amount))
    };
    
    // Actualizar el estado
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Función para actualizar una transacción existente
  const updateTransaction = (updatedTransaction: Transaction) => {
    const updatedAmount = updatedTransaction.type === 'Ingreso' 
      ? Math.abs(Number(updatedTransaction.amount)) 
      : -Math.abs(Number(updatedTransaction.amount));
    
    setTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id 
        ? { ...updatedTransaction, amount: updatedAmount } 
        : t
    ));
  };

  // Función para eliminar una transacción
  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calcular totales
  const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const incomeTotal = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Valor del contexto
  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    balance,
    incomeTotal,
    expenseTotal
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
