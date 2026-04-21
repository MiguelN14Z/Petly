import React, { useState } from "react";
import { Shield, Search, UserCheck, ShieldCheck, Mail, Phone, Settings, ShieldAlert, Key, Stethoscope, User, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuthStore, UserProfile } from "../store/useAuthStore";

export default function AccessControl() {
  const { users, currentUser, updateUserRole, removeUser, adminUpdateUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleRole = (userId: string, currentRole: UserProfile['role']) => {
    const roles: UserProfile['role'][] = ['user', 'vet', 'admin'];
    const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length;
    updateUserRole(userId, roles[nextIndex]);
  };

  const startEditing = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditData({ name: user.name, email: user.email, phone: user.phone });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditData({});
  };

  const saveEdit = (userId: string) => {
    adminUpdateUser(userId, editData);
    setEditingUserId(null);
    setEditData({});
  };

  const handleDelete = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta.");
      return;
    }
    if (confirm(`¿Estás seguro de que deseas eliminar la cuenta de ${userName}?`)) {
      removeUser(userId);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Control de Acceso</h1>
          <p className="text-on-surface-variant max-w-lg text-lg">
            Gestione los permisos del sistema y las jerarquías de usuarios desde un panel centralizado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm flex items-center gap-2 border border-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Modo Root: Activo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Role Quick Reference */}
        <div className="md:col-span-4 space-y-6">
          <RoleInfoCard 
            icon={ShieldAlert} 
            label="Admin" 
            desc="Control total. Acceso a esta pantalla y configuraciones globales." 
            color="text-secondary"
          />
          <RoleInfoCard 
            icon={Stethoscope} 
            label="Vet" 
            desc="Acceso a pacientes, historial clínico y panel personal." 
            color="text-primary"
          />
          <RoleInfoCard 
            icon={User} 
            label="User" 
            desc="Acceso básico a sus propias mascotas y citas." 
            color="text-tertiary"
          />
        </div>

        {/* User List Table */}
        <div className="md:col-span-8">
          <Card className="rounded-[2.5rem] overflow-hidden bg-white border-none shadow-xl">
            <div className="p-8 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-xl font-headline">Directorio de Cuentas</h3>
              <div className="bg-surface-container-high px-6 py-3 rounded-full flex items-center gap-3 w-full sm:w-auto">
                <Search className="h-4 w-4 text-outline" />
                <input 
                  className="bg-transparent border-none focus:ring-0 text-sm w-full sm:w-40" 
                  placeholder="Buscar usuario..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/30">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline">Usuario</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline">Rol Sistema</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={cn(
                      "hover:bg-surface-container-low transition-colors",
                      user.id === currentUser?.id && "bg-primary/5"
                    )}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={user.image || `https://picsum.photos/seed/${user.id}/100/100`} alt={user.name} className="w-12 h-12 rounded-2xl shadow-sm" />
                          <div className="flex-1">
                            {editingUserId === user.id ? (
                              <div className="space-y-2">
                                <Input 
                                  value={editData.name} 
                                  onChange={e => setEditData({...editData, name: e.target.value})}
                                  className="h-8 py-1 px-2 text-sm"
                                  placeholder="Nombre"
                                />
                                <Input 
                                  value={editData.email} 
                                  onChange={e => setEditData({...editData, email: e.target.value})}
                                  className="h-8 py-1 px-2 text-sm"
                                  placeholder="Email"
                                />
                              </div>
                            ) : (
                              <>
                                <p className="font-bold text-sm flex items-center gap-2">
                                  {user.name}
                                  {user.id === currentUser?.id && <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase px-2">Tú</Badge>}
                                </p>
                                <p className="text-[10px] text-on-surface-variant font-medium">{user.email}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn(
                          "px-4 py-1 rounded-full text-[10px] font-bold border-none cursor-pointer",
                          user.role === "admin" ? "bg-secondary-fixed text-on-secondary-fixed-variant" :
                          user.role === "vet" ? "bg-primary-fixed text-on-primary-fixed-variant" :
                          "bg-surface-container-highest text-on-surface-variant"
                        )} onClick={() => handleToggleRole(user.id, user.role)}>
                          {user.role?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {editingUserId === user.id ? (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => saveEdit(user.id)} className="text-primary hover:bg-primary/10 h-8 w-8">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={cancelEditing} className="text-outline hover:bg-surface-container h-8 w-8">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => startEditing(user)} className="text-primary hover:bg-primary/10 h-8 w-8">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {user.id !== currentUser?.id && (
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id, user.name)} className="text-error hover:bg-error/10 h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoleInfoCard({ icon: Icon, label, desc, color }: { icon: any; label: string; desc: string; color: string }) {
  return (
    <Card className="p-6 rounded-[2rem] bg-white border-none shadow-sm flex gap-4 items-start">
      <div className={cn("p-3 rounded-2xl bg-surface-container-low", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-bold text-lg mb-1">{label}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">{desc}</p>
      </div>
    </Card>
  );
}
