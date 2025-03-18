
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, CirclePlus, Trash, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [editedTransaction, setEditedTransaction] = useState({
    amount: '',
    type: 'Gasto' as 'Ingreso' | 'Gasto',
    category: '',
    date: '',
    description: '',
    isFixed: false
  });
  
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
    // Validar datos
    if (!editedTransaction.amount || !editedTransaction.category) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }
    
    updateTransaction({
      id: selectedTransaction.id,
      ...editedTransaction,
      amount: parseFloat(editedTransaction.amount),
      type: editedTransaction.type
    });
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Actualizado",
      description: "El movimiento ha sido actualizado correctamente."
    });
  };
  
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
                onValueChange={(value) => setEditedTransaction({...editedTransaction, type: value})} 
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
