
import React, { useEffect } from 'react';
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
  const { transactions, balance, incomeTotal, expenseTotal, deleteTransaction, fetchTransactions, isLoading, error, startPolling, stopAutoRefresh } = useTransactions();
  const { toast } = useToast();
  
  // Fetch transactions when component mounts - only once, don't auto refresh
  useEffect(() => {
    fetchTransactions();
    // Disable auto refresh when component mounts
    stopAutoRefresh();
  }, [fetchTransactions, stopAutoRefresh]);
  
  // Explicitly don't show error toast from Main page to avoid redundant errors
  // The error UI will be shown below instead
  
  // Get the 3 most recent transactions
  const recentTransactions = transactions.slice(0, 3);
  
  const handleDelete = (id: number) => {
    deleteTransaction(id);
    toast({
      title: "Eliminado",
      description: "El movimiento ha sido eliminado correctamente."
    });
  };
  
  const handleRefresh = () => {
    fetchTransactions();
    toast({
      title: "Actualizando",
      description: "Buscando nuevos movimientos..."
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
    
    // Start polling for new transactions
    startPolling();
    
    // Show notification that we're looking for updates
    toast({
      title: "Buscando Actualizaciones",
      description: "Estamos buscando nuevas transacciones. Por favor, espera un momento después de enviar tu mensaje de WhatsApp."
    });
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
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center gap-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Actualizar
        </Button>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Error Banner */}
        {error && (
          <Alert variant="destructive" className="mb-4 animate-fade-in">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* WhatsApp Integration Button - Only one button now */}
        <Button 
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
          onClick={openWhatsApp}
        >
          <MessageCircleIcon className="h-5 w-5" />
          Registrar gastos desde WhatsApp
        </Button>
        
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
        
        {/* Refresh Button - Only show if there's an error or no data */}
        {(error || transactions.length === 0) && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRefresh}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4 mr-2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Actualizar Datos
          </Button>
        )}
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
