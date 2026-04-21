import React, { useState } from "react";
import { ArrowLeft, Camera, ShieldCheck, PawPrint, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { usePetStore } from "../store/usePetStore";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterPet() {
  const navigate = useNavigate();
  const addPet = usePetStore(state => state.addPet);
  const { currentUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: ""
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = () => {
    addPet({
      name: formData.name || "Mascota sin nombre",
      breed: formData.breed || "Raza desconocida",
      age: formData.age || "Edad desconocida",
      weight: formData.weight ? `${formData.weight} kg` : "Peso desconocido",
      ownerId: currentUser?.id
    });
    navigate("/client");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <Button variant="ghost" size="icon" onClick={() => (step === 1 ? navigate(-1) : prevStep())} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Nueva Mascota</h2>
          <p className="text-on-surface-variant text-lg">Paso {step} de 3: {step === 1 ? 'Información básica' : step === 2 ? 'Detalles clínicos' : 'Casi listo'}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-surface-container-highest'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[3rem] bg-surface-container flex items-center justify-center border-4 border-dashed border-primary/30 group-hover:border-primary transition-colors cursor-pointer overflow-hidden shadow-inner">
                  <Camera className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl">
                  <PawPrint className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-sm font-bold ml-1 uppercase tracking-widest text-outline">Nombre de la Mascota</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Toby" 
                  className="rounded-2xl border-none bg-white p-6 h-auto text-lg focus-visible:ring-primary shadow-sm" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold ml-1 uppercase tracking-widest text-outline">Especie / Raza</Label>
                <Input 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="Ej: Golden Retriever" 
                  className="rounded-2xl border-none bg-white p-6 h-auto text-lg focus-visible:ring-primary shadow-sm" 
                />
              </div>
            </div>

            <Button onClick={nextStep} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 transition-all scale-100 active:scale-95">
              Siguiente Paso
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Card className="p-8 rounded-[2.5rem] bg-white border-none shadow-xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-bold ml-1 uppercase tracking-widest text-outline">Edad (Ej: 3 Años)</Label>
                  <Input 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="3 Años"
                    className="rounded-2xl border-none bg-surface-container-low p-6 h-auto text-lg focus-visible:ring-primary shadow-sm" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold ml-1 uppercase tracking-widest text-outline">Peso Aproximado (kg)</Label>
                  <Input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="0.0" 
                    className="rounded-2xl border-none bg-surface-container-low p-6 h-auto text-lg focus-visible:ring-primary shadow-sm" 
                  />
                </div>
              </div>
            </Card>

            <Button onClick={nextStep} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 transition-all scale-100 active:scale-95">
              Continuar
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="bg-primary/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
               <ShieldCheck className="h-16 w-16 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-on-surface">¡Todo Listo para el Registro!</h3>
              <p className="text-on-surface-variant text-lg max-w-md mx-auto">
                Al registrar a tu mascota, Petly creará automáticamente su perfil clínico oficial y te notificará sobre su estado de salud.
              </p>
            </div>

            <div className="bg-surface-container-low rounded-[2rem] p-8 max-w-sm mx-auto shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span>Perfil digital activado</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span>Gestión de vacunas lista</span>
              </div>
            </div>

            <Button onClick={handleRegister} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-10 rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-primary/30 transition-all hover:scale-105">
              Confirmar Registro Final
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
