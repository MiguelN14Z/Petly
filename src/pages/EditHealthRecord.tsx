import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Stethoscope, Syringe, Activity, ClipboardList, CheckCircle2, Trash2 } from "lucide-react";
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

export default function EditHealthRecord() {
  const navigate = useNavigate();
  const { recordId } = useParams();
  const records = usePetStore(state => state.records);
  const pets = usePetStore(state => state.pets);
  const updateRecord = usePetStore(state => state.updateRecord);
  const removeRecord = usePetStore(state => state.removeRecord);
  
  const record = records.find(r => r.id === recordId);
  const pet = record ? pets.find(p => p.id === record.petId) : null;
  
  const [formData, setFormData] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        notes: record.notes,
        doctor: record.doctor,
        iconType: record.iconType,
        weight: record.weight || "",
        temperature: record.temperature || "",
        date: record.date // Date handling might need conversion depending on format
      });
    }
  }, [record]);

  if (!record || !pet) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-on-surface">Registro no encontrado</h2>
        <Button onClick={() => navigate("/patients")} className="bg-primary rounded-xl">Volver al Directorio</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecord(record.id, formData);
    setIsSuccess(true);
    setTimeout(() => {
      navigate(`/vet/pet/history/${pet.id}`, { replace: true });
    }, 2000);
  };

  const handleDelete = () => {
    const isVetMode = location.pathname.startsWith('/vet');
    removeRecord(record.id);
    navigate(isVetMode ? `/vet/pet/history/${pet.id}` : `/pet/history/${pet.id}`);
  };

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-on-surface">Editar Registro</h2>
            <p className="text-on-surface-variant text-lg">Modificando informe de <span className="text-primary font-bold">{pet.name}</span></p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsDeleting(true)}
          className="border-error text-error hover:bg-error/5 rounded-xl px-4"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
        </Button>
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
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="h-16 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner font-bold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Fecha (Texto para Demo)</Label>
                    <Input 
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
                  Actualizar Registro
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
              <h3 className="text-4xl font-black text-on-surface">¡Cambios Guardados!</h3>
              <p className="text-on-surface-variant text-xl font-medium">El informe ha sido actualizado correctamente.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => setIsDeleting(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">¿Eliminar Registro?</h4>
                <p className="text-on-surface-variant text-sm">Esta acción es irreversible y eliminará este informe del historial.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setIsDeleting(false)}>Cancelar</Button>
                <Button className="flex-1 bg-error hover:bg-error/90 text-white rounded-xl" onClick={handleDelete}>Sí, Eliminar</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
