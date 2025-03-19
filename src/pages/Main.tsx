
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CirclePlus, TrendingUp, TrendingDown, MessageCircleIcon, Edit, Trash } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Main = () => {
  const { transactions, balance, incomeTotal, expenseTotal, deleteTransaction, fetchTransactions, isLoading, error } = useTransactions();
  const { toast } = useToast();
  
  // Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  // If error from API, show toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Get the 3 most recent transactions
  const recentTransactions = transactions.slice(0, 3);
  
  const handleDelete = (id: number) => {
    deleteTransaction(id);
    toast({
      title: "Eliminado",
      description: "El movimiento ha sido eliminado correctamente."
    });
  };
  
  const openWhatsApp = () => {
    // The WhatsApp number to send messages to
    const phoneNumber = "+34603831258";
    
    // Interactive message format for WhatsApp
    const message = encodeURIComponent(
      "*NUEVO MOVIMIENTO* \n\n" +
      "Hola! Para registrar un nuevo movimiento, por favor completa los campos:\n\n" +
      "*Tipo*/" + "*Categoría/*" + "*Descripción/*" + "*Monto/*" + "*Fecha*\n\n" +
      "Ej. Gasto, comida, bembos, 22.90, 4-2-25\n\n" +
      "Por favor, responde con toda la información completa. Una vez reciba tu mensaje, actualizaré la app con tu nuevo movimiento.\n\n" +
      "¡Gracias por usar AhorroAPP!"
    );
    
    // Open WhatsApp with the predefined message
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    // After sending the message, show a notification to refresh
    toast({
      title: "Mensaje Enviado",
      description: "Después de enviar el mensaje, regresa y actualiza la app para ver tus cambios."
    });
    
    // Schedule a refresh in 30 seconds to check for new transactions
    setTimeout(() => {
      fetchTransactions();
      toast({
        title: "Actualización",
        description: "Buscando nuevas transacciones..."
      });
    }, 30000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center">
          <SideMenu />
          <h1 className="text-xl font-semibold">Inicio</h1>
        </div>
        <Button 
          variant="outline"
          className="flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-100"
          onClick={openWhatsApp}
          size="sm"
        >
          <MessageCircleIcon className="h-4 w-4" />
          WhatsApp
        </Button>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Total Balance */}
        <Card className="w-full bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
            <div className="flex items-center text-sm mt-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>Este mes</span>
            </div>
          </CardContent>
        </Card>

        {/* Income/Expense Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-green-500">{formatCurrency(incomeTotal)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-500">{formatCurrency(expenseTotal)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* WhatsApp Integration Button */}
        <Button 
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
          onClick={openWhatsApp}
        >
          <MessageCircleIcon className="h-5 w-5" />
          Registrar gastos desde WhatsApp
        </Button>
        
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Últimos Movimientos</CardTitle>
              <Link to="/transactions" className="text-sm text-primary hover:underline">Ver todos</Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Cargando últimos movimientos...</div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
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
                    <div className="flex items-center gap-2">
                      <span className={transaction.amount > 0 ? "text-green-500 font-medium mr-2" : "text-red-500 font-medium mr-2"}>
                        {formatCurrency(transaction.amount)}
                      </span>
                      <Link to={`/transactions`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(transaction.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-4">
                No hay movimientos recientes
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add expense button (fixed at bottom) */}
      <Link to="/new-expense" className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <CirclePlus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
};

export default Main;
