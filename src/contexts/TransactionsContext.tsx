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
  startPolling: () => void;
  stopPolling: () => void;
  stopAutoRefresh: () => void;
}

// Storage key for fallback
const TRANSACTIONS_STORAGE_KEY = 'ahorrapp_transactions';
const API_URL_STORAGE_KEY = 'ahorrapp_api_url';

// Default API Base URL with Lovable-friendly value
// Instead of localhost which doesn't work in Lovable's environment
const DEFAULT_API_BASE_URL = 'https://mocked-api.example.com/api';

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

// Sample transactions for fallback when no data is available
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    description: "Sueldo",
    amount: 1500,
    category: "Salario",
    date: "2025-03-10",
    isFixed: true,
    type: "Ingreso"
  },
  {
    id: 2,
    description: "Alquiler",
    amount: -500,
    category: "Casa",
    date: "2025-03-05",
    isFixed: true,
    type: "Gasto"
  },
  {
    id: 3,
    description: "Compras supermercado",
    amount: -120,
    category: "Alimento",
    date: "2025-03-15",
    isFixed: false,
    type: "Gasto"
  }
];

// Context provider
export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    localStorage.getItem(API_URL_STORAGE_KEY) || DEFAULT_API_BASE_URL
  );
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Save API URL to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(API_URL_STORAGE_KEY, apiBaseUrl);
  }, [apiBaseUrl]);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Load initial data only once from localStorage
  useEffect(() => {
    const loadInitialData = () => {
      const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions);
          setTransactions(parsedTransactions);
          console.log('Loaded transactions from localStorage');
        } catch (err) {
          console.error('Error parsing saved transactions:', err);
          setTransactions(SAMPLE_TRANSACTIONS);
        }
      } else {
        setTransactions(SAMPLE_TRANSACTIONS);
        console.log('Loaded sample transactions');
      }
    };
    
    loadInitialData();
  }, []); // Only run once on mount

  // Function to start polling for new transactions (used after WhatsApp message)
  const startPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    let attempts = 0;
    console.log("Starting polling for new transactions...");
    
    // Do an immediate fetch
    fetchTransactions();
    
    const interval = setInterval(() => {
      attempts++;
      console.log(`Polling for new transactions (attempt ${attempts})`);
      fetchTransactions();
      
      if (attempts >= 12) {
        clearInterval(interval);
        setPollingInterval(null);
        console.log("Polling stopped after 1 minute");
      }
    }, 5000);
    
    setPollingInterval(interval);
  };
  
  // Function to stop polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
      console.log("Polling stopped manually");
    }
  };
  
  // Function to stop auto-refresh (no-op now since we don't auto-refresh)
  const stopAutoRefresh = () => {
    console.log("Auto-refresh already disabled - no automatic updates");
    stopPolling();
  };

  // Function to fetch transactions from the API - ONLY WHEN MANUALLY CALLED
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching transactions from: ${apiBaseUrl}/transactions`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiBaseUrl}/transactions`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setTransactions(data);
      
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));
      console.log('Transactions updated from API');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      
      setError('Failed to load transactions. Using local data if available.');
      
      // Keep existing transactions, don't reload from localStorage during error
      console.log('Keeping existing transactions due to API error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save transactions to localStorage
  const saveToLocalStorage = (updatedTransactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
  };

  // Function to add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const amount = transaction.type === 'Ingreso' 
        ? Math.abs(Number(transaction.amount)) 
        : -Math.abs(Number(transaction.amount));
      
      console.log(`Adding transaction to: ${apiBaseUrl}/transactions`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiBaseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          amount
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to add transaction: ${response.status} ${response.statusText}`);
      }
      
      const newTransaction = await response.json();
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      saveToLocalStorage([newTransaction, ...transactions]);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Using local data storage as fallback.');
      
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
      saveToLocalStorage(updatedTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing transaction
  const updateTransaction = async (updatedTransaction: Transaction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const amount = updatedTransaction.type === 'Ingreso' 
        ? Math.abs(Number(updatedTransaction.amount)) 
        : -Math.abs(Number(updatedTransaction.amount));
      
      console.log(`Updating transaction at: ${apiBaseUrl}/transactions/${updatedTransaction.id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiBaseUrl}/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedTransaction,
          amount
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to update transaction: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id 
          ? { ...result } 
          : t
      );
      
      setTransactions(updatedTransactions);
      
      saveToLocalStorage(updatedTransactions);
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Using local data storage as fallback.');
      
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
      saveToLocalStorage(updatedTransactions);
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiBaseUrl}/transactions/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.status} ${response.statusText}`);
      }
      
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      
      saveToLocalStorage(updatedTransactions);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Using local data storage as fallback.');
      
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      saveToLocalStorage(updatedTransactions);
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
    setApiBaseUrl,
    startPolling,
    stopPolling,
    stopAutoRefresh
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
