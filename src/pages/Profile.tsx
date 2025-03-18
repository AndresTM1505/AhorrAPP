
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/contexts/TransactionsContext';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Upload, Trash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const PROFILE_DATA_KEY = 'ahorrapp_profile_data';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { incomeTotal, expenseTotal } = useTransactions();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  // Load profile data from localStorage
  useEffect(() => {
    const profileData = localStorage.getItem(PROFILE_DATA_KEY);
    if (profileData) {
      const data = JSON.parse(profileData);
      setName(data.name || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setPhotoURL(data.photoURL || '');
    }
  }, []);
  
  // Handle saving changes
  const handleSaveChanges = () => {
    const profileData = {
      name,
      phone,
      email,
      photoURL
    };
    
    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(profileData));
    
    toast({
      title: "Guardado",
      description: "Tu perfil ha sido actualizado correctamente."
    });
  };
  
  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoURL(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle photo deletion
  const handleDeletePhoto = () => {
    setPhotoURL('');
    toast({
      title: "Eliminada",
      description: "La foto de perfil ha sido eliminada."
    });
  };
  
  // Calculate the savings data for chart
  const currentMonth = new Date().getMonth();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const savings = incomeTotal - expenseTotal;
  
  const chartData = months.map((month, index) => ({
    name: month,
    savings: index === currentMonth ? savings : 0
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center">
        <SideMenu />
        <h1 className="text-xl font-semibold">Perfil</h1>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Profile information */}
        <Card>
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="relative h-24 w-24 mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoURL} alt={name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-2 -bottom-2 flex space-x-1">
                <label htmlFor="photo-upload" className="cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-full p-1.5">
                  <Upload size={16} />
                  <input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoChange} 
                  />
                </label>
                {photoURL && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-7 w-7 rounded-full p-1.5" 
                    onClick={handleDeletePhoto}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={16} />
                Nombre
              </Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={16} />
                Número de celular
              </Label>
              <Input 
                id="phone" 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
            
            <Button className="w-full" onClick={handleSaveChanges}>Guardar cambios</Button>
          </CardContent>
        </Card>
        
        {/* Savings statistics */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Estadísticas de ahorro</h2>
          </CardHeader>
          <CardContent>
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="savings" fill="#8B5CF6" name="Ahorro" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
