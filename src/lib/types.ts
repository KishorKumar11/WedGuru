export type RsvpStatus = "pending" | "accepted" | "declined";
export type UserRole = "primary" | "co-planner" | "planner-pro";

export interface User {
  _id: string;
  name: string;
  email: string;
  partnerName?: string;
  weddingDate?: string;
  role: UserRole;
  coplannerOf?: string;
  familyToken?: string;
}

export interface ChecklistItem {
  _id: string;
  title: string;
  category: string;
  monthsBefore: string;
  isCompleted: boolean;
  order: number;
  assignee?: string;
  dueDate?: string;
}

export interface BudgetItem {
  _id: string;
  category: string;
  vendor: string;
  estimated: number;
  actual: number;
  paid: boolean;
  notes?: string;
}

export interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: RsvpStatus;
  tableNumber?: number;
  inviteToken: string;
  dietary?: string;
  plusOne?: boolean;
  plusOneName?: string;
  songRequest?: string;
  rsvpDeadline?: string;
  conflictWith?: string[];
  seatTags?: string[];
}

export interface ActivityLog {
  _id: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface PartyTask {
  _id: string;
  assignedTo: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}
