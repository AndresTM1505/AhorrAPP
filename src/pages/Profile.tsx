
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Sample data for the bar chart
  const chartData = [
    { name: 'Ene', savings: 400 },
    { name: 'Feb', savings: 300 },
    { name: 'Mar', savings: 600 },
    { name: 'Abr', savings: 800 },
    { name: 'May', savings: 500 },
    { name: 'Jun', savings: 400 },
  ];

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
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="" alt={name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
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
            
            <Button className="w-full">Guardar cambios</Button>
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
