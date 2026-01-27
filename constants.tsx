
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Stethoscope, 
  Truck, 
  Settings, 
  TrendingUp, 
  Baby,
  Activity
} from 'lucide-react';
import { Animal, AnimalType, AnimalCategory, HealthStatus, Listing, HealthRecord, ReproductionRecord } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'marketplace', label: 'Compraventa', icon: <ShoppingBag size={20} /> },
  { id: 'herd', label: 'Mi Hato', icon: <Activity size={20} /> },
  { id: 'health', label: 'Sanidad', icon: <Stethoscope size={20} /> },
  { id: 'reproduction', label: 'Reproducción', icon: <Baby size={20} /> },
  { id: 'logistics', label: 'Logística', icon: <Truck size={20} /> },
  { id: 'reports', label: 'Reportes', icon: <TrendingUp size={20} /> },
];

export const MOCK_ANIMALS: Animal[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  tagId: `RFID-${9000 + i}`,
  type: i % 4 === 0 ? AnimalType.PORCINO : AnimalType.BOVINO,
  breed: i % 3 === 0 ? 'Angus' : (i % 3 === 1 ? 'Holstein' : 'Jersey'),
  age: 12 + (i * 2),
  weight: 300 + (i * 10),
  sex: i % 2 === 0 ? 'M' : 'F',
  category: i % 5 === 0 ? AnimalCategory.REPRODUCTOR : (i % 5 === 1 ? AnimalCategory.LECHERIA : AnimalCategory.ENGORDE),
  healthStatus: i % 6 === 0 ? HealthStatus.EN_TRATAMIENTO : HealthStatus.EXCELENTE,
  location: i % 2 === 0 ? 'Buenos Aires, AR' : 'Córdoba, AR',
  imageUrl: `https://picsum.photos/seed/animal${i}/400/300`
}));

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  { id: 'h1', animalId: '1', date: '2023-09-15', type: 'Vacunación', description: 'Antiaftosa Anual', veterinarian: 'Dr. Rossi' },
  { id: 'h2', animalId: '1', date: '2023-10-20', type: 'Desparasitación', description: 'Control de parásitos internos', veterinarian: 'Dr. Rossi' },
  { id: 'h3', animalId: '2', date: '2023-11-05', type: 'Tratamiento', description: 'Tratamiento por mastitis leve', veterinarian: 'Dra. Mendez' },
];

export const MOCK_REPRODUCTION_RECORDS: ReproductionRecord[] = [
  { id: 'r1', animalId: '2', date: '2023-08-10', event: 'Inseminación', result: 'Positivo', notes: 'Semen de toro premiado' },
  { id: 'r2', animalId: '2', date: '2023-09-01', event: 'Palpación', result: 'Gestante', notes: 'Confirmado por ecografía' },
  { id: 'r3', animalId: '4', date: '2023-12-15', event: 'Parto', result: 'Exitoso', notes: 'Ternero macho, 35kg' },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    ...MOCK_ANIMALS[0],
    sellerId: 'u1',
    sellerName: 'Estancia La Linda',
    sellerRating: 4.8,
    description: 'Novillo Angus de excelente genética, listo para engorde final.',
    status: 'Activo',
    datePublished: '2023-10-25',
    price: 1200
  },
  {
    ...MOCK_ANIMALS[1],
    sellerId: 'u2',
    sellerName: 'Cabaña El Ombú',
    sellerRating: 4.9,
    description: 'Vaca Holstein de alta producción lechera. 2da lactancia.',
    status: 'Activo',
    datePublished: '2023-10-26',
    price: 2500
  }
];
