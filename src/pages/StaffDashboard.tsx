import React from "react";
import { CheckCircle, Edit, AlertCircle, Bell, Package, Mail, ShieldCheck, History, LogOut, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  return (
    <div className="space-y-12">
      {/* Profile Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">Centro Veterinario</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Panel de Control Médico</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary-fixed px-4 py-2 rounded-full shadow-sm">
            <CheckCircle className="h-5 w-5 text-on-primary-fixed-variant fill-current" />
            <span className="text-on-primary-fixed-variant font-semibold text-sm">Estado de Autenticación: Activo</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Details Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-12"
        >
          <Card className="rounded-[2rem] p-8 bg-white border-none shadow-xl h-full">
            <div className="flex items-start justify-between mb-8">
              <h3 className="text-xl font-bold text-on-surface">Identidad del Perfil</h3>
              <Button onClick={() => navigate("/profile")} variant="link" className="text-secondary text-sm font-semibold flex items-center gap-1 p-0 h-auto">
                Editar <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <DetailItem label="Nombre Legal" value={currentUser.name} />
              <DetailItem label="Correo Electrónico" value={currentUser.email} />
              <DetailItem label="Rol del Sistema" value={currentUser.role.toUpperCase()} />
              <DetailItem label="Teléfono" value={currentUser.phone || "No registrado"} />
            </div>
          </Card>
        </motion.div>

        {/* Status Section */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white p-6 rounded-2xl flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md transition-all h-full" onClick={() => navigate("/profile")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                  <User className="h-6 w-6 text-outline" />
                </div>
                <div>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Ajustes</p>
                  <p className="text-sm font-semibold">Gestionar mi Perfil</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" />
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button 
              onClick={() => navigate("/")}
              className="w-full h-full bg-error-container hover:bg-error hover:text-white p-6 rounded-2xl flex items-center justify-center gap-3 text-on-error-container font-bold transition-all border-none shadow-sm min-h-[80px]"
            >
              <LogOut className="h-6 w-6" />
              <span>Cerrar Sesión</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-outline uppercase tracking-widest">{label}</label>
      <p className="text-lg font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function ControlItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm", !active && "opacity-60")}>
      <div className="flex items-center gap-3">
        <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-outline")} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Switch checked={active} />
    </div>
  );
}

import { cn } from "@/lib/utils";
