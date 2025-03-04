
import React from 'react';
import { Link } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CirclePlus, TrendingUp, TrendingDown, PiggyBank, MessageCircleIcon } from 'lucide-react';

const Main = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center">
        <SideMenu />
        <h1 className="text-xl font-semibold">Inicio</h1>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Total Balance */}
        <Card className="w-full bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00€</div>
            <div className="flex items-center text-sm mt-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>0% este mes</span>
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
              <div className="text-2xl font-semibold text-green-500">0.00€</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-500">0.00€</div>
            </CardContent>
          </Card>
        </div>
        
        {/* WhatsApp Integration Button */}
        <Button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600">
          <MessageCircleIcon className="h-5 w-5" />
          Registrar gastos desde WhatsApp
        </Button>
        
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Movimientos Recientes</CardTitle>
              <Link to="/transactions" className="text-sm text-primary hover:underline">Ver todos</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center py-4">
              No hay movimientos recientes
            </div>
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
