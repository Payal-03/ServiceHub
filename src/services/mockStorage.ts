import {
  MOCK_USERS,
  MOCK_PROVIDERS,
  MOCK_CATEGORIES,
  MOCK_BOOKINGS,
  MOCK_REVIEWS,
  MOCK_COMPLAINTS,
  MOCK_NOTIFICATIONS
} from '../constants/mockData';
import {
  User,
  Provider,
  ServiceCategory,
  Booking,
  Review,
  Complaint,
  AppNotification,
  BookingStatus,
  WeeklyAvailability,
  ServiceArea,
  ProviderOfferedService
} from '../types';

const STORAGE_KEYS = {
  USERS: 'sh_users_v1',
  PROVIDERS: 'sh_providers_v1',
  CATEGORIES: 'sh_categories_v1',
  BOOKINGS: 'sh_bookings_v1',
  REVIEWS: 'sh_reviews_v1',
  COMPLAINTS: 'sh_complaints_v1',
  NOTIFICATIONS: 'sh_notifications_v1',
  ACTIVE_USER: 'sh_active_user_v1',
  AUTH_TOKEN: 'sh_auth_token_v1',
};

// Initialize default storage if empty
export const initializeMockStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(MOCK_PROVIDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(MOCK_COMPLAINTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
  }
};

export const MockStorage = {
  getUsers: (): User[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getProviders: (): Provider[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]');
  },
  saveProviders: (providers: Provider[]) => {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  },
  getProviderById: (id: string): Provider | undefined => {
    return MockStorage.getProviders().find(p => p.id === id || p.userId === id);
  },
  updateProvider: (id: string, updates: Partial<Provider>): Provider => {
    const list = MockStorage.getProviders();
    const idx = list.findIndex(p => p.id === id || p.userId === id);
    if (idx === -1) throw new Error('Provider not found');
    list[idx] = { ...list[idx], ...updates };
    MockStorage.saveProviders(list);
    return list[idx];
  },

  getCategories: (): ServiceCategory[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },
  saveCategories: (categories: ServiceCategory[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getBookings: (): Booking[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  },
  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },
  getBookingById: (id: string): Booking | undefined => {
    return MockStorage.getBookings().find(b => b.id === id || b.bookingNumber === id);
  },
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Booking => {
    const list = MockStorage.getBookings();
    const newId = `bk-${Date.now().toString().slice(-4)}`;
    const newBookingNumber = `SH-2026-${(list.length + 1).toString().padStart(3, '0')}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      bookingNumber: newBookingNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          note: 'Booking request placed by customer.',
        }
      ]
    };
    list.unshift(newBooking);
    MockStorage.saveBookings(list);

    // Also trigger a notification for provider
    MockStorage.addNotification({
      userId: newBooking.provider.id,
      title: 'New Service Booking Request',
      message: `${newBooking.customer.name} requested ${newBooking.serviceTitle} for ${newBooking.date} at ${newBooking.time}.`,
      type: 'INFO',
      link: `/provider/requests`,
    });

    return newBooking;
  },
  updateBookingStatus: (id: string, status: BookingStatus, note?: string): Booking => {
    const list = MockStorage.getBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    const prev = list[idx];
    const updated: Booking = {
      ...prev,
      status,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...prev.timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
        }
      ]
    };
    list[idx] = updated;
    MockStorage.saveBookings(list);

    // Notify customer
    MockStorage.addNotification({
      userId: updated.customerId,
      title: `Booking Update: ${status.replace(/_/g, ' ')}`,
      message: `Your booking for ${updated.serviceTitle} is now marked as ${status.replace(/_/g, ' ')}.`,
      type: status === 'CANCELLED' ? 'WARNING' : 'INFO',
      link: `/customer/bookings/${updated.id}`,
    });

    return updated;
  },
  submitFinalCost: (id: string, finalCost: number, reason: string): Booking => {
    const list = MockStorage.getBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    const updated: Booking = {
      ...list[idx],
      finalCost,
      finalCostReason: reason,
      finalCostStatus: 'PENDING_APPROVAL',
      updatedAt: new Date().toISOString(),
      timeline: [
        ...list[idx].timeline,
        {
          status: list[idx].status,
          timestamp: new Date().toISOString(),
          note: `Provider submitted final cost of ₹${finalCost}: "${reason}"`,
        }
      ]
    };
    list[idx] = updated;
    MockStorage.saveBookings(list);

    MockStorage.addNotification({
      userId: updated.customerId,
      title: 'Final Price Requires Confirmation',
      message: `${updated.provider.name} submitted final cost of ₹${finalCost}. Please review and approve.`,
      type: 'WARNING',
      link: `/customer/bookings/${updated.id}`,
    });

    return updated;
  },
  respondToFinalCost: (id: string, accept: boolean): Booking => {
    const list = MockStorage.getBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    const updated: Booking = {
      ...list[idx],
      finalCostStatus: accept ? 'ACCEPTED' : 'REJECTED',
      updatedAt: new Date().toISOString(),
      timeline: [
        ...list[idx].timeline,
        {
          status: list[idx].status,
          timestamp: new Date().toISOString(),
          note: accept ? `Customer accepted final cost of ₹${list[idx].finalCost}` : `Customer rejected final cost adjustment`,
        }
      ]
    };
    list[idx] = updated;
    MockStorage.saveBookings(list);
    return updated;
  },
  recordPayment: (id: string, method: string = 'CASH_RECORDED'): Booking => {
    const list = MockStorage.getBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    const prev = list[idx];
    const updated: Booking = {
      ...prev,
      paymentStatus: 'PAID',
      paymentMethod: method,
      paidAt: new Date().toISOString(),
      status: 'PAID',
      updatedAt: new Date().toISOString(),
      timeline: [
        ...prev.timeline,
        {
          status: 'PAID',
          timestamp: new Date().toISOString(),
          note: `Payment recorded via ${method.replace(/_/g, ' ')}.`,
        }
      ]
    };
    list[idx] = updated;
    MockStorage.saveBookings(list);
    return updated;
  },

  getReviews: (): Review[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  },
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
    const list = MockStorage.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));

    // Update booking status to REVIEWED
    if (reviewData.bookingId) {
      MockStorage.updateBookingStatus(reviewData.bookingId, 'REVIEWED', `Customer submitted a ${reviewData.rating}-star review.`);
    }

    // Recalculate provider average rating and jobCount
    const providers = MockStorage.getProviders();
    const pIdx = providers.findIndex(p => p.id === reviewData.providerId || p.userId === reviewData.providerId);
    if (pIdx !== -1) {
      const pReviews = list.filter(r => r.providerId === providers[pIdx].id);
      const avg = pReviews.reduce((acc, cur) => acc + cur.rating, 0) / (pReviews.length || 1);
      providers[pIdx].rating = Number(avg.toFixed(1));
      providers[pIdx].jobCount += 1;
      MockStorage.saveProviders(providers);
    }

    return newReview;
  },

  getComplaints: (): Complaint[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLAINTS) || '[]');
  },
  saveComplaints: (complaints: Complaint[]) => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  },
  updateComplaint: (id: string, updates: Partial<Complaint>): Complaint => {
    const list = MockStorage.getComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Complaint not found');
    list[idx] = { ...list[idx], ...updates };
    MockStorage.saveComplaints(list);
    return list[idx];
  },

  getNotifications: (): AppNotification[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  },
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const list = MockStorage.getNotifications();
    const item: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },
  markNotificationRead: (id: string) => {
    const list = MockStorage.getNotifications();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  },
  markAllNotificationsRead: () => {
    const list = MockStorage.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }
};
