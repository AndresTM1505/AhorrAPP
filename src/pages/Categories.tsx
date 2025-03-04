
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Briefcase, Bus, Music, Heart, Home, Coffee } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: "Oficina", icon: <Briefcase size={20} /> },
    { id: 2, name: "Transporte", icon: <Bus size={20} /> },
    { id: 3, name: "Entretenimiento", icon: <Music size={20} /> },
    { id: 4, name: "Salud", icon: <Heart size={20} /> },
    { id: 5, name: "Casa", icon: <Home size={20} /> },
    { id: 6, name: "Alimentos", icon: <Coffee size={20} /> },
  ];

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
          <Card className="p-4 flex flex-col items-center justify-center h-32 border-dashed">
            <Button variant="ghost" className="h-12 w-12 rounded-full flex items-center justify-center mb-2">
              <Plus size={24} />
            </Button>
            <h3 className="font-medium">Agregar</h3>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Categories;
