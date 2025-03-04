
import React, { useState } from 'react';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus, Briefcase, Bus, Music, Heart, Home, Coffee, ShoppingCart, 
  Bike, Plane, Book, DollarSign, Smartphone, Trash, Edit, Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define a type for our category
interface Category {
  id: number;
  name: string;
  icon: JSX.Element;
  iconName: string; // Store the icon name for editing
}

// Available icons for selection
const iconOptions = [
  { name: "coffee", icon: <Coffee size={20} />, label: "Café" },
  { name: "briefcase", icon: <Briefcase size={20} />, label: "Trabajo" },
  { name: "bus", icon: <Bus size={20} />, label: "Transporte" },
  { name: "music", icon: <Music size={20} />, label: "Música" },
  { name: "heart", icon: <Heart size={20} />, label: "Salud" },
  { name: "home", icon: <Home size={20} />, label: "Casa" },
  { name: "shopping-cart", icon: <ShoppingCart size={20} />, label: "Compras" },
  { name: "bike", icon: <Bike size={20} />, label: "Deporte" },
  { name: "plane", icon: <Plane size={20} />, label: "Viajes" },
  { name: "book", icon: <Book size={20} />, label: "Educación" },
  { name: "dollar-sign", icon: <DollarSign size={20} />, label: "Finanzas" },
  { name: "smartphone", icon: <Smartphone size={20} />, label: "Tecnología" }
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Oficina", icon: <Briefcase size={20} />, iconName: "briefcase" },
    { id: 2, name: "Transporte", icon: <Bus size={20} />, iconName: "bus" },
    { id: 3, name: "Entretenimiento", icon: <Music size={20} />, iconName: "music" },
    { id: 4, name: "Salud", icon: <Heart size={20} />, iconName: "heart" },
    { id: 5, name: "Casa", icon: <Home size={20} />, iconName: "home" },
    { id: 6, name: "Alimentos", icon: <Coffee size={20} />, iconName: "coffee" },
  ]);
  
  const [newCategory, setNewCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("coffee");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
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

    const selectedIconObj = iconOptions.find(i => i.name === selectedIcon);
    if (!selectedIconObj) return;

    const newId = Math.max(0, ...categories.map(cat => cat.id)) + 1;
    setCategories([...categories, { 
      id: newId, 
      name: newCategory, 
      icon: selectedIconObj.icon,
      iconName: selectedIcon
    }]);
    
    setNewCategory("");
    setSelectedIcon("coffee");
    setIsOpen(false);
    
    toast({
      title: "Categoría agregada",
      description: `Se ha agregado la categoría "${newCategory}" correctamente.`
    });
  };

  const handleEditCategory = () => {
    if (!currentCategory) return;
    
    if (newCategory.trim() === "") {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    const selectedIconObj = iconOptions.find(i => i.name === selectedIcon);
    if (!selectedIconObj) return;

    setCategories(categories.map(cat => 
      cat.id === currentCategory.id 
        ? { 
            ...cat, 
            name: newCategory, 
            icon: selectedIconObj.icon,
            iconName: selectedIcon 
          } 
        : cat
    ));
    
    setNewCategory("");
    setSelectedIcon("coffee");
    setIsEditOpen(false);
    setCurrentCategory(null);
    
    toast({
      title: "Categoría actualizada",
      description: `Se ha actualizado la categoría correctamente.`
    });
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada correctamente."
    });
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setNewCategory(category.name);
    setSelectedIcon(category.iconName);
    setIsEditOpen(true);
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
            <Card key={category.id} className="p-4 flex flex-col items-center justify-center h-32 relative">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
              
              {/* Edit and delete buttons */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(category)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
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
                
                <div className="space-y-2">
                  <Label>Ícono</Label>
                  <RadioGroup 
                    value={selectedIcon} 
                    onValueChange={setSelectedIcon}
                    className="grid grid-cols-4 gap-2"
                  >
                    {iconOptions.map((icon) => (
                      <div key={icon.name} className="flex flex-col items-center">
                        <RadioGroupItem 
                          value={icon.name} 
                          id={`icon-${icon.name}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`icon-${icon.name}`}
                          className={`flex flex-col items-center gap-1 rounded-md border-2 p-2 cursor-pointer hover:bg-muted ${
                            selectedIcon === icon.name ? 'border-primary bg-primary/10' : 'border-transparent'
                          }`}
                        >
                          {icon.icon}
                          <span className="text-xs">{icon.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Categoría</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Nombre de la categoría</Label>
                  <Input 
                    id="edit-category-name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Ej: Viajes" 
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Ícono</Label>
                  <RadioGroup 
                    value={selectedIcon} 
                    onValueChange={setSelectedIcon}
                    className="grid grid-cols-4 gap-2"
                  >
                    {iconOptions.map((icon) => (
                      <div key={icon.name} className="flex flex-col items-center">
                        <RadioGroupItem 
                          value={icon.name} 
                          id={`edit-icon-${icon.name}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`edit-icon-${icon.name}`}
                          className={`flex flex-col items-center gap-1 rounded-md border-2 p-2 cursor-pointer hover:bg-muted ${
                            selectedIcon === icon.name ? 'border-primary bg-primary/10' : 'border-transparent'
                          }`}
                        >
                          {icon.icon}
                          <span className="text-xs">{icon.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditCategory}>Guardar cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Categories;
