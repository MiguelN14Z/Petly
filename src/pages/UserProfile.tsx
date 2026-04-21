import React, { useState } from "react";
import { User, Shield, LogOut, Edit, Mail, Phone, ChevronRight, Save, X, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "@/lib/utils";

export default function UserProfile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, updatePassword, logout } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(currentUser ? { ...currentUser } : { name: "", email: "", phone: "", role: "user" as const });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  if (!currentUser) return null;

  const handleUpdateProfile = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    
    if (passData.new !== passData.confirm) {
      setPassError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (updatePassword(passData.old, passData.new)) {
      setPassSuccess(true);
      setPassData({ old: "", new: "", confirm: "" });
      setTimeout(() => {
        setPassSuccess(false);
        setIsChangingPassword(false);
      }, 2000);
    } else {
      setPassError("La contraseña actual es incorrecta.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      {/* Profile Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-2 block">Área de Cliente</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Mi Perfil</h2>
            <p className="text-on-surface-variant text-lg">Gestiona tu información personal y seguridad.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Personal Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-12 lg:col-span-8"
        >
          <Card className="rounded-[2.5rem] p-8 bg-white border-none shadow-xl h-full">
            <div className="flex items-start justify-between mb-8">
              <h3 className="text-2xl font-black text-on-surface">Información Personal</h3>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="ghost" 
                  className="text-primary hover:bg-primary/5 text-sm font-bold flex items-center gap-2 rounded-xl px-4"
                >
                  <Edit className="h-4 w-4" /> Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="ghost" 
                    className="text-outline hover:bg-surface-container-high rounded-xl px-4"
                  >
                    <X className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-primary hover:bg-primary/90 text-on-primary rounded-xl px-4 font-bold"
                  >
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditField 
                    label="Nombre Completo" 
                    value={editData.name} 
                    onChange={(v) => setEditData({ ...editData, name: v })}
                    icon={User}
                  />
                  <EditField 
                    label="Correo Electrónico" 
                    value={editData.email} 
                    onChange={(v) => setEditData({ ...editData, email: v })}
                    icon={Mail}
                  />
                  <EditField 
                    label="Teléfono de Contacto" 
                    value={editData.phone} 
                    onChange={(v) => setEditData({ ...editData, phone: v })}
                    icon={Phone}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                  <DetailItem label="Nombre Completo" value={currentUser.name} icon={User} />
                  <DetailItem label="Correo Electrónico" value={currentUser.email} icon={Mail} />
                  <DetailItem label="Teléfono de Contacto" value={currentUser.phone} icon={Phone} />
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Quick Links Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-12 lg:col-span-4"
        >
          <div className="h-full space-y-6">
            <Button 
              onClick={() => setIsChangingPassword(true)}
              variant="outline"
              className="w-full bg-secondary-container/10 p-6 rounded-[2rem] flex items-center justify-between shadow-sm border border-secondary-container/20 hover:shadow-md transition-all group min-h-[100px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
                  <Shield className="h-6 w-6 text-on-secondary-fixed-variant" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Seguridad</p>
                  <p className="text-sm font-bold text-on-surface">Cambiar Contraseña</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              onClick={handleLogout}
              className="w-full bg-error-container hover:bg-error hover:text-white p-6 rounded-[2rem] flex items-center justify-center gap-3 text-on-error-container font-black transition-all border-none shadow-sm min-h-[100px]"
            >
              <LogOut className="h-6 w-6" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => !passSuccess && setIsChangingPassword(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              {passSuccess ? (
                <div className="py-12 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">¡Contraseña Cambiada!</h3>
                    <p className="text-on-surface-variant font-medium">Tu seguridad se ha actualizado con éxito.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-on-surface flex items-center gap-3">
                      <Lock className="h-6 w-6 text-primary" /> Cambiar Contraseña
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsChangingPassword(false)} className="rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    {passError && (
                      <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
                        {passError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Contraseña Actual</Label>
                      <Input 
                        type="password" 
                        required 
                        value={passData.old} 
                        onChange={e => setPassData({...passData, old: e.target.value})}
                        className="h-14 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Nueva Contraseña</Label>
                      <Input 
                        type="password" 
                        required 
                        value={passData.new} 
                        onChange={e => setPassData({...passData, new: e.target.value})}
                        className="h-14 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">Confirmar Nueva Contraseña</Label>
                      <Input 
                        type="password" 
                        required 
                        value={passData.confirm} 
                        onChange={e => setPassData({...passData, confirm: e.target.value})}
                        className="h-14 bg-surface-container-low border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-on-primary rounded-2xl font-bold text-lg shadow-xl mt-4">
                      Actualizar Contraseña
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-5">
      <div className="p-4 bg-surface-container-low rounded-2xl shadow-sm">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mb-1">{label}</label>
        <p className="text-xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; icon: any }) {
  return (
    <div className="space-y-2">
      <Label className="ml-1 font-bold text-xs uppercase tracking-widest text-outline">{label}</Label>
      <div className="relative">
        <Input 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="h-14 pl-12 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary shadow-inner font-bold"
        />
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
      </div>
    </div>
  );
}
