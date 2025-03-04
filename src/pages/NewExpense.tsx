
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const NewExpense = () => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Gasto');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    navigate('/main');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Nuevo Movimiento</h1>
      </header>

      {/* Main content */}
      <main className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Registrar movimiento</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              
              {/* Type */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <RadioGroup value={type} onValueChange={setType} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ingreso" id="ingreso" />
                    <Label htmlFor="ingreso" className="cursor-pointer">Ingreso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Gasto" id="gasto" />
                    <Label htmlFor="gasto" className="cursor-pointer">Gasto</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory} required>
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
                <Label htmlFor="date">Fecha</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción del movimiento"
                />
              </div>
              
              {/* Fixed expense */}
              <div className="flex items-center space-x-2">
                <Checkbox id="fixed" checked={isFixed} onCheckedChange={(checked) => setIsFixed(checked === true)} />
                <Label htmlFor="fixed" className="cursor-pointer">Gasto Fijo</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Guardar</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewExpense;
