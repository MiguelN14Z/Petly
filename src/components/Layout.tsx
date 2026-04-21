import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { PawPrint, User, Stethoscope, Key, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "../store/useAuthStore";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Define navigation items per role
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'admin':
        return [
          { label: "Mascotas", icon: PawPrint, path: "/client" },
          { label: "Pacientes", icon: Stethoscope, path: "/patients" },
          { label: "Calendario", icon: Calendar, path: "/calendar" },
          { label: "Acceso", icon: Key, path: "/access" },
          { label: "Perfil", icon: User, path: "/profile" },
        ];
      case 'vet':
        return [
          { label: "Pacientes", icon: Stethoscope, path: "/patients" },
          { label: "Calendario", icon: Calendar, path: "/calendar" },
          { label: "Perfil", icon: User, path: "/profile" },
        ];
      case 'user':
      default:
        return [
          { label: "Mascotas", icon: PawPrint, path: "/client" },
          { label: "Calendario", icon: Calendar, path: "/calendar" },
          { label: "Perfil", icon: User, path: "/profile" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background font-body text-on-surface pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(navItems[0].path)}
          >
            <Avatar className="h-10 w-10 border-2 border-primary-fixed">
              <AvatarImage src={currentUser.image || `https://picsum.photos/seed/${currentUser.id}/100`} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col -space-y-1">
              <span className="font-headline text-lg font-bold tracking-tight text-primary">Petly</span>
              <span className="text-[9px] font-black uppercase text-outline tracking-widest">{currentUser.role}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
             {navItems.map((item) => (
               <button
                 key={item.path}
                 onClick={() => navigate(item.path)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                   location.pathname === item.path ? "bg-primary/10 text-primary" : "text-outline hover:bg-surface-container-low"
                 )}
               >
                 {item.label}
               </button>
             ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-8">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 md:hidden">
        <nav className="flex w-full max-w-sm items-center justify-around rounded-[2rem] bg-white p-2 shadow-2xl border border-outline-variant/10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl px-5 py-3 transition-all duration-300",
                  isActive 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "text-outline hover:bg-surface-container-low"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
