
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, TrendingUp, TrendingDown, CirclePlus, 
  Trash, Edit, Filter, Settings 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, DialogContent, DialogFooter, DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Transactions = () => {
  const navigate = useNavigate();
  const { 
    transactions, deleteTransaction, updateTransaction, 
    fetchTransactions, isLoading, error, apiBaseUrl, setApiBaseUrl 
  } = useTransactions();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newApiUrl, setNewApiUrl] = useState(apiBaseUrl);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const [editedTransaction, setEditedTransaction] = useState({
    amount: '',
    type: 'Gasto' as 'Ingreso' | 'Gasto',
    category: '',
    date: '',
    description: '',
    isFixed: false
  });
  
  // Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  // Apply filters to transactions
  useEffect(() => {
    if (transactions.length > 0) {
      if (activeFilter === "3months") {
        // Filter transactions from the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        setFilteredTransactions(transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= threeMonthsAgo;
        }));
      } else {
        // Show all transactions
        setFilteredTransactions(transactions);
      }
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, activeFilter]);
  
  // Show error toast if API call fails but only once
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleDelete = (id: number) => {
    deleteTransaction(id);
    toast({
      title: "Eliminado",
      description: "El movimiento ha sido eliminado correctamente."
    });
  };
  
  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setEditedTransaction({
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.amount > 0 ? 'Ingreso' : 'Gasto',
      category: transaction.category,
      date: transaction.date,
      description: transaction.description,
      isFixed: transaction.isFixed || false
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdate = () => {
    // Validate data
    if (!editedTransaction.amount || !editedTransaction.category) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure type is correctly set as 'Ingreso' or 'Gasto'
    const validType: 'Ingreso' | 'Gasto' = 
      editedTransaction.type === 'Ingreso' ? 'Ingreso' : 'Gasto';
    
    updateTransaction({
      id: selectedTransaction.id,
      ...editedTransaction,
      amount: parseFloat(editedTransaction.amount),
      type: validType
    });
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Actualizado",
      description: "El movimiento ha sido actualizado correctamente."
    });
  };
  
  const applyFilter = (filter: string) => {
    setActiveFilter(filter);
  };
  
  // Function to test server connection
  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${newApiUrl}/transactions`, {
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(5000) // 5 seconds timeout
      });
      if (response.ok) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('failed');
        return false;
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setConnectionStatus('failed');
      return false;
    }
  };

  // Function to save API URL
  const saveApiUrl = async () => {
    const isConnected = await testConnection();
    
    if (isConnected) {
      setApiBaseUrl(newApiUrl);
      toast({
        title: "Configuración guardada",
        description: "La conexión al servidor se ha establecido correctamente."
      });
      setIsSettingsOpen(false);
      fetchTransactions();
    } else {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al servidor. Revise la URL y asegúrese de que el servidor esté en ejecución.",
        variant: "destructive"
      });
    }
  };
  
  const forceRefresh = () => {
    toast({
      title: "Actualizando",
      description: "Buscando nuevos movimientos..."
    });
    fetchTransactions();
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center">
          <SideMenu />
          <h1 className="text-xl font-semibold">Movimientos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={forceRefresh} 
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
          
          {/* Settings Button */}
          <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {activeFilter === "all" ? "Todos" : "Últimos 3 meses"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => applyFilter("all")} className={activeFilter === "all" ? "bg-muted" : ""}>
                Todos los movimientos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("3months")} className={activeFilter === "3months" ? "bg-muted" : ""}>
                Últimos 3 meses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Transactions list */}
      <main className="p-4 space-y-4">
        {/* Show error banner if needed */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="text-center py-10">
            Cargando últimos movimientos...
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
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
              <div className="flex items-center gap-2">
                <span className={transaction.amount > 0 ? "text-green-500 font-medium mr-2" : "text-red-500 font-medium mr-2"}>
                  {formatCurrency(transaction.amount)}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
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
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Movimiento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                <Input 
                  id="edit-amount" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={editedTransaction.amount}
                  onChange={(e) => setEditedTransaction({...editedTransaction, amount: e.target.value})}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            
            {/* Type */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <RadioGroup 
                value={editedTransaction.type} 
                onValueChange={(value: 'Ingreso' | 'Gasto') => setEditedTransaction({...editedTransaction, type: value})} 
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ingreso" id="edit-ingreso" />
                  <Label htmlFor="edit-ingreso" className="cursor-pointer">Ingreso</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Gasto" id="edit-gasto" />
                  <Label htmlFor="edit-gasto" className="cursor-pointer">Gasto</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría</Label>
              <Select 
                value={editedTransaction.category} 
                onValueChange={(value) => setEditedTransaction({...editedTransaction, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimento">Alimento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Carro">Carro</SelectItem>
                  <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                  <SelectItem value="Salud">Salud</SelectItem>
                  <SelectItem value="Educación">Educación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="edit-date">Fecha</Label>
              <Input 
                id="edit-date" 
                type="date" 
                value={editedTransaction.date}
                onChange={(e) => setEditedTransaction({...editedTransaction, date: e.target.value})}
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input 
                id="edit-description" 
                value={editedTransaction.description}
                onChange={(e) => setEditedTransaction({...editedTransaction, description: e.target.value})}
                placeholder="Descripción del movimiento"
              />
            </div>
            
            {/* Fixed expense */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-fixed" 
                checked={editedTransaction.isFixed}
                onCheckedChange={(checked) => setEditedTransaction({...editedTransaction, isFixed: checked === true})}
              />
              <Label htmlFor="edit-fixed" className="cursor-pointer">Gasto Fijo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Server settings dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración del Servidor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Alert variant={error ? "destructive" : "default"}>
              <AlertDescription>
                {error ? error : 
                  "Configura la conexión al servidor de PostgreSQL. Si el servidor está en ejecución en otra máquina, debes proporcionar la dirección IP completa."}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL de la API</Label>
              <Input 
                id="apiUrl" 
                value={newApiUrl}
                onChange={(e) => setNewApiUrl(e.target.value)}
                placeholder="http://localhost:3001/api"
              />
              <p className="text-sm text-muted-foreground">
                Ejemplo: http://localhost:3001/api o http://192.168.1.100:3001/api
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Estado actual: {connectionStatus === 'checking' ? 'Verificando...' : 
                               connectionStatus === 'connected' ? 'Conectado' : 'No conectado'}
              </p>
              <p className="text-sm text-muted-foreground">
                Asegúrate de que el servidor Node.js esté en ejecución y sea accesible desde este dispositivo.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => testConnection()}>Probar Conexión</Button>
            <Button onClick={saveApiUrl}>Guardar Configuración</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
