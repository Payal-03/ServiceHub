import axios from 'axios';
import {
  AuthResponse,
  Category,
  CustomerProfile,
  ElectricianProfile,
  Notification,
  Rating,
  Role,
  ServiceCategory,
  ServiceRequest,
  UpdateRequestInput,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('servicehub_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Auth API
export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },
};

// 2. Category API
export const categoryApi = {
  getAll: async (): Promise<ServiceCategory[]> => {
    const res = await apiClient.get<ServiceCategory[]>('/categories');
    return res.data;
  },
};

// 3. Electrician Profile API
export const electricianApi = {
  getMyProfile: async (): Promise<ElectricianProfile> => {
    const res = await apiClient.get<ElectricianProfile>('/electricians/me');
    return res.data;
  },

  getById: async (id: string | number): Promise<ElectricianProfile> => {
    const res = await apiClient.get<ElectricianProfile>(`/electricians/${id}`);
    return res.data;
  },

  update: async (
    id: string | number,
    data: Partial<ElectricianProfile>
  ): Promise<ElectricianProfile> => {
    const res = await apiClient.put<ElectricianProfile>(`/electricians/${id}`, data);
    return res.data;
  },
};

// 4. Service Requests API
export const requestApi = {
  create: async (data: {
    categoryId: number;
    title: string;
    description: string;
    city: string;
    locality: string;
    address: string;
    expectedBudget: number;
  }): Promise<ServiceRequest> => {
    const res = await apiClient.post<ServiceRequest>('/requests', data);
    return res.data;
  },

  getMyRequests: async (): Promise<ServiceRequest[]> => {
    const res = await apiClient.get<ServiceRequest[]>('/requests/my');
    return res.data;
  },

  getAvailable: async (filters?: {
    categoryId?: number;
    category?: string;
    city?: string;
    locality?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ServiceRequest[]> => {
    const res = await apiClient.get<ServiceRequest[]>('/requests/available', {
      params: filters,
    });
    return res.data;
  },

  getById: async (id: string | number): Promise<ServiceRequest> => {
    const res = await apiClient.get<ServiceRequest>(`/requests/${id}`);
    return res.data;
  },

  cancel: async (id: string | number): Promise<ServiceRequest> => {
    const res = await apiClient.post<ServiceRequest>(`/requests/${id}/cancel`);
    return res.data;
  },

  expressInterest: async (
    id: string | number,
    data: { bidAmount: number; message: string }
  ): Promise<ServiceRequest> => {
    const res = await apiClient.post<ServiceRequest>(`/requests/${id}/interest`, data);
    return res.data;
  },

  withdrawInterest: async (id: string | number): Promise<ServiceRequest> => {
    const res = await apiClient.delete<ServiceRequest>(`/requests/${id}/interest`);
    return res.data;
  },

  selectElectrician: async (
    requestId: string | number,
    electricianId: number | string
  ): Promise<ServiceRequest> => {
    const res = await apiClient.post<ServiceRequest>(`/requests/${requestId}/accept`, {
      electricianId: Number(electricianId),
    });
    return res.data;
  },

  customerConfirm: async (id: string | number): Promise<ServiceRequest> => {
    const res = await apiClient.patch<ServiceRequest>(`/requests/${id}/customer-confirm`);
    return res.data;
  },

  electricianConfirm: async (id: string | number): Promise<ServiceRequest> => {
    const res = await apiClient.patch<ServiceRequest>(`/requests/${id}/provider-complete`);
    return res.data;
  },

  update: async (
    id: string | number,
    data: UpdateRequestInput
  ): Promise<ServiceRequest> => {
    try {
      const res = await apiClient.put<ServiceRequest>(`/requests/${id}`, data);
      return res.data;
    } catch (err: any) {
      // If PUT is not supported (405 Method Not Allowed), retry with PATCH
      if (err.response?.status === 405) {
        try {
          const patchRes = await apiClient.patch<ServiceRequest>(`/requests/${id}`, data);
          return patchRes.data;
        } catch (patchErr: any) {
          if (patchErr.response?.status === 405) {
            const postRes = await apiClient.post<ServiceRequest>(`/requests/${id}/update`, data);
            return postRes.data;
          }
          throw patchErr;
        }
      }
      throw err;
    }
  },
};

// 5. Ratings & Reviews API
export const ratingApi = {
  create: async (data: {
    requestId: number | string;
    score: number;
    review: string;
  }): Promise<Rating> => {
    const res = await apiClient.post<Rating>('/ratings', data);
    return res.data;
  },

  getByElectrician: async (electricianId: number | string): Promise<Rating[]> => {
    const res = await apiClient.get<Rating[]>(`/ratings/electrician/${electricianId}`);
    return res.data;
  },

  getMyRatings: async (): Promise<{
    ratings: Rating[];
    averageScore: number | null;
    totalCount: number;
    userName: string;
    userEmail: string;
    userRole: string;
  }> => {
    const res = await apiClient.get('/ratings/my');
    return res.data;
  },
};

// 6. Customer Profile API
export const customerApi = {
  getProfile: async (): Promise<CustomerProfile> => {
    const res = await apiClient.get<CustomerProfile>('/customers/me');
    return res.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    defaultCity?: string;
    defaultLocality?: string;
    defaultAddress?: string;
  }): Promise<CustomerProfile> => {
    const res = await apiClient.put<CustomerProfile>('/customers/me', data);
    return res.data;
  },
};

// 7. Notification API
export const notificationApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>('/notifications');
    return res.data;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const res = await apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id: number | string): Promise<Notification> => {
    const res = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const res = await apiClient.patch<{ message: string }>('/notifications/read-all');
    return res.data;
  },
};
