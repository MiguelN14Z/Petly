import React, { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, Clock, PawPrint, CheckCircle2, ChevronRight, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { usePetStore } from "../store/usePetStore";
import { useAuthStore } from "../store/useAuthStore";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function ScheduleAppointment() {
  const navigate = useNavigate();
  const { pets, appointments, addAppointment } = usePetStore();
  const { currentUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const myPets = pets.filter(p => !currentUser || p.ownerId === currentUser.id);

  // Reset time if it becomes taken on a new date or selection (only before confirmation)
  React.useEffect(() => {
    if (step < 3 && selectedDate && selectedTime) {
      const isTaken = appointments.some(app => app.date === selectedDate && app.time === selectedTime);
      if (isTaken) setSelectedTime("");
    }
  }, [selectedDate, selectedTime, appointments, step]);

  const handleConfirm = () => {
    if (selectedPetId && selectedDate && selectedTime) {
      const isTaken = appointments.some(app => app.date === selectedDate && app.time === selectedTime);
      if (isTaken) {
        setSelectedTime("");
        return;
      }
      addAppointment({
        petId: selectedPetId,
        date: selectedDate,
        time: selectedTime,
        type: "Consulta General"
      });
      nextStep();
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <Button variant="ghost" size="icon" onClick={() => (step === 1 ? navigate(-1) : prevStep())} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Programar Cita</h2>
          <p className="text-on-surface-variant text-lg">Reserva una consulta general para tu mascota.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col gap-2 flex-1">
            <div className={cn("h-2 rounded-full transition-all duration-500", s <= step ? 'bg-primary' : 'bg-surface-container-highest')} />
            <span className={cn("text-[10px] font-bold uppercase tracking-widest text-center", s <= step ? 'text-primary' : 'text-outline')}>
              Paso {s}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-on-surface ml-1">¿Para quién es la cita?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPets.map(pet => (
                  <Card 
                    key={pet.id} 
                    onClick={() => setSelectedPetId(pet.id)}
                    className={cn(
                      "p-6 rounded-[2rem] border-none transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden",
                      selectedPetId === pet.id ? "bg-primary text-on-primary shadow-xl scale-[1.02]" : "bg-white hover:bg-surface-container shadow-md"
                    )}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shrink-0">
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl">{pet.name}</h4>
                      <p className={cn("text-xs font-medium", selectedPetId === pet.id ? "text-on-primary/80" : "text-on-surface-variant")}>{pet.breed}</p>
                    </div>
                    {selectedPetId === pet.id && (
                      <div className="absolute top-4 right-4 bg-white/20 p-1 rounded-full">
                        <Check className="h-4 w-4 text-on-primary" />
                      </div>
                    )}
                  </Card>
                ))}
                <Card 
                  onClick={() => navigate("/pet/register")}
                  className="p-6 rounded-[2rem] border-2 border-dashed border-outline-variant/40 bg-transparent hover:bg-surface-container/30 transition-all cursor-pointer flex items-center justify-center gap-3 text-outline group"
                >
                  <Plus className="h-6 w-6 group-hover:text-primary transition-colors" />
                  <span className="font-bold group-hover:text-primary transition-colors">Añadir Mascota</span>
                </Card>
              </div>
            </div>
            
            <Button 
              disabled={!selectedPetId}
              onClick={nextStep} 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 transition-all scale-100 active:scale-95"
            >
              Siguiente: Fecha y Hora
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Consulta General</h4>
                <p className="text-xs text-on-surface-variant font-medium">Revisión para <span className="text-primary font-bold">{selectedPet?.name}</span></p>
              </div>
            </div>

            <Card className="p-8 rounded-[2.5rem] bg-white border-none shadow-xl space-y-10">
               <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-outline mb-4 block">1. Selecciona el Día</Label>
                  <input 
                    type="date" 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-2xl p-6 text-lg font-bold text-on-surface shadow-inner focus:ring-2 focus:ring-primary"
                  />
               </div>

               <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-outline mb-4 block">2. Horarios Disponibles</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map(t => {
                      const isTaken = appointments.some(app => app.date === selectedDate && app.time === t);
                      return (
                        <button 
                          key={t}
                          disabled={isTaken}
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "py-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden",
                            selectedTime === t ? "bg-primary text-on-primary shadow-lg scale-105" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant",
                            isTaken && "opacity-30 cursor-not-allowed grayscale bg-surface-container-highest"
                          )}
                        >
                          {t}
                          {isTaken && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                              <XCircle className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
               </div>
            </Card>
            <Button 
              disabled={!selectedDate || !selectedTime}
              onClick={handleConfirm} 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-[2rem] font-bold text-xl shadow-xl shadow-primary/20 transition-all scale-100 active:scale-95"
            >
              Confirmar Cita
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
            <div className="bg-primary/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-on-surface">Reserva Confirmada</h3>
              <p className="text-on-surface-variant text-lg">Hemos bloqueado este horario para {selectedPet?.name}.</p>
            </div>

            <Card className="max-w-sm mx-auto p-8 rounded-[2.5rem] bg-surface-container-low border-none shadow-sm space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                      <img src={selectedPet?.image} alt={selectedPet?.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Paciente</p>
                      <p className="font-bold text-on-surface">{selectedPet?.name}</p>
                   </div>
                </div>
                <SummaryItem icon={CalendarIcon} label="Fecha" value={selectedDate} />
                <SummaryItem icon={Clock} label="Horario" value={selectedTime} />
                <SummaryItem icon={MapPin} label="Ubicación" value="Petly Clínica Central" />
              </div>
            </Card>

            <div className="pt-6">
               <Button onClick={() => navigate("/client")} className="w-full max-w-sm bg-primary hover:bg-primary/90 text-on-primary py-10 rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all scale-100 active:scale-95">
                  Volver al Inicio
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{label}</p>
        <p className="font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Plus, XCircle } from "lucide-react";
