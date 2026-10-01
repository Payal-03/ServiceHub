export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAID'
  | 'REVIEWED'
  | 'CANCELLED';

export interface DaySchedule {
  available: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "18:00"
}

export interface WeeklyAvailability {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface ServiceArea {
  id: string;
  city: string;
  area: string;
  pincode: string;
}

export interface ProviderOfferedService {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  basePrice: number;
  description: string;
  active: boolean;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verified: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  rating: number;
  jobCount: number;
  experienceYears: number;
  bio: string;
  primaryCategory: string;
  services: ProviderOfferedService[];
  serviceAreas: ServiceArea[];
  availability: WeeklyAvailability;
  startingPrice: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  iconName: string;
  providerCount: number;
  active: boolean;
}

export interface BookingAddress {
  street: string;
  city: string;
  area: string;
  pincode: string;
  landmark?: string;
}

export interface BookingTimelineItem {
  status: BookingStatus;
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  providerId: string;
  provider: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    verified: boolean;
    primaryCategory?: string;
  };
  serviceCategoryId: string;
  serviceCategory: string;
  serviceTitle: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  address: BookingAddress;
  estimatedCost: number;
  finalCost?: number;
  finalCostReason?: string;
  finalCostStatus?: 'PENDING_APPROVAL' | 'ACCEPTED' | 'REJECTED';
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod?: string;
  paidAt?: string;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledBy?: UserRole;
  createdAt: string;
  updatedAt: string;
  timeline: BookingTimelineItem[];
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  providerId: string;
  providerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Complaint {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  adminNotes?: string;
  resolution?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ProviderFilters {
  category?: string;
  city?: string;
  area?: string;
  pincode?: string;
  availability?: string; // e.g. "today" | "monday" | etc.
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'recommended' | 'rating' | 'price_asc' | 'price_desc';
  search?: string;
}

export type JobRequestStatus =
  | 'POSTED'
  | 'PROVIDER_INTERESTED'
  | 'PROVIDER_ACCEPTED'
  | 'IN_PROGRESS'
  | 'PROVIDER_MARKED_COMPLETE'
  | 'CUSTOMER_CONFIRMED_COMPLETE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface InterestedProvider {
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerEmail?: string;
  providerAvatar?: string;
  providerRating: number;
  providerJobCount: number;
  providerExperienceYears: number;
  verified: boolean;
  primaryCategory: string;
  expressedAt: string;
  note?: string;
  quotedAmount?: number;
  distanceEstimate?: string;
}

export interface JobRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar?: string;
  serviceCategory: string;
  serviceCategoryId: string;
  serviceType: string;
  description: string;
  city: string;
  locality: string;
  pincode: string;
  addressDetails?: string;
  preferredDate: string;
  preferredTime: string;
  budget: number;
  estimatedMin: number;
  estimatedMax: number;
  notes?: string;
  photoUrl?: string;
  status: JobRequestStatus;
  createdAt: string;
  updatedAt: string;
  interestedProviders: InterestedProvider[];
  acceptedProviderId?: string;
  acceptedProvider?: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    rating: number;
    jobCount: number;
    verified: boolean;
  };
  providerCompleted: boolean;
  providerCompletedAt?: string;
  customerConfirmed: boolean;
  customerConfirmedAt?: string;
  completedAt?: string;
  cancellationReason?: string;
  cancelledBy?: UserRole;
}
