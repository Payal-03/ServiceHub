import { MockStorage } from './mockStorage';
import { JobRequest, JobRequestStatus, InterestedProvider, UserRole } from '../types';

/**
 * Service layer for Job Requests (Need Posting Model).
 * Follows standard RESTful signatures, allowing seamless switch between
 * local MockStorage and real Spring Boot REST endpoints.
 */
export const jobRequestService = {
  /**
   * Create a new job request posted by a customer.
   * Maps to: POST /api/requests
   */
  createRequest: async (
    data: Omit<JobRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'interestedProviders' | 'providerCompleted' | 'customerConfirmed'>
  ): Promise<JobRequest> => {
    // Artificial slight async latency for realistic UX feel
    await new Promise((r) => setTimeout(r, 200));
    return MockStorage.createJobRequest(data);
  },

  /**
   * Retrieve all requests posted by a specific customer.
   * Maps to: GET /api/requests/my?customerId=...
   */
  getCustomerRequests: async (customerId: string): Promise<JobRequest[]> => {
    await new Promise((r) => setTimeout(r, 100));
    const all = MockStorage.getJobRequests();
    return all.filter((r) => r.customerId === customerId);
  },

  /**
   * Retrieve available job requests for a provider based on:
   * 1. Category matching
   * 2. Territory / City / Locality / Pincode coverage
   * Maps to: GET /api/requests/available?providerId=...
   */
  getAvailableRequestsForProvider: async (
    providerId: string,
    filters?: { category?: string; city?: string; area?: string; maxBudget?: number }
  ): Promise<JobRequest[]> => {
    await new Promise((r) => setTimeout(r, 150));
    const all = MockStorage.getJobRequests();
    const provider = MockStorage.getProviderById(providerId);

    // Active requests that are either open (POSTED / PROVIDER_INTERESTED) or in-progress
    let relevant = all.filter(
      (r) =>
        r.status === 'POSTED' ||
        r.status === 'PROVIDER_INTERESTED' ||
        r.acceptedProviderId === providerId
    );

    if (provider) {
      relevant = relevant.filter((r) => {
        // If this provider is already accepted, always show it in their jobs
        if (r.acceptedProviderId === providerId) return true;

        // Match category
        const categoryMatch =
          r.serviceCategory.toLowerCase() === provider.primaryCategory.toLowerCase() ||
          provider.services.some(
            (s) => s.categoryName.toLowerCase() === r.serviceCategory.toLowerCase()
          );

        if (!categoryMatch) return false;

        // Territory matching (City / Area / Pincode)
        const areaMatch =
          provider.serviceAreas.length === 0 ||
          provider.serviceAreas.some(
            (sa) =>
              sa.city.toLowerCase() === r.city.toLowerCase() ||
              sa.pincode === r.pincode ||
              sa.area.toLowerCase().includes(r.locality.toLowerCase()) ||
              r.locality.toLowerCase().includes(sa.area.toLowerCase())
          );

        return areaMatch;
      });
    }

    // Apply optional runtime filters
    if (filters?.category) {
      relevant = relevant.filter((r) =>
        r.serviceCategory.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    if (filters?.city) {
      relevant = relevant.filter(
        (r) => r.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }
    if (filters?.area) {
      relevant = relevant.filter(
        (r) =>
          r.locality.toLowerCase().includes(filters.area!.toLowerCase()) ||
          r.pincode.includes(filters.area!)
      );
    }
    if (filters?.maxBudget) {
      relevant = relevant.filter((r) => r.budget <= filters.maxBudget!);
    }

    return relevant;
  },

  /**
   * Get single job request by ID or requestNumber.
   * Maps to: GET /api/requests/:id
   */
  getRequestById: async (id: string): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 100));
    const req = MockStorage.getJobRequestById(id);
    if (!req) throw new Error('Service request not found');
    return req;
  },

  /**
   * Provider expresses interest in a request.
   * Maps to: POST /api/requests/:id/interest
   */
  expressInterest: async (
    requestId: string,
    provider: InterestedProvider
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 150));
    return MockStorage.expressInterest(requestId, provider);
  },

  /**
   * Provider withdraws interest from a request.
   * Maps to: DELETE /api/requests/:id/interest
   */
  withdrawInterest: async (
    requestId: string,
    providerId: string
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 100));
    return MockStorage.withdrawInterest(requestId, providerId);
  },

  /**
   * Customer accepts one of the interested providers.
   * Maps to: POST /api/requests/:id/accept
   */
  acceptProvider: async (
    requestId: string,
    providerId: string
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 200));
    return MockStorage.acceptProvider(requestId, providerId);
  },

  /**
   * Update request status (e.g. IN_PROGRESS).
   * Maps to: PATCH /api/requests/:id/status
   */
  updateStatus: async (
    requestId: string,
    status: JobRequestStatus
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 100));
    return MockStorage.updateJobRequestStatus(requestId, status);
  },

  /**
   * Provider marks job complete (Two-sided step 1).
   * Maps to: PATCH /api/requests/:id/provider-complete
   */
  providerMarkComplete: async (
    requestId: string,
    providerId: string
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 150));
    return MockStorage.providerMarkComplete(requestId, providerId);
  },

  /**
   * Customer confirms service completion (Two-sided step 2 -> COMPLETED).
   * Maps to: PATCH /api/requests/:id/customer-confirm
   */
  customerConfirmComplete: async (
    requestId: string,
    customerId: string
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 150));
    return MockStorage.customerConfirmComplete(requestId, customerId);
  },

  /**
   * Cancel request.
   * Maps to: POST /api/requests/:id/cancel
   */
  cancelRequest: async (
    requestId: string,
    reason: string,
    cancelledBy?: UserRole
  ): Promise<JobRequest> => {
    await new Promise((r) => setTimeout(r, 100));
    return MockStorage.cancelJobRequest(requestId, reason, cancelledBy);
  },

  /**
   * Global audit list for Admin.
   * Maps to: GET /api/requests/all
   */
  getAllRequests: async (): Promise<JobRequest[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return MockStorage.getJobRequests();
  },
};
