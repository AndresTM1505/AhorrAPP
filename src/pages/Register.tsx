
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',  
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    photoURL: '',
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, photoURL: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }
    
    // Guardar datos del usuario en localStorage
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phoneNumber,
      photoURL: formData.photoURL,
    };
    
    localStorage.setItem('ahorrapp_profile_data', JSON.stringify(userData));
    
    toast({
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada correctamente."
    });
    
    // Navegar a la página de login
    navigate('/login');
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
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={formData.photoURL} />
                <AvatarFallback className="bg-primary/10">
                  {formData.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full">
                <Label htmlFor="photo" className="text-center block">FOTO DE PERFIL</Label>
                <Input 
                  id="photo" 
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">NOMBRE</Label>
              <Input 
                id="firstName" 
                name="firstName"
                type="text" 
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">APELLIDOS</Label>
              <Input 
                id="lastName" 
                name="lastName"
                type="text" 
                value={formData.lastName}
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
              <Label htmlFor="phoneNumber">TELÉFONO</Label>
              <Input 
                id="phoneNumber" 
                name="phoneNumber"
                type="tel" 
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+34 600 000 000"
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
            
            <Button type="submit" className="w-full">
              REGISTRARSE
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta? <a href="/login" className="text-primary hover:underline">Iniciar sesión</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
