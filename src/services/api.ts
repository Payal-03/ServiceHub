import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { MockStorage } from './mockStorage';
import {
  User,
  Provider,
  ServiceCategory,
  Booking,
  Review,
  Complaint,
  AppNotification,
  BookingStatus,
  ProviderFilters,
  WeeklyAvailability,
  ServiceArea
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('sh_auth_token_v1');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 1. AUTH SERVICE
// ==========================================
export const authService = {
  login: async (email: string, password: string):Promise<{ token: string; user: User }> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      // Mock Fallback
      await new Promise(r => setTimeout(r, 400));
      const users = MockStorage.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        if (matched.status === 'BLOCKED') {
          throw new Error('This account has been suspended by administration.');
        }
        const mockToken = `jwt-token-${matched.id}-${Date.now()}`;
        return { token: mockToken, user: matched };
      }
      throw new Error('Invalid email or password. Please try again.');
    }
  },

  register: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'CUSTOMER' | 'PROVIDER';
  }): Promise<{ token: string; user: User }> => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      return response.data;
    } catch (err) {
      // Mock Fallback
      await new Promise(r => setTimeout(r, 500));
      const users = MockStorage.getUsers();
      if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }
      const newUser: User = {
        id: `user-${payload.role === 'PROVIDER' ? 'prov' : 'cust'}-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        status: 'ACTIVE',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      MockStorage.saveUsers(users);

      // If registered as Provider, initialize provider entity
      if (payload.role === 'PROVIDER') {
        const providers = MockStorage.getProviders();
        const newProvider: Provider = {
          id: `prov-${Date.now()}`,
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar!,
          verified: false,
          verificationStatus: 'PENDING',
          rating: 5.0,
          jobCount: 0,
          experienceYears: 1,
          bio: 'Verified technician ready to provide reliable on-demand repairs and services.',
          primaryCategory: 'Electrician',
          startingPrice: 499,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          services: [
            {
              id: `ps-${Date.now()}`,
              categoryId: 'cat-1',
              categoryName: 'Electrician',
              title: 'Standard Inspection & Diagnostic Visit',
              basePrice: 499,
              description: 'On-site technical inspection, fault tracing, and diagnosis.',
              active: true,
            }
          ],
          serviceAreas: [
            { id: `sa-${Date.now()}`, city: 'Mathura', area: 'Krishna Nagar', pincode: '281001' }
          ],
          availability: {
            monday: { available: true, startTime: '09:00', endTime: '18:00' },
            tuesday: { available: true, startTime: '09:00', endTime: '18:00' },
            wednesday: { available: true, startTime: '09:00', endTime: '18:00' },
            thursday: { available: true, startTime: '09:00', endTime: '18:00' },
            friday: { available: true, startTime: '09:00', endTime: '18:00' },
            saturday: { available: true, startTime: '09:00', endTime: '17:00' },
            sunday: { available: false, startTime: '09:00', endTime: '13:00' },
          }
        };
        providers.push(newProvider);
        MockStorage.saveProviders(providers);
      }

      const mockToken = `jwt-token-${newUser.id}-${Date.now()}`;
      return { token: mockToken, user: newUser };
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const rawUser = localStorage.getItem('sh_active_user_v1');
    if (!rawUser) return null;
    return JSON.parse(rawUser);
  }
};

// ==========================================
// 2. USER SERVICE
// ==========================================
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data;
    } catch {
      await new Promise(r => setTimeout(r, 200));
      return MockStorage.getUsers();
    }
  },
  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'BLOCKED'): Promise<User> => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/status`, { status });
      return res.data;
    } catch {
      const users = MockStorage.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        users[idx].status = status;
        MockStorage.saveUsers(users);
        return users[idx];
      }
      throw new Error('User not found');
    }
  },
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    try {
      const res = await apiClient.put(`/users/${userId}`, data);
      return res.data;
    } catch {
      const users = MockStorage.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        MockStorage.saveUsers(users);
        localStorage.setItem('sh_active_user_v1', JSON.stringify(users[idx]));
        return users[idx];
      }
      throw new Error('User not found');
    }
  }
};

// ==========================================
// 3. SERVICE CATEGORY SERVICE
// ==========================================
export const serviceCategoryService = {
  getCategories: async (): Promise<ServiceCategory[]> => {
    try {
      const res = await apiClient.get('/categories');
      return res.data;
    } catch {
      return MockStorage.getCategories();
    }
  },
  addCategory: async (category: Omit<ServiceCategory, 'id' | 'providerCount'>): Promise<ServiceCategory> => {
    try {
      const res = await apiClient.post('/admin/categories', category);
      return res.data;
    } catch {
      const cats = MockStorage.getCategories();
      const newCat: ServiceCategory = {
        ...category,
        id: `cat-${Date.now()}`,
        providerCount: 0,
      };
      cats.push(newCat);
      MockStorage.saveCategories(cats);
      return newCat;
    }
  },
  toggleCategoryStatus: async (id: string): Promise<ServiceCategory> => {
    try {
      const res = await apiClient.patch(`/admin/categories/${id}/toggle`);
      return res.data;
    } catch {
      const cats = MockStorage.getCategories();
      const idx = cats.findIndex(c => c.id === id);
      if (idx !== -1) {
        cats[idx].active = !cats[idx].active;
        MockStorage.saveCategories(cats);
        return cats[idx];
      }
      throw new Error('Category not found');
    }
  }
};

// ==========================================
// 4. PROVIDER SERVICE & MATCHING
// ==========================================
export const providerService = {
  searchProviders: async (filters: ProviderFilters = {}): Promise<Provider[]> => {
    try {
      const res = await apiClient.get('/providers', { params: filters });
      return res.data;
    } catch {
      await new Promise(r => setTimeout(r, 200));
      let list = MockStorage.getProviders().filter(p => p.verificationStatus === 'VERIFIED');

      if (filters.category && filters.category !== 'all') {
        const catQuery = filters.category.toLowerCase();
        list = list.filter(p => 
          p.primaryCategory.toLowerCase().includes(catQuery) ||
          p.services.some(s => s.categoryName.toLowerCase().includes(catQuery))
        );
      }

      if (filters.city && filters.city.trim() !== '') {
        const cityQuery = filters.city.toLowerCase().trim();
        list = list.filter(p => p.serviceAreas.some(sa => sa.city.toLowerCase().includes(cityQuery)));
      }

      if (filters.area && filters.area.trim() !== '') {
        const areaQuery = filters.area.toLowerCase().trim();
        list = list.filter(p => p.serviceAreas.some(sa => sa.area.toLowerCase().includes(areaQuery)));
      }

      if (filters.pincode && filters.pincode.trim() !== '') {
        const pinQuery = filters.pincode.trim();
        list = list.filter(p => p.serviceAreas.some(sa => sa.pincode.includes(pinQuery)));
      }

      if (filters.minRating) {
        list = list.filter(p => p.rating >= filters.minRating!);
      }

      if (filters.maxPrice) {
        list = list.filter(p => p.startingPrice <= filters.maxPrice!);
      }

      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.primaryCategory.toLowerCase().includes(q) ||
          p.serviceAreas.some(sa => sa.area.toLowerCase().includes(q) || sa.city.toLowerCase().includes(q))
        );
      }

      // Sorting
      if (filters.sortBy === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'price_asc') {
        list.sort((a, b) => a.startingPrice - b.startingPrice);
      } else if (filters.sortBy === 'price_desc') {
        list.sort((a, b) => b.startingPrice - a.startingPrice);
      } else {
        // Recommended: verified and highest jobs
        list.sort((a, b) => (b.rating * b.jobCount) - (a.rating * a.jobCount));
      }

      return list;
    }
  },

  getAllProvidersForAdmin: async (): Promise<Provider[]> => {
    try {
      const res = await apiClient.get('/admin/providers');
      return res.data;
    } catch {
      return MockStorage.getProviders();
    }
  },

  getProviderById: async (id: string): Promise<Provider> => {
    try {
      const res = await apiClient.get(`/providers/${id}`);
      return res.data;
    } catch {
      const p = MockStorage.getProviderById(id);
      if (!p) throw new Error('Provider not found');
      return p;
    }
  },

  updateProviderDetails: async (id: string, updates: Partial<Provider>): Promise<Provider> => {
    try {
      const res = await apiClient.put(`/providers/${id}`, updates);
      return res.data;
    } catch {
      return MockStorage.updateProvider(id, updates);
    }
  },

  verifyProvider: async (providerId: string, approve: boolean, reason?: string): Promise<Provider> => {
    try {
      const res = await apiClient.patch(`/admin/providers/${providerId}/verify`, { approve, reason });
      return res.data;
    } catch {
      const updates: Partial<Provider> = approve
        ? { verified: true, verificationStatus: 'VERIFIED', rejectionReason: undefined }
        : { verified: false, verificationStatus: 'REJECTED', rejectionReason: reason };
      return MockStorage.updateProvider(providerId, updates);
    }
  }
};

// ==========================================
// 5. AVAILABILITY SERVICE
// ==========================================
export const availabilityService = {
  getAvailability: async (providerId: string): Promise<WeeklyAvailability> => {
    try {
      const res = await apiClient.get(`/providers/${providerId}/availability`);
      return res.data;
    } catch {
      const p = MockStorage.getProviderById(providerId);
      if (!p) throw new Error('Provider not found');
      return p.availability;
    }
  },
  updateAvailability: async (providerId: string, schedule: WeeklyAvailability): Promise<WeeklyAvailability> => {
    try {
      const res = await apiClient.put(`/providers/${providerId}/availability`, schedule);
      return res.data;
    } catch {
      const p = MockStorage.updateProvider(providerId, { availability: schedule });
      return p.availability;
    }
  },
  updateServiceAreas: async (providerId: string, areas: ServiceArea[]): Promise<ServiceArea[]> => {
    try {
      const res = await apiClient.put(`/providers/${providerId}/service-areas`, areas);
      return res.data;
    } catch {
      const p = MockStorage.updateProvider(providerId, { serviceAreas: areas });
      return p.serviceAreas;
    }
  }
};

// ==========================================
// 6. BOOKING SERVICE (State Machine Engine)
// ==========================================
export const bookingService = {
  createBooking: async (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Booking> => {
    try {
      const res = await apiClient.post('/bookings', bookingData);
      return res.data;
    } catch {
      await new Promise(r => setTimeout(r, 400));
      return MockStorage.createBooking(bookingData);
    }
  },

  getBookings: async (role?: string, entityId?: string): Promise<Booking[]> => {
    try {
      const res = await apiClient.get('/bookings', { params: { role, entityId } });
      return res.data;
    } catch {
      await new Promise(r => setTimeout(r, 200));
      const all = MockStorage.getBookings();
      if (role === 'CUSTOMER' && entityId) {
        return all.filter(b => b.customerId === entityId || b.customer.email === entityId);
      }
      if (role === 'PROVIDER' && entityId) {
        return all.filter(b => b.providerId === entityId || b.provider.id === entityId);
      }
      return all;
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const res = await apiClient.get(`/bookings/${id}`);
      return res.data;
    } catch {
      const b = MockStorage.getBookingById(id);
      if (!b) throw new Error('Booking not found');
      return b;
    }
  },

  updateStatus: async (id: string, status: BookingStatus, note?: string): Promise<Booking> => {
    try {
      const res = await apiClient.patch(`/bookings/${id}/status`, { status, note });
      return res.data;
    } catch {
      return MockStorage.updateBookingStatus(id, status, note);
    }
  },

  cancelBooking: async (id: string, reason: string, cancelledBy: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'): Promise<Booking> => {
    try {
      const res = await apiClient.post(`/bookings/${id}/cancel`, { reason, cancelledBy });
      return res.data;
    } catch {
      const b = MockStorage.getBookingById(id);
      if (!b) throw new Error('Booking not found');
      b.cancellationReason = reason;
      b.cancelledBy = cancelledBy;
      return MockStorage.updateBookingStatus(id, 'CANCELLED', `Cancelled: ${reason}`);
    }
  },

  submitFinalCost: async (id: string, finalCost: number, reason: string): Promise<Booking> => {
    try {
      const res = await apiClient.post(`/bookings/${id}/final-cost`, { finalCost, reason });
      return res.data;
    } catch {
      return MockStorage.submitFinalCost(id, finalCost, reason);
    }
  },

  respondToFinalCost: async (id: string, accept: boolean): Promise<Booking> => {
    try {
      const res = await apiClient.post(`/bookings/${id}/final-cost/respond`, { accept });
      return res.data;
    } catch {
      return MockStorage.respondToFinalCost(id, accept);
    }
  }
};

// ==========================================
// 7. PAYMENT SERVICE
// ==========================================
export const paymentService = {
  recordPayment: async (bookingId: string, method: string = 'CASH_RECORDED'): Promise<Booking> => {
    try {
      const res = await apiClient.post(`/payments/record`, { bookingId, method });
      return res.data;
    } catch {
      return MockStorage.recordPayment(bookingId, method);
    }
  },
  getPayments: async (): Promise<{ bookingId: string; amount: number; date: string; method: string; status: string }[]> => {
    try {
      const res = await apiClient.get('/payments');
      return res.data;
    } catch {
      const paidBookings = MockStorage.getBookings().filter(b => b.paymentStatus === 'PAID');
      return paidBookings.map(b => ({
        bookingId: b.id,
        bookingNumber: b.bookingNumber,
        service: b.serviceTitle,
        customerName: b.customer.name,
        providerName: b.provider.name,
        amount: b.finalCost || b.estimatedCost,
        date: b.paidAt || b.updatedAt,
        method: b.paymentMethod || 'CASH_RECORDED',
        status: 'PAID'
      }));
    }
  }
};

// ==========================================
// 8. REVIEW SERVICE
// ==========================================
export const reviewService = {
  createReview: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    try {
      const res = await apiClient.post('/reviews', reviewData);
      return res.data;
    } catch {
      return MockStorage.addReview(reviewData);
    }
  },
  getReviewsByProvider: async (providerId: string): Promise<Review[]> => {
    try {
      const res = await apiClient.get(`/providers/${providerId}/reviews`);
      return res.data;
    } catch {
      return MockStorage.getReviews().filter(r => r.providerId === providerId);
    }
  },
  getAllReviews: async (): Promise<Review[]> => {
    try {
      const res = await apiClient.get('/reviews');
      return res.data;
    } catch {
      return MockStorage.getReviews();
    }
  }
};

// ==========================================
// 9. COMPLAINT SERVICE
// ==========================================
export const complaintService = {
  getAllComplaints: async (): Promise<Complaint[]> => {
    try {
      const res = await apiClient.get('/admin/complaints');
      return res.data;
    } catch {
      return MockStorage.getComplaints();
    }
  },
  updateComplaintStatus: async (
    id: string,
    status: Complaint['status'],
    adminNotes?: string,
    resolution?: string
  ): Promise<Complaint> => {
    try {
      const res = await apiClient.patch(`/admin/complaints/${id}`, { status, adminNotes, resolution });
      return res.data;
    } catch {
      return MockStorage.updateComplaint(id, { status, adminNotes, resolution });
    }
  }
};

// ==========================================
// 10. NOTIFICATION SERVICE
// ==========================================
export const notificationService = {
  getNotifications: async (userId: string): Promise<AppNotification[]> => {
    try {
      const res = await apiClient.get(`/users/${userId}/notifications`);
      return res.data;
    } catch {
      return MockStorage.getNotifications().filter(n => n.userId === userId || n.userId === 'user-admin-1');
    }
  },
  markAsRead: async (notifId: string): Promise<void> => {
    try {
      await apiClient.patch(`/notifications/${notifId}/read`);
    } catch {
      MockStorage.markNotificationRead(notifId);
    }
  },
  markAllAsRead: async (): Promise<void> => {
    try {
      await apiClient.post('/notifications/mark-all-read');
    } catch {
      MockStorage.markAllNotificationsRead();
    }
  }
};

// ==========================================
// 11. ADMIN ANALYTICS SERVICE
// ==========================================
export const adminService = {
  getDashboardStats: async () => {
    const users = MockStorage.getUsers();
    const providers = MockStorage.getProviders();
    const bookings = MockStorage.getBookings();
    const complaints = MockStorage.getComplaints();

    return {
      totalUsers: users.length,
      totalProviders: providers.length,
      verifiedProviders: providers.filter(p => p.verificationStatus === 'VERIFIED').length,
      pendingVerification: providers.filter(p => p.verificationStatus === 'PENDING').length,
      activeBookings: bookings.filter(b => ['ACCEPTED', 'SCHEDULED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)).length,
      completedBookings: bookings.filter(b => ['COMPLETED', 'PAID', 'REVIEWED'].includes(b.status)).length,
      cancelledBookings: bookings.filter(b => b.status === 'CANCELLED').length,
      complaintsCount: complaints.filter(c => c.status !== 'CLOSED').length,
      totalRevenue: bookings.filter(b => b.paymentStatus === 'PAID').reduce((acc, cur) => acc + (cur.finalCost || cur.estimatedCost), 0),
    };
  }
};

// Export new job request & pricing services
export { jobRequestService } from './jobRequestService';
export { calculateServiceEstimate } from './pricingService';
