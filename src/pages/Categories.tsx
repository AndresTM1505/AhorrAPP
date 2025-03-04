
import React, { useState } from 'react';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Briefcase, Bus, Music, Heart, Home, Coffee } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Oficina", icon: <Briefcase size={20} /> },
    { id: 2, name: "Transporte", icon: <Bus size={20} /> },
    { id: 3, name: "Entretenimiento", icon: <Music size={20} /> },
    { id: 4, name: "Salud", icon: <Heart size={20} /> },
    { id: 5, name: "Casa", icon: <Home size={20} /> },
    { id: 6, name: "Alimentos", icon: <Coffee size={20} /> },
  ]);
  
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(0, ...categories.map(cat => cat.id)) + 1;
    setCategories([...categories, { 
      id: newId, 
      name: newCategory, 
      icon: <Coffee size={20} /> 
    }]);
    
    setNewCategory("");
    setIsOpen(false);
    
    toast({
      title: "Categoría agregada",
      description: `Se ha agregado la categoría "${newCategory}" correctamente.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center">
        <SideMenu />
        <h1 className="text-xl font-semibold">Categorías</h1>
      </header>

      {/* Categories list */}
      <main className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <Card key={category.id} className="p-4 flex flex-col items-center justify-center h-32">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </Card>
          ))}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 flex flex-col items-center justify-center h-32 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-2">
                  <Plus size={24} />
                </div>
                <h3 className="font-medium">Agregar</h3>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Categoría</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nombre de la categoría</Label>
                  <Input 
                    id="category-name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Ej: Viajes" 
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Categories;
