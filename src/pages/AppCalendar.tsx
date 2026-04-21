import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, PawPrint, User, MoreVertical, CheckCircle2, XCircle, Clock4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePetStore, Appointment, Pet } from "../store/usePetStore";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function AppCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { appointments, pets, updateAppointment, removeAppointment } = usePetStore();
  const { currentUser } = useAuthStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Filter appointments based on user role
  const userAppointments = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin' || currentUser.role === 'vet') {
      return appointments;
    }
    // For regular users, only show appointments for their own pets
    const myPetIds = pets.filter(p => p.ownerId === currentUser.id).map(p => p.id);
    return appointments.filter(app => myPetIds.includes(app.petId));
  }, [appointments, currentUser, pets]);

  const getAppointmentsForDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return userAppointments.filter(app => app.date === dateStr);
  };

  const selectedDayApps = getAppointmentsForDay(currentDate);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Calendario de Citas</h2>
          <p className="text-on-surface-variant text-lg">Gestiona el flujo de pacientes y horarios médicos.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-outline-variant/10">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl h-10 w-10">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="px-4 font-bold text-sm min-w-[140px] text-center uppercase tracking-widest">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl h-10 w-10">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day Grid */}
        <Card className="lg:col-span-7 p-6 rounded-[2.5rem] bg-white border-none shadow-xl">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="text-center py-2 text-[10px] font-black uppercase text-outline tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Pad the start of month */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const dayApps = getAppointmentsForDay(day);
              const isSelected = isSameDay(day, currentDate);
              const active = isToday(day);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => setCurrentDate(day)}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all group border-2",
                    isSelected ? "bg-primary border-primary shadow-lg shadow-primary/20 scale-105" : "bg-surface-container-low border-transparent hover:border-primary/30",
                    active && !isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    isSelected ? "text-on-primary" : "text-on-surface"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayApps.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayApps.slice(0, 3).map((_, i) => (
                        <div key={i} className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-primary")} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Appointment List for Selected Day */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-xl text-on-surface">
              {isToday(currentDate) ? "Hoy" : format(currentDate, "d 'de' MMMM", { locale: es })}
            </h3>
            <Badge className="bg-primary/10 text-primary border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
              {selectedDayApps.length} Citas
            </Badge>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {selectedDayApps.length > 0 ? (
                selectedDayApps.map((app, idx) => (
                  <AppointmentCard 
                    key={app.id} 
                    appointment={app} 
                    pets={pets} 
                    index={idx} 
                    onCancel={() => removeAppointment(app.id)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center p-12 bg-surface-container-low rounded-[2rem] border-2 border-dashed border-outline-variant/20 text-center space-y-4"
                >
                  <CalendarIcon className="h-10 w-10 text-outline/50" />
                  <p className="text-on-surface-variant font-bold text-sm">No hay citas para este día</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  pets: Pet[];
  index: number;
  onCancel: () => void;
  key?: string;
}

function AppointmentCard({ appointment, pets, index, onCancel }: AppointmentCardProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const pet = pets.find(p => p.id === appointment.petId);

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700"
  };

  const statusIcons = {
    pending: Clock4,
    confirmed: CheckCircle2,
    cancelled: XCircle
  };

  const Icon = statusIcons[appointment.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className={cn(
          "p-5 rounded-3xl bg-white border-none shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer",
          appointment.status === 'cancelled' && "opacity-60"
        )}
        onClick={() => {
          const prefix = (currentUser?.role === 'vet' || currentUser?.role === 'admin') ? '/vet/pet' : '/pet';
          navigate(`${prefix}/history/${appointment.petId}`);
        }}
      >
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
          appointment.status === 'confirmed' ? "bg-emerald-500" : 
          appointment.status === 'cancelled' ? "bg-rose-500" : "bg-amber-500"
        )} />
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span className="font-black text-sm tracking-tighter">{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("border-none px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest", statusColors[appointment.status])}>
              <Icon className="h-3 w-3 mr-1" />
              {appointment.status === 'confirmed' ? 'Confirmada' : 
               appointment.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
            </Badge>
            {appointment.status !== 'cancelled' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-lg text-rose-500 hover:bg-rose-50 px-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 border-surface-container">
            <img 
              src={pet?.image || `https://picsum.photos/seed/${appointment.petId}/200`} 
              alt={pet?.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-on-surface truncate">{pet?.name || "Paciente"}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-outline-variant/30 text-on-surface-variant font-medium">
                {pet?.breed}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-outline-variant/40" />
              <span className="text-[10px] text-on-surface-variant font-medium truncate">{appointment.type}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-outline hover:text-primary">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
