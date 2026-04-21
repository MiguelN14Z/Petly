import React, { useState } from "react";
import { PawPrint, Search, PlusCircle, Heart, Thermometer, Clock, Edit3, BarChart2, CheckCircle2, User, ChevronRight, ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { usePetStore } from "../store/usePetStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../store/useAuthStore";

export default function PatientDirectory() {
  const navigate = useNavigate();
  const { pets, records, removePet } = usePetStore();
  const { currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const getLatestWeight = (petId: string, defaultWeight: string) => {
    const petRecords = records.filter(r => r.petId === petId && r.weight).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (petRecords.length > 0) {
      const w = petRecords[0].weight || "";
      return w.toLowerCase().includes("kg") ? w : `${w} kg`;
    }
    return defaultWeight;
  };

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-secondary font-bold tracking-wider text-xs uppercase mb-2 block">Centro de Gestión Veterinaria</span>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Directorio de Pacientes</h2>
        </div>
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-8 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all text-lg" 
              placeholder="Buscar por nombre, raza o ID..." 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPets.map((patient, idx) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-white hover:bg-surface-container-low transition-all rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 group border-none shadow-xl relative overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h4 className="text-3xl font-headline font-black text-on-surface">{patient.name}</h4>
                  <Badge className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-secondary-fixed text-on-secondary-fixed-variant border-none">
                    ID: {patient.id}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-on-surface-variant font-bold text-lg">
                  <span className="flex items-center gap-2"><PawPrint className="h-5 w-5 text-primary" /> {patient.breed}</span>
                  <span className="flex items-center gap-2 font-medium opacity-70">Edad: {patient.age}</span>
                  <span className="flex items-center gap-2 font-medium opacity-70">Peso: {getLatestWeight(patient.id, patient.weight)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => navigate(`/vet/pet/history/${patient.id}`)}
                  className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-7 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <ClipboardList className="h-5 w-5" />
                  Ver Historial
                </Button>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate(`/vet/add-record/${patient.id}`)}
                    variant="outline"
                    className="flex-1 border-secondary text-secondary hover:bg-secondary/5 font-bold px-6 py-7 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Nuevo Registro
                  </Button>
                  {(currentUser?.role === 'admin' || currentUser?.role === 'vet') && (
                    <Button 
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar a ${patient.name}?`)) {
                          removePet(patient.id);
                        }
                      }}
                      variant="ghost" 
                      className="aspect-square p-0 rounded-2xl text-error hover:bg-error/10 h-auto px-6 py-7"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredPets.length === 0 && (
          <div className="text-center py-24 bg-surface-container-low rounded-[3rem] border-2 border-dashed border-outline-variant/30">
            <Search className="h-16 w-16 text-outline/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-on-surface">No se encontraron pacientes</h3>
            <p className="text-on-surface-variant max-w-xs mx-auto">Intenta buscar con otros términos o registra nuevas mascotas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
