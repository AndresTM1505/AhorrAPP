
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Home, PieChart, CreditCard, User, LogOut } from 'lucide-react';

interface SideMenuProps {
  items?: string[];
}

const SideMenu: React.FC<SideMenuProps> = ({ items = ["Inicio", "Categorías", "Movimientos", "Perfil", "Cerrar sesión"] }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const icons = {
    "Inicio": <Home size={20} />,
    "Categorías": <PieChart size={20} />,
    "Movimientos": <CreditCard size={20} />,
    "Perfil": <User size={20} />,
    "Cerrar sesión": <LogOut size={20} />
  };

  const paths = {
    "Inicio": "/main",
    "Categorías": "/categories",
    "Movimientos": "/transactions",
    "Perfil": "/profile",
    "Cerrar sesión": "/"
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar border-r border-border">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">AhorroAPP</h2>
            <p className="text-sm text-sidebar-foreground/70">Gestiona tus finanzas</p>
          </div>
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item}>
                  <Link 
                    to={paths[item as keyof typeof paths] || "#"} 
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                      location.pathname === paths[item as keyof typeof paths] && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    {icons[item as keyof typeof icons] || null}
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
