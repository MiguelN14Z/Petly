import React from "react";
import { Plus, Cake, Weight, ArrowRight, Calendar, Syringe, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { usePetStore } from "../store/usePetStore";
import { useAuthStore } from "../store/useAuthStore";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { pets, removePet, records } = usePetStore();
  const { currentUser } = useAuthStore();

  const filteredPets = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'user') {
      return pets.filter(p => p.ownerId === currentUser.id);
    }
    return pets; // Staff and Admin see all
  }, [pets, currentUser]);

  const featuredPet = filteredPets.find(p => p.featured) || filteredPets[0];
  const otherPets = filteredPets.filter(p => p.id !== (featuredPet?.id));

  // Function to get the latest weight from records or fallback to pet weight
  const getLatestWeight = (petId: string, defaultWeight: string) => {
    const petRecords = records.filter(r => r.petId === petId && r.weight).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (petRecords.length > 0) {
      const w = petRecords[0].weight || "";
      return w.toLowerCase().includes("kg") ? w : `${w} kg`;
    }
    return defaultWeight;
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <span className="text-teal-700 font-bold tracking-widest text-[10px] uppercase mb-2 block">Gestión de Mascotas</span>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Mis Mascotas</h2>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate("/appointment/schedule")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5 px-6 py-6 rounded-xl font-bold transition-all"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Programar Cita
          </Button>
          <Button 
            onClick={() => navigate("/pet/register")}
            className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-6 rounded-xl font-bold shadow-[0_4px_0_0_rgba(0,40,35,1)] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nueva Mascota
          </Button>
        </div>
      </div>

      {/* Bento Grid - Uniform size version */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPets.map((pet, idx) => (
          <motion.div 
            key={pet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Card className="rounded-[2.5rem] overflow-hidden p-8 flex flex-col h-full shadow-xl border-none bg-white relative group min-h-[400px]">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removePet(pet.id)}
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error/10 hover:text-error rounded-xl z-20"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-3xl font-black text-on-surface tracking-tighter">{pet.name}</h3>
                  <Badge variant="outline" className="text-[9px] font-black uppercase opacity-60 rounded-full border-outline-variant/30">ID: {pet.id}</Badge>
                </div>
                <p className="text-on-surface-variant font-medium text-sm mb-4">{pet.breed}</p>
                <div className="flex gap-4 text-on-surface-variant font-medium">
                  <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl">
                    <Cake className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{pet.age}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl">
                    <Weight className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{getLatestWeight(pet.id, pet.weight)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/20">
                <Button 
                  onClick={() => navigate(`/pet/history/${pet.id}`)}
                  className="w-full bg-secondary-fixed-dim hover:bg-secondary-container text-on-secondary-fixed font-bold py-6 rounded-2xl flex items-center justify-center gap-2 transition-colors border-none"
                >
                  Ver Historial de Salud
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
