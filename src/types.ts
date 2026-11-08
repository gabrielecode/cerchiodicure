export type PostType = 'pill' | 'calendar' | 'note' | 'food' | 'photo';

export interface Post {
  id: string;
  authorName: string;
  authorAvatar?: string;
  timestamp: string; // e.g., '2 ore fa' or ISO string
  type: PostType;
  text: string;
  completed?: boolean;
  imageUrl?: string;
}

export interface CareEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  memberName: string;
  memberAvatar?: string;
  type: 'turno' | 'appuntamento';
  status: 'attesa' | 'completato';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[]; // ['08:00', '20:00']
  responsible: string;
  checks: Record<string, boolean>; // key: 'YYYY-MM-DD_08:00' -> boolean
}

export interface CareDocument {
  id: string;
  name: string;
  title?: string;
  date?: string;
  createdAt?: any;
  author: string;
  fileSize?: string;
  fileType?: string;
  size: number;
  mimeType: string;
  path: string;
  downloadUrl?: string;
  circleId?: string;
  createdBy?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online?: boolean;
}

export interface Profile {
  recipientName: string;
  userName: string;
  userRole: string;
  inviteCode: string;
  isOnboarded: boolean;
}

export interface MealItem {
  dish: string;
  provider: string; // e.g., 'Spitex', 'Marco', 'Pro Senectute'
  status: 'pianificato' | 'consumato';
}

export interface MealPlan {
  id: string;
  day: string; // 'Lunedì', 'Martedì', etc.
  lunch: MealItem;
  dinner: MealItem;
}
