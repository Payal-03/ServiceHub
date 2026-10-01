import {
  MOCK_USERS,
  MOCK_PROVIDERS,
  MOCK_CATEGORIES,
  MOCK_BOOKINGS,
  MOCK_REVIEWS,
  MOCK_COMPLAINTS,
  MOCK_NOTIFICATIONS
} from '../constants/mockData';
import { MOCK_JOB_REQUESTS } from '../constants/mockJobRequests';
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
  ProviderOfferedService,
  JobRequest,
  JobRequestStatus,
  InterestedProvider,
  UserRole
} from '../types';

const STORAGE_KEYS = {
  USERS: 'sh_users_v1',
  PROVIDERS: 'sh_providers_v1',
  CATEGORIES: 'sh_categories_v1',
  BOOKINGS: 'sh_bookings_v1',
  REVIEWS: 'sh_reviews_v1',
  COMPLAINTS: 'sh_complaints_v1',
  NOTIFICATIONS: 'sh_notifications_v1',
  JOB_REQUESTS: 'sh_job_requests_v1',
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
  if (!localStorage.getItem(STORAGE_KEYS.JOB_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.JOB_REQUESTS, JSON.stringify(MOCK_JOB_REQUESTS));
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
  },

  // ================= JOB REQUESTS (ON-DEMAND POSTING MODEL) =================
  getJobRequests: (): JobRequest[] => {
    initializeMockStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOB_REQUESTS) || '[]');
  },

  saveJobRequests: (requests: JobRequest[]) => {
    localStorage.setItem(STORAGE_KEYS.JOB_REQUESTS, JSON.stringify(requests));
  },

  getJobRequestById: (id: string): JobRequest | undefined => {
    return MockStorage.getJobRequests().find(r => r.id === id || r.requestNumber === id);
  },

  createJobRequest: (
    data: Omit<JobRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'interestedProviders' | 'providerCompleted' | 'customerConfirmed'>
  ): JobRequest => {
    const list = MockStorage.getJobRequests();
    const newId = `req-${Date.now().toString().slice(-4)}`;
    const newRequestNumber = `REQ-2026-${(list.length + 1).toString().padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newRequest: JobRequest = {
      ...data,
      id: newId,
      requestNumber: newRequestNumber,
      status: 'POSTED',
      createdAt: now,
      updatedAt: now,
      interestedProviders: [],
      providerCompleted: false,
      customerConfirmed: false,
    };

    list.unshift(newRequest);
    MockStorage.saveJobRequests(list);

    // Notify matching providers in the locality
    const providers = MockStorage.getProviders();
    const matchingProviders = providers.filter(
      p =>
        p.primaryCategory.toLowerCase() === newRequest.serviceCategory.toLowerCase() &&
        p.serviceAreas.some(
          sa =>
            sa.city.toLowerCase() === newRequest.city.toLowerCase() ||
            sa.pincode === newRequest.pincode ||
            sa.area.toLowerCase() === newRequest.locality.toLowerCase()
        )
    );

    matchingProviders.forEach(p => {
      MockStorage.addNotification({
        userId: p.userId,
        title: `New Job Request in ${newRequest.locality}`,
        message: `${newRequest.customerName} posted a request for ${newRequest.serviceType} (Budget: ₹${newRequest.budget}).`,
        type: 'INFO',
        link: `/provider/requests`,
      });
    });

    return newRequest;
  },

  expressInterest: (
    requestId: string,
    provider: InterestedProvider
  ): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    // Check if already interested
    const exists = req.interestedProviders.some(p => p.providerId === provider.providerId);
    let updatedInterested = [...req.interestedProviders];

    if (exists) {
      updatedInterested = updatedInterested.map(p =>
        p.providerId === provider.providerId ? { ...p, ...provider } : p
      );
    } else {
      updatedInterested.push(provider);
    }

    const updatedStatus: JobRequestStatus =
      req.status === 'POSTED' ? 'PROVIDER_INTERESTED' : req.status;

    const updatedReq: JobRequest = {
      ...req,
      interestedProviders: updatedInterested,
      status: updatedStatus,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);

    // Notify customer
    MockStorage.addNotification({
      userId: updatedReq.customerId,
      title: 'New Provider Interested in Your Request',
      message: `${provider.providerName} (${provider.providerRating}★) expressed interest in your ${updatedReq.serviceCategory} request.`,
      type: 'INFO',
      link: `/customer/requests/${updatedReq.id}`,
    });

    return updatedReq;
  },

  withdrawInterest: (requestId: string, providerId: string): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const updatedInterested = req.interestedProviders.filter(p => p.providerId !== providerId);
    const updatedStatus: JobRequestStatus =
      req.status === 'PROVIDER_INTERESTED' && updatedInterested.length === 0
        ? 'POSTED'
        : req.status;

    const updatedReq: JobRequest = {
      ...req,
      interestedProviders: updatedInterested,
      status: updatedStatus,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);
    return updatedReq;
  },

  acceptProvider: (requestId: string, providerId: string): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const selectedProvider = req.interestedProviders.find(p => p.providerId === providerId);
    const fullProvider = MockStorage.getProviderById(providerId);

    const updatedReq: JobRequest = {
      ...req,
      status: 'PROVIDER_ACCEPTED',
      acceptedProviderId: providerId,
      acceptedProvider: {
        id: providerId,
        name: selectedProvider?.providerName || fullProvider?.name || 'Assigned Technician',
        phone: selectedProvider?.providerPhone || fullProvider?.phone || '',
        avatar: selectedProvider?.providerAvatar || fullProvider?.avatar,
        rating: selectedProvider?.providerRating || fullProvider?.rating || 4.8,
        jobCount: selectedProvider?.providerJobCount || fullProvider?.jobCount || 100,
        verified: true,
      },
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);

    // Also automatically create/sync a booking record so existing booking tools & calendars continue working seamlessly!
    MockStorage.createBooking({
      customerId: updatedReq.customerId,
      customer: {
        id: updatedReq.customerId,
        name: updatedReq.customerName,
        email: updatedReq.customerEmail,
        phone: updatedReq.customerPhone,
        avatar: updatedReq.customerAvatar,
      },
      providerId: providerId,
      provider: {
        id: providerId,
        name: updatedReq.acceptedProvider?.name || 'Technician',
        email: fullProvider?.email || '',
        phone: updatedReq.acceptedProvider?.phone || '',
        avatar: updatedReq.acceptedProvider?.avatar,
        verified: true,
        primaryCategory: updatedReq.serviceCategory,
      },
      serviceCategoryId: updatedReq.serviceCategoryId,
      serviceCategory: updatedReq.serviceCategory,
      serviceTitle: updatedReq.serviceType,
      description: updatedReq.description,
      date: updatedReq.preferredDate,
      time: updatedReq.preferredTime,
      address: {
        street: updatedReq.addressDetails || updatedReq.locality,
        city: updatedReq.city,
        area: updatedReq.locality,
        pincode: updatedReq.pincode,
      },
      estimatedCost: updatedReq.budget,
      paymentStatus: 'UNPAID',
      status: 'ACCEPTED',
    });

    // Notify accepted provider
    MockStorage.addNotification({
      userId: fullProvider?.userId || providerId,
      title: 'Job Request Accepted by Customer! 🎉',
      message: `${updatedReq.customerName} selected you for ${updatedReq.serviceType} in ${updatedReq.locality}.`,
      type: 'SUCCESS',
      link: `/provider/bookings`,
    });

    return updatedReq;
  },

  updateJobRequestStatus: (requestId: string, status: JobRequestStatus): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const updatedReq: JobRequest = {
      ...req,
      status,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);
    return updatedReq;
  },

  providerMarkComplete: (requestId: string, providerId: string): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const now = new Date().toISOString();
    const isBothConfirmed = req.customerConfirmed;
    const finalStatus: JobRequestStatus = isBothConfirmed ? 'COMPLETED' : 'PROVIDER_MARKED_COMPLETE';

    const updatedReq: JobRequest = {
      ...req,
      providerCompleted: true,
      providerCompletedAt: now,
      status: finalStatus,
      completedAt: isBothConfirmed ? now : undefined,
      updatedAt: now,
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);

    // Notify customer to confirm
    MockStorage.addNotification({
      userId: req.customerId,
      title: 'Provider Marked Work Complete',
      message: `${req.acceptedProvider?.name || 'Technician'} marked your ${req.serviceCategory} job as completed. Please inspect and confirm.`,
      type: 'WARNING',
      link: `/customer/requests/${req.id}`,
    });

    return updatedReq;
  },

  customerConfirmComplete: (requestId: string, customerId: string): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const now = new Date().toISOString();
    // Two-sided confirmation: both sides confirm = COMPLETED
    const finalStatus: JobRequestStatus = req.providerCompleted ? 'COMPLETED' : 'CUSTOMER_CONFIRMED_COMPLETE';

    const updatedReq: JobRequest = {
      ...req,
      customerConfirmed: true,
      customerConfirmedAt: now,
      status: finalStatus,
      completedAt: req.providerCompleted ? now : undefined,
      updatedAt: now,
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);

    if (req.acceptedProviderId) {
      const prov = MockStorage.getProviderById(req.acceptedProviderId);
      if (prov) {
        prov.jobCount += 1;
        MockStorage.updateProvider(prov.id, { jobCount: prov.jobCount });
        MockStorage.addNotification({
          userId: prov.userId,
          title: 'Customer Confirmed Service Completion! ⭐',
          message: `${req.customerName} confirmed completion for ${req.serviceType}.`,
          type: 'SUCCESS',
          link: `/provider/bookings`,
        });
      }
    }

    return updatedReq;
  },

  cancelJobRequest: (requestId: string, reason: string, cancelledBy?: UserRole): JobRequest => {
    const list = MockStorage.getJobRequests();
    const idx = list.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Job request not found');

    const req = list[idx];
    const updatedReq: JobRequest = {
      ...req,
      status: 'CANCELLED',
      cancellationReason: reason,
      cancelledBy,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updatedReq;
    MockStorage.saveJobRequests(list);
    return updatedReq;
  }
};
