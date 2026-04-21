import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  image: string;
  ownerId?: string;
  featured?: boolean;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  type: string;
  notes: string;
  doctor: string;
  weight?: string;
  temperature?: string;
  iconType: 'stethoscope' | 'syringe' | 'activity' | 'clipboard';
}

export interface Appointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface PetStore {
  pets: Pet[];
  records: MedicalRecord[];
  appointments: Appointment[];
  addPet: (pet: Omit<Pet, 'id' | 'image'>) => void;
  updatePet: (id: string, petData: Partial<Pet>) => void;
  removePet: (id: string) => void;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateRecord: (id: string, recordData: Partial<MedicalRecord>) => void;
  removeRecord: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
}

const INITIAL_PETS: Pet[] = [
  {
    id: "123456789",
    name: "Barnaby",
    breed: "Golden Retriever",
    age: "3 Años",
    weight: "28.4 kg",
    image: "https://picsum.photos/seed/barnaby/400/400",
    ownerId: "u1",
    featured: true,
  },
  {
    id: "987654321",
    name: "Luna",
    breed: "Común Europeo",
    age: "5 Años",
    weight: "4.2 kg",
    image: "https://picsum.photos/seed/luna/400/400",
    ownerId: "u1",
  },
  {
    id: "456789123",
    name: "Cooper",
    breed: "Jack Russell Terrier",
    age: "8 Años",
    weight: "8.1 kg",
    image: "https://picsum.photos/seed/cooper/400/400",
    ownerId: "u1",
  },
];

const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: "100000001",
    petId: "123456789",
    date: "12 Mar 2024",
    type: "Consulta General",
    notes: "Revisión anual, peso estable, pelaje en buen estado. Se recomienda limpieza dental.",
    doctor: "Dr. Julian Thorne",
    weight: "28.4",
    temperature: "38.5",
    iconType: 'stethoscope'
  },
  {
    id: "100000002",
    petId: "123456789",
    date: "05 Feb 2024",
    type: "Vacunación",
    notes: "Administración de vacuna polivalente. Sin reacciones adversas reportadas.",
    doctor: "Dra. Elena K.",
    weight: "28.1",
    temperature: "38.2",
    iconType: 'syringe'
  },
  {
    id: "100000003",
    petId: "123456789",
    date: "10 Ene 2024",
    type: "Tratamiento",
    notes: "Tratamiento para alergia cutánea. Mejora notable en 7 días.",
    doctor: "Dr. Julian Thorne",
    weight: "27.8",
    temperature: "39.1",
    iconType: 'activity'
  },
  {
    id: "100000004",
    petId: "987654321",
    date: "20 Mar 2024",
    type: "Chequeo Felino",
    notes: "Peso óptimo. Oídos limpios. Comportamiento normal.",
    doctor: "Dra. Elena K.",
    weight: "4.2",
    temperature: "38.8",
    iconType: 'stethoscope'
  },
  {
    id: "100000005",
    petId: "456789123",
    date: "15 Mar 2024",
    type: "Control de Parásitos",
    notes: "Aplicación de desparasitante interno. Siguiente dosis en 3 meses.",
    doctor: "Dr. Julian Thorne",
    weight: "8.1",
    temperature: "38.4",
    iconType: 'activity'
  }
];

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      pets: INITIAL_PETS,
      records: INITIAL_RECORDS,
      addPet: (petData) => set((state) => ({
        pets: [
          ...state.pets,
          {
            ...petData,
            id: Math.floor(100000000 + Math.random() * 900000000).toString(),
            image: `https://picsum.photos/seed/${petData.name}/400/400`,
            featured: state.pets.length === 0,
          }
        ]
      })),
      updatePet: (id, petData) => set((state) => ({
        pets: state.pets.map(p => p.id === id ? { ...p, ...petData } : p)
      })),
      removePet: (id) => set((state) => {
        const newPets = state.pets.filter((p) => p.id !== id);
        if (newPets.length > 0 && !newPets.some(p => p.featured)) {
          newPets[0].featured = true;
        }
        return { pets: newPets };
      }),
      addRecord: (recordData) => set((state) => ({
        records: [
          ...state.records,
          {
            ...recordData,
            id: Math.floor(100000000 + Math.random() * 900000000).toString(),
          }
        ]
      })),
      updateRecord: (id, recordData) => set((state) => ({
        records: state.records.map(r => r.id === id ? { ...r, ...recordData } : r)
      })),
      removeRecord: (id) => set((state) => ({
        records: state.records.filter(r => r.id !== id)
      })),
      appointments: [],
      addAppointment: (appointmentData) => set((state) => ({
        appointments: [
          ...state.appointments,
          {
            ...appointmentData,
            id: Math.floor(100000000 + Math.random() * 900000000).toString(),
            status: 'confirmed',
          }
        ]
      })),
      updateAppointment: (id, appointmentData) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...appointmentData } : a)
      })),
      removeAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter(a => a.id !== id)
      })),
    }),
    {
      name: 'pet-storage',
    }
  )
);
