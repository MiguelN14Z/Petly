import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      // Get role from store after successful login
      const user = useAuthStore.getState().currentUser;
      if (user?.role === 'vet' || user?.role === 'admin') {
        navigate("/patients");
      } else {
        navigate("/client");
      }
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/2 bg-gradient-to-tr from-secondary-fixed/10 to-transparent blur-3xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-6xl w-full gap-12 items-center">
        {/* Branding Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg">
              <PawPrint className="h-8 w-8 fill-current" />
            </div>
            <span className="font-headline font-extrabold text-3xl tracking-tight text-primary">Petly</span>
          </div>
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="font-headline font-bold text-4xl lg:text-5xl leading-tight text-on-surface">Bienvenido a Petly</h1>
            <p className="text-on-surface-variant text-lg lg:text-xl font-medium opacity-80">Tu salud animal, simplificada.</p>
          </div>
          <div className="hidden lg:block w-full h-80 rounded-3xl overflow-hidden relative group shadow-2xl">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://picsum.photos/seed/clinic/800/600" 
              alt="Clinic"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* Login Form Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_40px_-10px_rgba(25,28,29,0.06)] border border-outline-variant/10">
            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-on-surface-variant ml-1">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@clinica.com" 
                  className="h-14 px-5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-sm font-semibold text-on-surface-variant">Contraseña</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="h-14 px-5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-on-primary font-headline font-bold rounded-xl shadow-lg transition-all">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant text-sm font-medium">
                ¿No tienes una cuenta? 
                <button onClick={() => navigate("/signup")} className="text-primary font-bold hover:underline ml-1">Regístrate</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
