
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, CirclePlus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center">
        <SideMenu />
        <h1 className="text-xl font-semibold">Movimientos</h1>
      </header>

      {/* Transactions list */}
      <main className="p-4 space-y-4">
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <Card key={transaction.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  {transaction.amount > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{transaction.description}</h3>
                  <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <span className={transaction.amount > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {formatCurrency(transaction.amount)}
              </span>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No hay movimientos registrados
          </div>
        )}
      </main>

      {/* Add transaction button (fixed at bottom) */}
      <Button 
        onClick={() => navigate('/new-expense')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <CirclePlus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Transactions;
