
import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, Stethoscope, Settings, Baby,
  Activity, Users, Wallet, Map, UserCheck, Calendar, Sparkles, Notebook,
  ShieldCheck, Briefcase, Microscope
} from 'lucide-react';
import { 
  Animal, AnimalType, AnimalCategory, HealthStatus, Listing, 
  HealthRecord, ReproductionRecord, Client, Transaction, 
  BusinessConfig, Paddock, Employee, PaddockLog, FarmEvent, Veterinarian, Note
} from './types';

export const MOCK_BUSINESS_CONFIG: BusinessConfig = {
  name: "AR CONTROL GANADERO",
  address: "Nayarit, México",
  phone: "+52 311 123 4567",
  taxId: "AR-PRO-GAN-2025",
  receiptNote: "Tecnología de Vanguardia para el Sector Pecuario"
};

// Navegación Ultra-Compacta
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'ai_consultant', label: 'Consultor IA', icon: <Sparkles size={20} /> },
  { id: 'bio_control', label: 'Bio-Control', icon: <Microscope size={20} />, subItems: ['herd', 'health', 'reproduction'] },
  { id: 'operations', label: 'Operaciones', icon: <Briefcase size={20} />, subItems: ['paddocks', 'hr'] },
  { id: 'business', label: 'Negocios', icon: <Wallet size={20} />, subItems: ['marketplace', 'finances', 'clients'] },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Plan de Suplementación Verano',
    content: 'Ajustar melaza y sales minerales en el lote de engorde sector norte.',
    color: '#fee2e2',
    date: '2025-05-20',
    attachments: []
  }
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'Corporativo Cárnico Nayarit', 
    alias: 'Comprador Principal', 
    role: 'Comprador',
    phone: '555-123-4567', 
    balance: 45000,
    creditLimit: 500000,
    address: 'Tepic, Nayarit',
    transactionHistory: []
  }
];

export const MOCK_PADDOCKS: Paddock[] = [
  { id: 'p1', name: 'Sector El Águila', capacity: 50, currentCount: 42, status: 'Ocupado', area: '12 Hectáreas', forageType: 'Estrella' },
  { id: 'p2', name: 'Loma Blanca', capacity: 30, currentCount: 0, status: 'Descanso', area: '8 Hectáreas', forageType: 'Brizantha' },
];

export const MOCK_ANIMALS: Animal[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  tagId: `AR-${1000 + i}`,
  type: AnimalType.BOVINO,
  breed: i % 2 === 0 ? 'Angus' : 'Brahman',
  age: 24,
  weight: 450 + (i * 10),
  sex: 'M',
  category: AnimalCategory.ENGORDE,
  healthStatus: HealthStatus.EXCELENTE,
  location: 'Sector El Águila',
  imageUrl: `https://picsum.photos/seed/cow${i}/600/400`,
  registrationDate: '2025-01-10',
  price: 1800 + (i * 50)
}));

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  { id: 'hr1', animalId: '1', date: '2025-05-01', type: 'Vacunación', description: 'Aftosa', veterinarianId: 'v1', medication: 'AftoVax', dosage: '5ml', isEmergency: false },
];

export const MOCK_REPRODUCTION_RECORDS: ReproductionRecord[] = [
  { id: 'rr1', animalId: '1', date: '2025-05-10', event: 'Chequeo Preñez', result: 'Positivo' }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Roberto Méndez', position: 'Administrador de Campo', salary: 12000, frequency: 'Quincenal', phone: '311-102-3942', status: 'Activo', loans: 0 },
];

export const MOCK_VETERINARIANS: Veterinarian[] = [
  { id: 'v1', name: 'Dr. Julián Ortega', clinicName: 'Sanidad Animal Pro', phone: '311-555-0192', email: 'ortega.vet@arcontrol.com', address: 'Tepic, Nay' },
];

export const MOCK_LISTINGS: Listing[] = MOCK_ANIMALS.slice(0, 5).map((animal, i) => ({
  ...animal,
  sellerId: `s${i}`,
  sellerName: 'Rancho AR Ganadero',
  sellerRating: 5.0,
  description: 'Ejemplar con registro y esquema de vacunación completo.',
  status: 'Activo',
  datePublished: '2025-05-20',
  price: 2000 + (i * 100)
}));

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'Ingreso', category: 'Venta de Ganado', amount: 85000, date: '2025-05-15', description: 'Venta Lote Novillos', isCredit: false, remainingBalance: 0, clientId: 'c1' },
];

export const MOCK_PADDOCK_LOGS: PaddockLog[] = [];
export const MOCK_EVENTS: FarmEvent[] = [
  { id: 'ev1', title: 'Vacunación General', type: 'Medicamento', date: '2025-05-25', description: 'Lote Norte', priority: 'Alta', status: 'Pendiente' }
];
