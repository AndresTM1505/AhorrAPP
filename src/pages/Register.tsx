import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', // Cambiar de 'name' a 'firstName'
    lastName: '',  // Agregar 'lastName' al estado
    email: '',
    password: '',
    confirmPassword: '',
    photo: null,
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para registrar al usuario

    // Navegar a la página principal después del registro
    navigate('/login');
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">AhorrAPP</CardTitle>
          <CardDescription className="text-center">
            Regístrate para administrar tus finanzas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">NOMBRE</Label>
            <Input 
              id="firstName" 
              name="firstName" // Cambiar a un identificador único
              type="text" 
              value={formData.firstName} // Ajustar el estado
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">APELLIDOS</Label>
            <Input 
              id="lastName" 
              name="lastName" // Cambiar a otro identificador único
              type="text" 
              value={formData.lastName} // Ajustar el estado
              onChange={handleChange}
              placeholder="Tus apellidos"
              required
            />
          </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">CONTRASEÑA</Label>
              <Input 
                id="password" 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">FOTO DE PERFIL</Label>
              <Input 
                id="photo" 
                name="photo"
                type="file"
                onChange={handlePhotoChange}
              />
            </div>
            <Button type="submit" className="w-full">
              REGISTRARSE
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
