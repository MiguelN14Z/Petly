import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'vet' | 'user';
  image?: string;
  password?: string;
}

interface AuthStore {
  currentUser: UserProfile | null;
  users: UserProfile[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateUserRole: (userId: string, role: UserProfile['role']) => void;
  updatePassword: (oldPassword: string, newPassword: string) => boolean;
  removeUser: (userId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<UserProfile>) => void;
}

const INITIAL_USERS: UserProfile[] = [
  {
    id: "u1",
    name: "Miguel Alejandro",
    email: "miguelelwexd@gmail.com",
    phone: "+34 600 000 000",
    role: "admin",
    image: "https://picsum.photos/seed/miguel/200/200",
    password: "password123"
  },
  {
    id: "u2",
    name: "Dra. Elena K.",
    email: "elena.k@petly.vet",
    phone: "+34 600 111 222",
    role: "vet",
    image: "https://picsum.photos/seed/elena/200/200",
    password: "password123"
  },
  {
    id: "u3",
    name: "Dr. Julian Thorne",
    email: "julian.v@petly.vet",
    phone: "+34 600 333 444",
    role: "vet",
    image: "https://picsum.photos/seed/julian/200/200",
    password: "password123"
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: INITIAL_USERS,
      isAuthenticated: false,
      login: (email, password) => {
        const state = get();
        const user = state.users.find(u => u.email === email);
        
        // If password is "password123" or matches user password, it's valid
        if (user && (password === "password123" || password === user.password)) {
          // Repair user object if it's missing the password property in localStorage
          if (!user.password) {
            set((s) => {
              const updatedUsers = s.users.map(u => u.id === user.id ? { ...u, password: "password123" } : u);
              const updatedCurrentUser = s.currentUser?.id === user.id ? { ...s.currentUser, password: "password123" } : s.currentUser;
              return { users: updatedUsers, currentUser: updatedCurrentUser };
            });
          }
          
          // Re-fetch user after repair if necessary
          const finalUser = get().users.find(u => u.id === user.id) || user;
          
          set({ isAuthenticated: true, currentUser: finalUser });
          return true;
        }
        return false;
      },
      signup: (name, email, password) => {
        const newUser: UserProfile = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          phone: "",
          role: "user",
          password
        };
        set((state) => ({
          users: [...state.users, newUser],
          isAuthenticated: true,
          currentUser: newUser
        }));
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),
      updateProfile: (profile) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUser = { ...state.currentUser, ...profile };
        return {
          currentUser: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),
      updateUserRole: (userId, role) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, role } : u),
        currentUser: state.currentUser?.id === userId ? { ...state.currentUser, role } : state.currentUser
      })),
      updatePassword: (oldPassword, newPassword) => {
        const state = get();
        if (state.currentUser && oldPassword === state.currentUser.password) {
          const updatedUser = { ...state.currentUser, password: newPassword };
          set({ 
            currentUser: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
          });
          return true;
        }
        return false;
      },
      removeUser: (userId) => set((state) => ({
        users: state.users.filter(u => u.id !== userId),
        currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        isAuthenticated: state.currentUser?.id === userId ? false : state.isAuthenticated
      })),
      adminUpdateUser: (userId, data) => set((state) => {
        const updatedUsers = state.users.map(u => u.id === userId ? { ...u, ...data } : u);
        const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser;
        return {
          users: updatedUsers,
          currentUser: updatedCurrentUser
        };
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
