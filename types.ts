
export enum AnimalType {
  BOVINO = 'Bovino',
  PORCINO = 'Porcino',
  OVINO = 'Ovino',
  CAPRINO = 'Caprino'
}

export enum AnimalCategory {
  REPRODUCTOR = 'Reproductor',
  ENGORDE = 'Engorde',
  LECHERIA = 'Lechería',
  SUBASTA = 'Subasta'
}

export enum HealthStatus {
  EXCELENTE = 'Excelente',
  BUENO = 'Bueno',
  EN_TRATAMIENTO = 'En Tratamiento',
  CRITICO = 'Crítico'
}

export interface Animal {
  id: string;
  tagId: string; // RFID/QR
  type: AnimalType;
  breed: string;
  age: number; // in months
  weight: number; // in kg
  sex: 'M' | 'F';
  category: AnimalCategory;
  healthStatus: HealthStatus;
  lastVaccination?: string;
  location: string;
  price?: number;
  imageUrl?: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  type: 'Vacunación' | 'Desparasitación' | 'Tratamiento';
  description: string;
  veterinarian: string;
}

export interface ReproductionRecord {
  id: string;
  animalId: string;
  date: string;
  event: 'Celo' | 'Inseminación' | 'Palpación' | 'Parto';
  result?: string;
  notes?: string;
}

export interface Listing extends Animal {
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  description: string;
  status: 'Activo' | 'Vendido' | 'Reservado';
  datePublished: string;
}

export enum UserType {
  GANADERO = 'Ganadero',
  COMPRADOR = 'Comprador',
  INTERMEDIARIO = 'Intermediario',
  VETERINARIO = 'Veterinario',
  TRANSPORTISTA = 'Transportista'
}

export interface User {
  id: string;
  name: string;
  type: UserType;
  location: string;
  verified: boolean;
  avatarUrl?: string;
}
