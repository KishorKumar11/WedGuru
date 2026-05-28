export type RsvpStatus = "pending" | "accepted" | "declined";

export interface User {
  _id: string;
  name: string;
  email: string;
  partnerName?: string;
  weddingDate?: string;
}

export interface ChecklistItem {
  _id: string;
  title: string;
  category: string;
  monthsBefore: string;
  isCompleted: boolean;
  order: number;
}

export interface BudgetItem {
  _id: string;
  category: string;
  vendor: string;
  estimated: number;
  actual: number;
  paid: boolean;
}

export interface Guest {
  _id: string;
  name: string;
  email?: string;
  rsvpStatus: RsvpStatus;
  tableNumber?: number;
  inviteToken: string;
}
