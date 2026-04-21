import React from "react";
import { ArrowLeft, Stethoscope, Calendar, Activity, ClipboardList, Syringe, MessageSquare, ClipboardX, Info, PlusCircle, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { usePetStore } from "../store/usePetStore";

const ICON_MAP = {
  stethoscope: Stethoscope,
  syringe: Syringe,
  activity: Activity,
  clipboard: ClipboardList
};

export default function HealthHistory() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const location = useLocation();
  const pets = usePetStore(state => state.pets);
  const records = usePetStore(state => state.records);
  const pet = pets.find(p => p.id === petId);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const isStaffMode = location.pathname.startsWith('/vet');

  const history = records.filter(r => r.petId === petId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 2000);
  };

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Mascota no encontrada</h2>
        <Button onClick={() => navigate("/client")}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Historial de Salud</h2>
            <p className="text-on-surface-variant text-lg">{pet.name} ({pet.breed})</p>
          </div>
        </div>
        {isStaffMode && (
          <Button 
            onClick={() => navigate(`/vet/add-record/${pet.id}`)}
            className="bg-secondary hover:bg-secondary/90 text-on-secondary px-6 py-6 rounded-xl font-bold flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Nuevo Registro
          </Button>
        )}
      </section>

      {/* Timeline Layout */}
      <div className="relative space-y-8">
        {history.length > 0 && <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-outline-variant/30 hidden md:block" />}

        {history.length > 0 ? (
          history.map((entry, idx) => {
            const Icon = ICON_MAP[entry.iconType as keyof typeof ICON_MAP] || Stethoscope;
            return (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col md:flex-row gap-8"
              >
                {/* Icon Marker */}
                <div className="z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg border border-outline-variant/10 shrink-0 self-start md:self-auto">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                {/* Card Content */}
                <Card className="flex-1 rounded-[2rem] p-8 bg-white border-none shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-secondary font-bold text-xs uppercase tracking-widest leading-none">{entry.date}</span>
                      <h3 className="text-xl font-bold text-on-surface">{entry.type}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
                      <UserCircle className="h-4 w-4 text-outline" />
                      <span className="text-xs font-semibold text-on-surface-variant">{entry.doctor}</span>
                    </div>
                  </div>
                  
                  <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
                    {entry.notes}
                  </p>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => navigate(`/pet/report/${entry.id}`)}
                      variant="outline" 
                      className="rounded-xl px-4 py-2 border-outline-variant/20 hover:bg-surface-container transition-colors h-auto text-sm group-hover:border-primary/30"
                    >
                      <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                      Informe
                    </Button>
                    {isStaffMode && (
                      <Button 
                        onClick={() => navigate(`/vet/edit-record/${entry.id}`)}
                        variant="ghost"
                        className="text-secondary hover:bg-secondary/5 rounded-xl px-4 py-2 h-auto text-sm font-bold"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-[3rem] space-y-4"
          >
            <div className="bg-white p-6 rounded-full shadow-inner">
               <ClipboardX className="h-12 w-12 text-outline" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface">Sin Registros Médicos</h3>
            <p className="text-on-surface-variant max-w-xs text-center">
              Aún no hay visitas registradas para {pet.name}. Los informes aparecerán aquí tras su primera consulta.
            </p>
          </motion.div>
        )}
      </div>

      {/* Wellness Summary Footer (Only if history exists) */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-12"
        >
          <Card className="bg-primary text-on-primary rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-3xl">
            <div className="bg-white/20 p-6 rounded-[2rem] shadow-inner shrink-0 rotate-3">
              <Activity className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black">Resumen del Estado General</h3>
              <p className="opacity-90 text-lg max-w-2xl leading-relaxed">
                La mascota se encuentra en un estado excepcional. Todos los indicadores vitales están dentro de los rangos normales. Próxima revisión programada para Diciembre 2024.
              </p>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="bg-white text-primary font-bold px-8 py-6 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg h-auto disabled:opacity-70"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Generando PDF...
                  </div>
                ) : (
                  "Descargar PDF del Historial"
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

import { UserCircle } from "lucide-react";
