import React from "react";
import { ArrowLeft, FileText, Download, Calendar, User, Clipboard, Stethoscope, Activity, ClipboardX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { usePetStore } from "../store/usePetStore";

export default function MedicalReport() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const records = usePetStore(state => state.records);
  const pets = usePetStore(state => state.pets);
  
  const record = records.find(r => r.id === reportId);
  const pet = record ? pets.find(p => p.id === record.petId) : null;

  if (!record || !pet) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <ClipboardX className="h-16 w-16 text-outline mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Informe no encontrado</h2>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <section className="flex items-center gap-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white shadow-sm border border-outline-variant/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-on-surface">Informe Clínico</h2>
          <p className="text-on-surface-variant text-lg">Registro ID: <span className="font-bold text-primary">#{record.id}</span></p>
        </div>
      </section>

      {/* Main Report Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-[3rem] p-10 bg-white border-none shadow-2xl relative overflow-hidden">
          {/* Watermark/Icon Decor */}
          <FileText className="absolute -right-10 -top-10 w-48 h-48 text-surface-container opacity-50" />

          <div className="relative z-10 space-y-10">
            {/* Metadata Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-outline-variant/10 pb-10">
              <MetadataItem icon={Calendar} label="Fecha" value={record.date} />
              <MetadataItem icon={User} label="Paciente" value={pet.name} />
              <MetadataItem icon={Stethoscope} label="Médico" value={record.doctor} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Estado</span>
                <Badge className="bg-primary/10 text-primary border-none w-fit font-bold">Completado</Badge>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Clipboard className="h-5 w-5" />
                  <h3 className="font-black text-xl">Motivo y Descripción</h3>
                </div>
                <p className="text-on-surface-variant leading-relaxed text-lg font-medium">
                  {record.type}
                </p>
              </section>

              <section className="space-y-3 p-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/5">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Activity className="h-5 w-5" />
                  <h3 className="font-black text-xl font-headline italic uppercase tracking-tight">Observaciones Médicas</h3>
                </div>
                <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-wrap">
                  {record.notes}
                </p>
              </section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ObservationItem label="Peso en Consulta" value={record.weight ? `${record.weight} kg` : "No registrado"} status="Medido" />
                <ObservationItem label="Temperatura" value={record.temperature ? `${record.temperature} ºC` : "No registrado"} status="Medido" />
                <ObservationItem label="Especie" value={pet.breed} status="Verificado" />
                <ObservationItem label="Peso Actual" value={pet.weight} status="Registrado" />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6">
              <Button className="w-full bg-primary hover:bg-primary/90 text-on-primary py-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                <Download className="mr-2 h-5 w-5" />
                Descargar Informe Certificado
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-bold text-on-surface">{value}</span>
      </div>
    </div>
  );
}

function ObservationItem({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10">
      <div>
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{label}</p>
        <p className="font-bold text-on-surface">{value}</p>
      </div>
      <Badge variant="outline" className="border-none bg-surface-container text-on-surface-variant text-[10px] font-bold">
        {status}
      </Badge>
    </div>
  );
}
