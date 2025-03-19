
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, CirclePlus, 
  Trash, Edit, CalendarIcon, MessageCircleIcon
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Transactions = () => {
  const navigate = useNavigate();
  const { 
    transactions, deleteTransaction, updateTransaction, 
    fetchTransactions, isLoading, error
  } = useTransactions();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
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
  
  // Apply date filter to transactions
  useEffect(() => {
    if (transactions.length > 0) {
      if (selectedDate) {
        // Filter transactions for the selected date
        const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
        
        setFilteredTransactions(transactions.filter(transaction => {
          // Compare just the date part
          return transaction.date === formattedSelectedDate;
        }));
      } else {
        // Show all transactions when no date is selected
        setFilteredTransactions(transactions);
      }
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, selectedDate]);
  
  // Don't show error toast, only display in UI
  
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
  
  const clearDateFilter = () => {
    setSelectedDate(undefined);
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
          <h1 className="text-xl font-semibold">Movimientos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* WhatsApp Button */}
          <Button 
            variant="outline"
            className="flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-100"
            onClick={openWhatsApp}
            size="sm"
          >
            <MessageCircleIcon className="h-4 w-4" />
            WhatsApp
          </Button>
          
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={selectedDate ? "text-primary" : ""}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Filtrar por fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
              <div className="p-3 border-t border-border flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearDateFilter}
                  className="text-muted-foreground"
                >
                  Limpiar filtro
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {}}
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchTransactions()} 
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
        </div>
      </header>

      {/* Transactions list */}
      <main className="p-4 space-y-4">
        {/* Show filter information */}
        {selectedDate && (
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
            <p className="text-sm">
              Mostrando movimientos del día <span className="font-medium">{format(selectedDate, 'dd/MM/yyyy')}</span>
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearDateFilter}
              className="h-8 text-muted-foreground"
            >
              Mostrar todos
            </Button>
          </div>
        )}
        
        {/* Show error banner if needed */}
        {error && (
          <Alert variant="destructive" className="mb-4 animate-fade-in">
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
            {selectedDate 
              ? `No hay movimientos registrados para el día ${format(selectedDate, 'dd/MM/yyyy')}` 
              : 'No hay movimientos registrados'}
          </div>
        )}
        
        {/* Show a WhatsApp explanation card at the bottom */}
        <Card className="p-4 mt-8 bg-green-50 border-green-200">
          <div className="flex flex-col items-center text-center space-y-3">
            <MessageCircleIcon className="h-10 w-10 text-green-500" />
            <h3 className="font-semibold text-green-800">¿Cómo añadir gastos por WhatsApp?</h3>
            <p className="text-green-700 text-sm">
              Para registrar un nuevo movimiento por WhatsApp, debes enviar un mensaje con el siguiente formato:
            </p>
            <div className="bg-white p-3 rounded-md text-left w-full font-mono text-xs text-green-900">
              <strong>Tipo, Categoría, Descripción, Monto, Fecha</strong>
              <br />
              Ejemplo: Gasto, comida, bembos, 22.90, 4-2-25
            </div>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white w-full mt-3"
              onClick={openWhatsApp}
            >
              <MessageCircleIcon className="h-5 w-5 mr-2" />
              Enviar mensaje de WhatsApp
            </Button>
          </div>
        </Card>
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
    </div>
  );
};

export default Transactions;
