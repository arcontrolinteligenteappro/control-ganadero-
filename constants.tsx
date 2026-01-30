
import React from 'react';
import { 
  LayoutDashboard, Activity, Wallet, Map, UserCheck, Sparkles,
  Briefcase, Microscope, ShoppingBag
} from 'lucide-react';
import { 
  Animal, AnimalType, AnimalCategory, HealthStatus, Listing, 
  HealthRecord, Client, Transaction, 
  BusinessConfig, Paddock, Employee, FarmEvent, Veterinarian, Note,
  PaddockLog, ReproductionRecord
} from './types';

export const MOCK_BUSINESS_CONFIG: BusinessConfig = {
  name: "RANCHO LOS ÁNGELES PRO",
  address: "Región Costa Norte, Nayarit",
  phone: "+52 311 000 0000",
  taxId: "GAN-MX-951010-AR1",
  receiptNote: "Genética de Calidad y Manejo Sustentable"
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Mando Central', icon: <LayoutDashboard size={20} /> },
  { id: 'ai_consultant', label: 'Consultor IA', icon: <Sparkles size={20} /> },
  { id: 'bio_control', label: 'Bio-Control', icon: <Microscope size={20} />, subItems: ['herd', 'health', 'reproduction'] },
  { id: 'operations', label: 'Operaciones', icon: <Briefcase size={20} />, subItems: ['paddocks', 'hr'] },
  { id: 'business', label: 'Negocios', icon: <Wallet size={20} />, subItems: ['marketplace', 'finances', 'clients'] },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Protocolo de Engorda Verano',
    content: 'Aumentar ración de silo de maíz y sales minerales en Lote Angus.',
    color: '#fee2e2',
    date: '2025-05-20',
    attachments: []
  }
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'Distribuidora Cárnica de Occidente', 
    alias: 'Comprador Gold', 
    role: 'Comprador',
    phone: '311-123-4567', 
    balance: 125000,
    creditLimit: 1000000,
    address: 'Tepic, Nayarit',
    transactionHistory: [
      { id: 'ct1', date: '2025-05-18', amount: 154000, type: 'Cargo', concept: 'Venta Lote Novillos', balanceAfter: 154000, reference: 'V-001' },
      { id: 'ct2', date: '2025-05-19', amount: 29000, type: 'Abono', concept: 'Abono Transferencia', balanceAfter: 125000, reference: 'T-998' }
    ]
  }
];

export const MOCK_PADDOCKS: Paddock[] = [
  { id: 'p1', name: 'Potrero El Águila', capacity: 60, currentCount: 45, status: 'Ocupado', area: '15 Ha', forageType: 'Estrella' },
  { id: 'p2', name: 'Loma del Toro', capacity: 40, currentCount: 0, status: 'Descanso', area: '10 Ha', forageType: 'Brizantha' },
];

export const MOCK_ANIMALS: Animal[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  tagId: `AR-${2000 + i}`,
  type: AnimalType.BOVINO,
  breed: i % 2 === 0 ? 'Brangus' : 'Nelore',
  age: 18 + i,
  weight: 380 + (i * 12),
  sex: i % 3 === 0 ? 'F' : 'M',
  category: i % 4 === 0 ? AnimalCategory.REPRODUCTOR : AnimalCategory.ENGORDE,
  healthStatus: i === 4 ? HealthStatus.EN_TRATAMIENTO : HealthStatus.EXCELENTE,
  location: i % 2 === 0 ? 'Potrero El Águila' : 'Corral de Manejo',
  imageUrl: `https://picsum.photos/seed/ganado${i}/800/600`,
  registrationDate: '2025-02-15',
  price: 2100 + (i * 45)
}));

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  { id: 'hr1', animalId: '5', date: '2025-05-20', type: 'Tratamiento', description: 'Infección cutánea leve', veterinarianId: 'v1', medication: 'Oxitetraciclina', dosage: '20ml IM', progressNotes: 'Mejoría notable en 48h', isEmergency: false },
];

export const MOCK_REPRODUCTION_RECORDS: ReproductionRecord[] = [
  { id: 'rr1', animalId: '1', date: '2025-05-12', event: 'Inseminación Artificial', result: 'Pendiente', notes: 'Semen Toro Campeón 2024' }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Juan Manuel Ríos', position: 'Capatáz de Campo', salary: 4500, frequency: 'Semanal', phone: '311-555-9988', status: 'Activo', loans: 500, photoUrl: 'https://i.pravatar.cc/150?u=e1' },
  { id: 'e2', name: 'Pedro Sánchez', position: 'Vaquero de Lote', salary: 3200, frequency: 'Semanal', phone: '311-222-3344', status: 'Activo', loans: 0, photoUrl: 'https://i.pravatar.cc/150?u=e2' },
];

export const MOCK_VETERINARIANS: Veterinarian[] = [
  { id: 'v1', name: 'MVZ. Luis Estrada', clinicName: 'Salud Pecuaria Nayarit', phone: '311-111-2233', email: 'estrada.vet@arpro.com', address: 'Santiago Ixcuintla, Nay.', photoUrl: 'https://i.pravatar.cc/150?u=v1' },
];

export const MOCK_LISTINGS: Listing[] = MOCK_ANIMALS.slice(0, 6).map((animal, i) => ({
  ...animal,
  sellerId: `s${i}`,
  sellerName: 'Rancho AR Ganadero',
  sellerRating: 4.9,
  description: 'Ejemplar con alto valor genético y salud certificada SINIIGA.',
  status: 'Activo',
  datePublished: '2025-05-18',
  price: 2500 + (i * 120)
}));

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'Ingreso', category: 'Venta de Ganado', amount: 154000, date: '2025-05-18', description: 'Venta Lote Novillos Brangus', isCredit: false, remainingBalance: 0, clientId: 'c1' },
  { id: 't2', type: 'Gasto', category: 'Insumos', amount: 12500, date: '2025-05-19', description: 'Compra Silo de Maíz (5 Ton)', isCredit: false, remainingBalance: 0 },
];

export const MOCK_EVENTS: FarmEvent[] = [
  { id: 'ev1', title: 'Baño General Garrapata', type: 'Baño', date: '2025-05-28', description: 'Lote El Águila', priority: 'Alta', status: 'Pendiente' },
  { id: 'ev2', title: 'Revisión Tacto', type: 'Salud', date: '2025-05-25', description: 'Hembras Lote 3', priority: 'Media', status: 'Pendiente' }
];

export const MOCK_PADDOCK_LOGS: PaddockLog[] = [
  { id: 'pl1', paddockId: 'p1', date: '2025-05-15', activity: 'Limpieza de Potrero', cost: 1500, employeeId: 'e1' }
];
