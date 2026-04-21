import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUp() {
  const navigate = useNavigate();
  const signup = useAuthStore(state => state.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(formData.name, formData.email, formData.password);
    navigate("/client");
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 -z-10 w-1/3 h-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
      <div className="fixed bottom-0 right-0 -z-10 w-1/4 h-1/2 bg-gradient-to-tl from-secondary-fixed/10 to-transparent blur-3xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-6xl w-full gap-12 items-center">
        {/* Branding Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8"
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg">
              <PawPrint className="h-8 w-8 fill-current" />
            </div>
            <span className="font-headline font-extrabold text-3xl tracking-tight text-primary">Petly</span>
          </div>
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="font-headline font-bold text-4xl lg:text-5xl leading-tight text-on-surface">Únete a nuestra comunidad</h1>
            <p className="text-on-surface-variant text-lg lg:text-xl font-medium opacity-80">Crea una cuenta para gestionar la salud de tus mascotas de forma inteligente.</p>
          </div>
          <div className="hidden lg:block w-full h-80 rounded-3xl overflow-hidden relative group shadow-2xl">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://picsum.photos/seed/signup/800/600" 
              alt="Community"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
          </div>
        </motion.div>

        {/* SignUp Form Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_40px_-10px_rgba(25,28,29,0.06)] border border-outline-variant/10">
            <h2 className="text-2xl font-bold font-headline mb-8 text-on-surface">Registro de Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-on-surface-variant ml-1">Nombre completo</Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Tu nombre" 
                    className="h-14 pl-12 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary w-full"
                    required
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-on-surface-variant ml-1">Correo electrónico</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="nombre@correo.com" 
                    className="h-14 pl-12 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary w-full"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-on-surface-variant ml-1">Contraseña</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Crea una contraseña" 
                    className="h-14 pl-12 pr-12 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary w-full"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-on-primary font-headline font-bold rounded-xl shadow-lg transition-all mt-4">
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant text-sm font-medium">
                ¿Ya tienes una cuenta? 
                <button onClick={() => navigate("/")} className="text-primary font-bold hover:underline ml-1">Inicia Sesión</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
