export type UserRole = 'ciudadano' | 'reciclador' | 'administrador' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  neighborhood?: string;
  city?: string;
  createdAt: string;
  points?: number;
  badge?: string;
}

export type WasteCategoryType =
  | 'papel'
  | 'carton'
  | 'pet'
  | 'vidrio'
  | 'metal'
  | 'organico'
  | 'electronico'
  | 'peligroso'
  | 'no_reciclable';

export interface BagColorConfig {
  colorName: 'Blanco' | 'Verde' | 'Negro' | 'Rojo';
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
}

export interface WasteCategory {
  id: WasteCategoryType;
  name: string;
  colombianBag: BagColorConfig;
  description: string;
  examples: string[];
  recyclingInstructions: string[];
  co2SavedPerKg: number; // kg CO2
  waterSavedLiters: number; // liters per kg
  energySavedPerKg: number; // kWh
}

export interface ClassificationResult {
  id: string;
  userId: string;
  userName?: string;
  imageUrl: string;
  wasteType: WasteCategoryType;
  wasteName: string;
  confidence: number; // 0 to 100
  inferenceTimeMs: number;
  bagColor: 'Blanco' | 'Verde' | 'Negro' | 'Rojo';
  colombianNormNote: string;
  recyclingSteps: string[];
  environmentalTips: string[];
  estimatedWeightKg: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  createdAt: string;
  status: 'verificado' | 'pendiente' | 'reportado';
}

export interface CollectionPoint {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  coordinates: { lat: number; lng: number };
  wasteTypesAvailable: WasteCategoryType[];
  estimatedKg: number;
  status: 'disponible' | 'en_camino' | 'recolectado';
  citizenName: string;
  citizenContact: string;
  createdAt: string;
}

export interface CollectionRecord {
  id: string;
  recyclerId: string;
  recyclerName: string;
  pointId?: string;
  wasteType: WasteCategoryType;
  weightKg: number;
  location: string;
  notes?: string;
  createdAt: string;
}

export interface IncidentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  title: string;
  description: string;
  category: 'contenedor_lleno' | 'contaminacion' | 'via_bloqueada' | 'otro';
  severity: 'baja' | 'media' | 'alta';
  status: 'abierto' | 'en_proceso' | 'resuelto';
  createdAt: string;
}

export interface DatasetSample {
  id: string;
  filename: string;
  category: WasteCategoryType;
  split: 'train' | 'val' | 'test';
  dimensions: string;
  confidenceThreshold: number;
  verifiedByAdmin: boolean;
  uploadedAt: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: 'IA_ENGINE' | 'AUTH' | 'DATABASE' | 'STORAGE' | 'API_GATEWAY';
  message: string;
  ip: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTimeMinutes: number;
  author: string;
  publishedAt: string;
  imageUrl: string;
}
