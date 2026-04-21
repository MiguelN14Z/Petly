import React, { useState } from "react";
import { ArrowLeft, Save, Stethoscope, Syringe, Activity, ClipboardList, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { usePetStore, MedicalRecord } from "../store/usePetStore";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { id: 'stethoscope', icon: Stethoscope, label: 'Consulta' },
  { id: 'syringe', icon: Syringe, label: 'Vacuna' },
  { id: 'activity', icon: Activity, label: 'Tratamiento' },
  { id: 'clipboard', icon: ClipboardList, label: 'Reporte' },
];

export default function AddHealthRecord() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const pets = usePetStore(state => state.pets);
  const addRecord = usePetStore(state => state.addRecord);
  
  const pet = pets.find(p => p.id === petId);
  
  const [formData, setFormData] = useState({
    type: "",
    notes: "",
    doctor: "Dr. Julian Thorne", // Default for demo
    weight: "",
    temperature: "",
    iconType: 'stethoscope' as MedicalRecord['iconType'],
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isSuccess, setIsSuccess] = useState(false);

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-on-surface">Mascota no encontrada</h2>
        <Button onClick={() => navigate("/patients")} className="bg-primary rounded-xl">Volver al Directorio</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecord({
      petId: pet.id,
      date: new Date(formData.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      type: formData.type,
      notes: formData.notes,
      doctor: formData.doctor,
      weight: formData.weight,
      temperature: formData.temperature,
      iconType: formData.iconType
    });
    
    setIsSuccess(true);
    setTimeout(() => {
      navigate(`/vet/pet/history/${pet.id}`, { replace: true });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
      <div className="flex items-center gap-6 mb-12">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-4xl font-black tracking-tight text-on-surface">Nuevo Registro Clínico</h2>
          <p className="text-on-surface-variant text-lg">Añadir informe médico para <span className="text-primary font-bold">{pet.name}</span></p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="p-8 md:p-10 rounded-[3rem] bg-white border-none shadow-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Tipo de Consulta</Label>
                    <Input 
                      required
                      placeholder="Ej: Vacunación, Cirugía, Control"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Fecha de Atención</Label>
                    <Input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Peso (kg)</Label>
                    <Input 
                      placeholder="Ej: 28.5"
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Temperatura (ºC)</Label>
                    <Input 
                      placeholder="Ej: 38.5"
                      value={formData.temperature}
                      onChange={e => setFormData({...formData, temperature: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Categoría / Ícono</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ICON_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({...formData, iconType: opt.id as MedicalRecord['iconType']})}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-none",
                          formData.iconType === opt.id ? "bg-primary text-on-primary shadow-lg scale-105" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                        )}
                      >
                        <opt.icon className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Observaciones y Diagnóstico</Label>
                  <Textarea 
                    required
                    placeholder="Escriba los hallazgos clínicos relevantes..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="min-h-[200px] bg-surface-container-low border-none rounded-[2rem] p-8 focus:ring-2 focus:ring-primary shadow-inner font-medium text-lg leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Médico Veterinario</Label>
                    <Input 
                      required
                      value={formData.doctor}
                      onChange={e => setFormData({...formData, doctor: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="px-10 py-8 rounded-[2rem] font-bold text-outline hover:bg-surface-container transition-all h-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 transition-all h-auto flex items-center justify-center gap-3"
                >
                  <Save className="h-6 w-6" />
                  Guardar Registro Clínico
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 flex flex-col items-center text-center space-y-8"
          >
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-on-surface">¡Registro Guardado!</h3>
              <p className="text-on-surface-variant text-xl font-medium">El historial de {pet.name} ha sido actualizado correctamente.</p>
            </div>
            <p className="text-sm text-outline animate-pulse">Redirigiendo al historial...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
