
export enum AnimalType {
  BOVINO = 'Bovino',
  PORCINO = 'Porcino',
  OVINO = 'Ovino',
  CAPRINO = 'Caprino',
  EQUINO = 'Equino'
}

export enum AnimalCategory {
  REPRODUCTOR = 'Reproductor',
  ENGORDE = 'Engorde',
  LECHERIA = 'Lechería',
  SUBASTA = 'Subasta',
  TRABAJO = 'Trabajo'
}

export enum HealthStatus {
  EXCELENTE = 'Excelente',
  BUENO = 'Bueno',
  EN_TRATAMIENTO = 'En Tratamiento',
  CRITICO = 'Crítico'
}

export type InfestationLevel = 'Baja' | 'Media' | 'Alta';
export type BathMethod = 'Aspersión' | 'Inmersión' | 'Pour-on' | 'Inyectable';

export interface NoteAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  attachments: NoteAttachment[];
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  driveFolderId?: string;
  lastBackup?: string;
}

export interface TickControlRecord {
  id: string;
  date: string;
  paddockId: string;
  animalCount: number;
  productName: string;
  method: BathMethod;
  infestationLevel: InfestationLevel;
  withdrawalDays: number;
  nextBathDate: string;
  notes?: string;
}

export type AttendanceStatus = 'Asistió' | 'Faltó' | 'Retardo' | 'Justificado';

export interface DailyLog {
  date: string;
  status: AttendanceStatus;
  notes: string;
}

export interface Animal {
  id: string;
  tagId: string;
  type: AnimalType;
  breed: string;
  age: number;
  weight: number;
  sex: 'M' | 'F';
  category: AnimalCategory;
  healthStatus: HealthStatus;
  lastVaccination?: string;
  location: string;
  paddockId?: string;
  price?: number;
  imageUrl?: string;
  registrationDate: string;
}

export interface Paddock {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
  status: 'Descanso' | 'Ocupado' | 'Mantenimiento';
  area: string;
  dimensions?: string;
  forageType?: string;
}

export type PaymentFrequency = 'Diario' | 'Semanal' | 'Quincenal' | 'Mensual' | 'Eventual';
export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta Crédito' | 'Tarjeta Débito' | 'Otro';

export interface Employee {
  id: string;
  name: string;
  alias?: string;
  position: string;
  salary: number;
  frequency: PaymentFrequency;
  phone: string;
  email?: string;
  address?: string;
  status: 'Activo' | 'Vacaciones' | 'Baja';
  loans: number;
  photoUrl?: string;
  attendanceCount?: number;
  dailyLogs?: DailyLog[];
  notes?: string;
}

export type EventType = 'Alimentación' | 'Medicamento' | 'Venta' | 'Compra' | 'Evento' | 'Recordatorio' | 'Otro' | 'Baño';
export type Priority = 'Baja' | 'Media' | 'Alta';

export interface FarmEvent {
  id: string;
  title: string;
  type: EventType | string;
  date: string;
  description: string;
  priority: Priority;
  status: 'Pendiente' | 'Completado';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: EventType;
  read: boolean;
  priority: Priority;
}

export interface ClientTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'Cargo' | 'Abono'; // Cargo = Deuda/Venta, Abono = Pago recibido/abono
  concept: string;
  balanceAfter: number;
  reference?: string;
}

export type ContactRole = 'Comprador' | 'Proveedor' | 'Ambos';

export interface Client {
  id: string;
  name: string;
  alias?: string;
  role: ContactRole;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
  balance: number; // Saldo a favor del rancho (Positivo: nos deben, Negativo: debemos)
  creditLimit: number;
  transactionHistory?: ClientTransaction[];
}

export type TransactionType = 'Ingreso' | 'Gasto';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
  animalId?: string;
  clientId?: string;
  employeeId?: string;
  isCredit: boolean;
  remainingBalance: number;
}

export interface BusinessConfig {
  name: string;
  logoUrl?: string;
  address: string;
  phone: string;
  taxId?: string;
  receiptNote?: string;
}

export interface Listing extends Animal {
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  description: string;
  status: 'Activo' | 'Vendido' | 'Reservado';
  datePublished: string;
}

export interface Veterinarian {
  id: string;
  name: string;
  alias?: string;
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  photoUrl?: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  type: string;
  description: string;
  veterinarianId: string;
  medication?: string;
  dosage?: string;
  progressNotes?: string;
  isEmergency: boolean;
}

export interface ReproductionRecord {
  id: string;
  animalId: string;
  date: string;
  event: string;
  result?: string;
  notes?: string;
}

export interface PaddockLog {
  id: string;
  paddockId: string;
  date: string;
  activity: string;
  cost: number;
  employeeId: string;
}
