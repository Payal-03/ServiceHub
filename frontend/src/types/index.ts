// ServiceHub Domain Models matching Spring Boot Backend

export type Role = 'CUSTOMER' | 'ELECTRICIAN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type UserRole = Role;

export interface ServiceCategory {
  id: number;
  name: string;
  slug?: string;
  description: string;
  active: boolean;
}

export type Category = ServiceCategory;

export interface ElectricianProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  serviceCity: string;
  serviceLocality: string;
  experienceYears: number;
  description: string;
  rating: number; // Dynamically computed average score from ratings table
  ratingCount: number;
  jobCount?: number;
}

export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export type InterestStatus = 'INTERESTED' | 'SELECTED' | 'NOT_SELECTED' | 'WITHDRAWN';

export interface Interest {
  interestId: number;
  requestId: number;
  electricianId: number;
  electricianName: string;
  electricianPhone: string;
  electricianEmail?: string;
  electricianRating: number;
  electricianExperienceYears: number;
  bidAmount: number;
  status: InterestStatus;
  message: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceCategoryId: string;
  serviceCategory: string;
  title: string;
  description: string;
  city: string;
  locality: string;
  address: string;
  budget: number;
  status: RequestStatus;
  selectedElectricianId?: string;
  selectedElectrician?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    experienceYears: number;
  };
  customerConfirmed: boolean;
  electricianConfirmed: boolean;
  interestedProviders: Interest[];
  interestedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  ratingId?: number;
  requestId: number;
  reviewerUserId: number;
  reviewerName: string;
  revieweeUserId: number;
  revieweeName: string;
  score: number;
  review: string;
  createdAt: string;
}

export interface CustomerProfile {
  customerId: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  defaultCity?: string;
  defaultLocality?: string;
  defaultAddress?: string;
  memberSince?: string;
  averageRating?: number | null;
  totalRatingsCount: number;
  totalRequestsCount: number;
  ratings: Rating[];
}

