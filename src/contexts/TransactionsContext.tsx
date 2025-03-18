
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definition of the transaction type
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  isFixed?: boolean;
  type: 'Ingreso' | 'Gasto';
}

// Context interface
interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
  fetchTransactions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setApiBaseUrl: (url: string) => void;
  apiBaseUrl: string;
}

// Storage key for fallback
const TRANSACTIONS_STORAGE_KEY = 'ahorrapp_transactions';
const API_URL_STORAGE_KEY = 'ahorrapp_api_url';

// Default API Base URL - editable through the context
const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';

// Create the context
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Custom hook to use the context
export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

// Context provider
export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    localStorage.getItem(API_URL_STORAGE_KEY) || DEFAULT_API_BASE_URL
  );
  
  // Save API URL to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(API_URL_STORAGE_KEY, apiBaseUrl);
  }, [apiBaseUrl]);

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching transactions from: ${apiBaseUrl}/transactions`);
      const response = await fetch(`${apiBaseUrl}/transactions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setTransactions(data);
      
      // Also save to localStorage as fallback
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Using local data if available.');
      
      // Fall back to localStorage if API call fails
      const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load transactions when component mounts
  useEffect(() => {
    fetchTransactions();
    
    // Set up polling to check for new transactions (e.g., from WhatsApp)
    const intervalId = setInterval(fetchTransactions, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [apiBaseUrl]); // Refetch when API URL changes

  // Function to add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure amount has the correct sign based on type
      const amount = transaction.type === 'Ingreso' 
        ? Math.abs(Number(transaction.amount)) 
        : -Math.abs(Number(transaction.amount));
      
      console.log(`Adding transaction to: ${apiBaseUrl}/transactions`);
      const response = await fetch(`${apiBaseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          amount
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add transaction: ${response.status} ${response.statusText}`);
      }
      
      const newTransaction = await response.json();
      
      // Update state with the new transaction
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update localStorage backup
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify([newTransaction, ...transactions]));
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Using local data storage as fallback.');
      
      // Fallback to local operation if API call fails
      const newId = Math.max(0, ...transactions.map(t => t.id)) + 1;
      const newTransaction: Transaction = {
        ...transaction,
        id: newId,
        amount: transaction.type === 'Ingreso' 
          ? Math.abs(Number(transaction.amount)) 
          : -Math.abs(Number(transaction.amount))
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing transaction
  const updateTransaction = async (updatedTransaction: Transaction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure amount has the correct sign
      const amount = updatedTransaction.type === 'Ingreso' 
        ? Math.abs(Number(updatedTransaction.amount)) 
        : -Math.abs(Number(updatedTransaction.amount));
      
      console.log(`Updating transaction at: ${apiBaseUrl}/transactions/${updatedTransaction.id}`);
      const response = await fetch(`${apiBaseUrl}/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedTransaction,
          amount
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update transaction: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update state
      setTransactions(prev => prev.map(t => 
        t.id === updatedTransaction.id 
          ? { ...result } 
          : t
      ));
      
      // Update localStorage backup
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(
        transactions.map(t => t.id === updatedTransaction.id ? { ...result } : t)
      ));
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Using local data storage as fallback.');
      
      // Fallback to local operation
      const updatedAmount = updatedTransaction.type === 'Ingreso' 
        ? Math.abs(Number(updatedTransaction.amount)) 
        : -Math.abs(Number(updatedTransaction.amount));
      
      const transactionWithCorrectAmount = {
        ...updatedTransaction,
        amount: updatedAmount
      };
      
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id 
          ? transactionWithCorrectAmount 
          : t
      );
      
      setTransactions(updatedTransactions);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a transaction
  const deleteTransaction = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Deleting transaction at: ${apiBaseUrl}/transactions/${id}`);
      const response = await fetch(`${apiBaseUrl}/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.status} ${response.statusText}`);
      }
      
      // Update state
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      
      // Update localStorage backup
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Using local data storage as fallback.');
      
      // Fallback to local operation
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const incomeTotal = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Context value
  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    balance,
    incomeTotal,
    expenseTotal,
    fetchTransactions,
    isLoading,
    error,
    apiBaseUrl,
    setApiBaseUrl
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
