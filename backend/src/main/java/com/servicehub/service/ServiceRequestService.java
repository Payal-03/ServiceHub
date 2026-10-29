package com.servicehub.service;

import com.servicehub.dto.CreateRequestDto;
import com.servicehub.dto.ExpressInterestDto;
import com.servicehub.dto.InterestDto;
import com.servicehub.dto.ServiceRequestDto;
import com.servicehub.dto.UpdateRequestDto;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ConflictException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final CustomerRepository customerRepository;
    private final ElectricianProfileRepository electricianProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final RequestInterestRepository requestInterestRepository;
    private final RatingRepository ratingRepository;
    private final NotificationService notificationService;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                 CustomerRepository customerRepository,
                                 ElectricianProfileRepository electricianProfileRepository,
                                 ServiceCategoryRepository serviceCategoryRepository,
                                 RequestInterestRepository requestInterestRepository,
                                 RatingRepository ratingRepository,
                                 NotificationService notificationService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.customerRepository = customerRepository;
        this.electricianProfileRepository = electricianProfileRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.requestInterestRepository = requestInterestRepository;
        this.ratingRepository = ratingRepository;
        this.notificationService = notificationService;
    }

    /**
     * 1. Customer creates a request.
     */
    @Transactional
    public ServiceRequestDto createRequest(CreateRequestDto dto, Long currentUserId) {
        Customer customer = customerRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user ID: " + currentUserId));

        // Resolve category
        ServiceCategory category = null;
        Long categoryId = dto.getResolvedCategoryId();
        if (categoryId != null) {
            category = serviceCategoryRepository.findById(categoryId).orElse(null);
        }
        if (category == null && dto.getServiceCategory() != null && !dto.getServiceCategory().trim().isEmpty()) {
            category = serviceCategoryRepository.findByCategoryNameIgnoreCase(dto.getServiceCategory().trim()).orElse(null);
        }
        if (category == null) {
            List<ServiceCategory> activeCategories = serviceCategoryRepository.findByIsActiveTrue();
            if (!activeCategories.isEmpty()) {
                category = activeCategories.get(0);
            } else {
                throw new BadRequestException("No active service category found.");
            }
        }

        BigDecimal budget = dto.getResolvedBudget();
        if (budget.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Budget must be greater than zero.");
        }

        ServiceRequest request = new ServiceRequest();
        request.setCustomer(customer);
        request.setCategory(category);
        request.setTitle(dto.getResolvedTitle());
        request.setDescription(dto.getDescription().trim());
        request.setCity(dto.getCity().trim());
        request.setLocality(dto.getLocality().trim());
        request.setAddress(dto.getResolvedAddress());
        request.setExpectedBudget(budget);
        request.setStatus(RequestStatus.OPEN);
        request.setCustomerConfirmed(false);
        request.setElectricianConfirmed(false);

        ServiceRequest saved = serviceRequestRepository.save(request);
        return mapToDto(saved);
    }

    /**
     * Customer updates their posted job.
     * Rule 1: Only the customer who posted the request can update it.
     * Rule 2: Can ONLY be updated while status is OPEN.
     * Rule 3: If an electrician is selected for the job, NO further changes can be made.
     * Rule 4: Electricians who have shown interest in this job are notified about this job update.
     */
    @Transactional
    public ServiceRequestDto updateRequest(Long requestId, UpdateRequestDto dto, Long currentUserId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        // Rule 1: Customer ownership check
        if (!request.getCustomer().getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("Only the customer who posted this request can edit it.");
        }

        // Rule 3: Electrician selection check
        if (request.getSelectedElectrician() != null) {
            throw new BadRequestException("No further changes can be made to this job post because an electrician has already been selected.");
        }

        // Rule 2: Status check
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("Job posts can only be edited while they are OPEN.");
        }

        // Update Category if provided
        Long categoryId = dto.getResolvedCategoryId();
        if (categoryId != null) {
            ServiceCategory category = serviceCategoryRepository.findById(categoryId).orElse(null);
            if (category != null) {
                request.setCategory(category);
            }
        } else if (dto.getServiceCategory() != null && !dto.getServiceCategory().trim().isEmpty()) {
            ServiceCategory category = serviceCategoryRepository.findByCategoryNameIgnoreCase(dto.getServiceCategory().trim()).orElse(null);
            if (category != null) {
                request.setCategory(category);
            }
        }

        // Update Title if provided
        String title = dto.getResolvedTitle();
        if (title != null && !title.trim().isEmpty()) {
            request.setTitle(title);
        }

        // Update Description
        if (dto.getDescription() != null && !dto.getDescription().trim().isEmpty()) {
            request.setDescription(dto.getDescription().trim());
        }

        // Update City
        if (dto.getCity() != null && !dto.getCity().trim().isEmpty()) {
            request.setCity(dto.getCity().trim());
        }

        // Update Locality
        if (dto.getLocality() != null && !dto.getLocality().trim().isEmpty()) {
            request.setLocality(dto.getLocality().trim());
        }

        // Update Address
        if (dto.getResolvedAddress() != null && !dto.getResolvedAddress().trim().isEmpty()) {
            request.setAddress(dto.getResolvedAddress());
        }

        // Update Budget
        BigDecimal budget = dto.getResolvedBudget();
        if (budget != null) {
            if (budget.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Budget must be greater than zero.");
            }
            request.setExpectedBudget(budget);
        }

        request.setUpdatedAt(LocalDateTime.now());
        ServiceRequest updated = serviceRequestRepository.save(request);

        // Rule 4: Notify electricians who have shown interest in this job
        List<RequestInterest> interests = requestInterestRepository
                .findByRequest_RequestIdOrderByCreatedAtDesc(requestId);

        String notificationTitle = "Job Post Updated: " + updated.getTitle();
        String notificationMessage = String.format(
                "Customer has updated job details for \"%s\" (New Budget: ₹%s, Locality: %s, %s). Please review the updated job requirements.",
                updated.getTitle(),
                updated.getExpectedBudget() != null ? updated.getExpectedBudget().stripTrailingZeros().toPlainString() : "N/A",
                updated.getLocality(),
                updated.getCity()
        );

        for (RequestInterest interest : interests) {
            if (interest.getElectrician() != null && interest.getElectrician().getUser() != null) {
                User electricianUser = interest.getElectrician().getUser();
                notificationService.createNotification(
                        electricianUser,
                        updated,
                        notificationTitle,
                        notificationMessage,
                        "JOB_UPDATED"
                );
            }
        }

        return mapToDto(updated);
    }

    /**
     * 2. Customer views their own requests.
     */
    public List<ServiceRequestDto> getCustomerRequests(Long currentUserId) {
        Customer customer = customerRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user ID: " + currentUserId));

        List<ServiceRequest> requests = serviceRequestRepository.findByCustomer_CustomerIdOrderByCreatedAtDesc(customer.getCustomerId());
        return requests.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * 2b. Electrician views all requests they have bid on (via their interests).
     */
    public List<ServiceRequestDto> getElectricianRequests(Long currentUserId) {
        ElectricianProfile electrician = electricianProfileRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for user ID: " + currentUserId));

        List<RequestInterest> interests = requestInterestRepository
                .findByElectrician_ElectricianIdOrderByCreatedAtDesc(electrician.getElectricianId());

        return interests.stream()
                .map(i -> mapToDto(i.getRequest()))
                .collect(Collectors.toList());
    }

    /**
     * 3. View single request with interests.
     */
    public ServiceRequestDto getRequestById(Long requestId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));
        return mapToDto(request);
    }

    /**
     * 4. Customer cancels request (OPEN only).
     */
    @Transactional
    public ServiceRequestDto cancelRequest(Long requestId, Long currentUserId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        if (!request.getCustomer().getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("Only the customer who posted this request can cancel it.");
        }

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("A request can only be cancelled while it is OPEN.");
        }

        request.setStatus(RequestStatus.CANCELLED);
        ServiceRequest saved = serviceRequestRepository.save(request);
        return mapToDto(saved);
    }

    /**
     * 5. Browse OPEN requests (filtered by category, city, locality, and price range).
     */
    public List<ServiceRequestDto> browseOpenRequests(
            Long categoryId,
            String categoryName,
            String city,
            String locality,
            BigDecimal minPrice,
            BigDecimal maxPrice) {
        String cleanCategoryName = (categoryName != null && !categoryName.trim().isEmpty()) ? categoryName.trim() : null;
        String cleanCity = (city != null && !city.trim().isEmpty()) ? city.trim() : null;
        String cleanLocality = (locality != null && !locality.trim().isEmpty()) ? locality.trim() : null;

        List<ServiceRequest> requests = serviceRequestRepository.findOpenRequestsFiltered(
                RequestStatus.OPEN,
                categoryId,
                cleanCategoryName,
                cleanCity,
                cleanLocality,
                minPrice,
                maxPrice
        );

        return requests.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ServiceRequestDto> browseOpenRequests(String city, String locality) {
        return browseOpenRequests(null, null, city, locality, null, null);
    }

    /**
     * 6. Electrician expresses interest with bid amount and message.
     * Rule: If status is WITHDRAWN, they cannot express interest again in the same request.
     */
    @Transactional
    public ServiceRequestDto expressInterest(Long requestId, ExpressInterestDto dto, Long currentUserId) {
        ElectricianProfile electrician = electricianProfileRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for user ID: " + currentUserId));

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("You can only bid or express interest on OPEN requests.");
        }

        Optional<RequestInterest> existingInterest = requestInterestRepository
                .findByRequest_RequestIdAndElectrician_ElectricianId(requestId, electrician.getElectricianId());

        if (existingInterest.isPresent()) {
            RequestInterest prev = existingInterest.get();
            if (prev.getStatus() == InterestStatus.WITHDRAWN) {
                throw new BadRequestException("You have withdrawn interest and cannot express interest again in this request.");
            }
            throw new ConflictException("You have already expressed interest in this request.");
        }

        BigDecimal bidAmount = dto.getResolvedBidAmount();
        if (bidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            bidAmount = request.getExpectedBudget();
        }

        RequestInterest interest = new RequestInterest();
        interest.setRequest(request);
        interest.setElectrician(electrician);
        interest.setBidAmount(bidAmount);
        interest.setMessage(dto.getResolvedMessage());
        interest.setStatus(InterestStatus.INTERESTED);

        requestInterestRepository.save(interest);

        return mapToDto(request);
    }

    /**
     * 7. Electrician withdraws interest. Record kept with status WITHDRAWN.
     */
    @Transactional
    public ServiceRequestDto withdrawInterest(Long requestId, Long currentUserId) {
        ElectricianProfile electrician = electricianProfileRepository.findByUser_UserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for user ID: " + currentUserId));

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("Interest can only be withdrawn while the request is OPEN.");
        }

        RequestInterest interest = requestInterestRepository
                .findByRequest_RequestIdAndElectrician_ElectricianId(requestId, electrician.getElectricianId())
                .orElseThrow(() -> new ResourceNotFoundException("No interest record found for this request."));

        if (interest.getStatus() == InterestStatus.WITHDRAWN) {
            throw new BadRequestException("Interest has already been withdrawn.");
        }

        interest.setStatus(InterestStatus.WITHDRAWN);
        requestInterestRepository.save(interest);

        return mapToDto(request);
    }

    /**
     * 8. Customer selects electrician.
     * Rule: Only owner customer, only on OPEN request, only an electrician who showed interest.
     * Set selected_electrician_id, status IN_PROGRESS, that interest SELECTED, others NOT_SELECTED in one transaction.
     */
    @Transactional
    public ServiceRequestDto selectElectrician(Long requestId, Long electricianId, Long currentUserId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        // Only owner customer
        if (!request.getCustomer().getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("Only the owner customer can select an electrician.");
        }

        // Only on OPEN request
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("An electrician can only be selected when the request is OPEN.");
        }

        ElectricianProfile electrician = electricianProfileRepository.findById(electricianId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for ID: " + electricianId));

        // Must be an electrician who showed interest with status INTERESTED
        RequestInterest selectedInterest = requestInterestRepository
                .findByRequest_RequestIdAndElectrician_ElectricianId(requestId, electricianId)
                .orElseThrow(() -> new BadRequestException("Selected electrician must have expressed interest in this request."));

        if (selectedInterest.getStatus() != InterestStatus.INTERESTED) {
            throw new BadRequestException("Cannot select an electrician whose interest is " + selectedInterest.getStatus());
        }

        // Update request: selected_electrician_id and status IN_PROGRESS
        request.setSelectedElectrician(electrician);
        request.setStatus(RequestStatus.IN_PROGRESS);
        serviceRequestRepository.save(request);

        // Update interests: that interest SELECTED, other interests NOT_SELECTED
        List<RequestInterest> allInterests = requestInterestRepository.findByRequest_RequestIdOrderByCreatedAtDesc(requestId);
        for (RequestInterest interest : allInterests) {
            if (interest.getElectrician().getElectricianId().equals(electricianId)) {
                interest.setStatus(InterestStatus.SELECTED);
            } else if (interest.getStatus() == InterestStatus.INTERESTED) {
                interest.setStatus(InterestStatus.NOT_SELECTED);
            }
            requestInterestRepository.save(interest);
        }

        return mapToDto(request);
    }

    /**
     * 9. Customer confirms completion.
     * Rule: When both customer and selected electrician confirm, status becomes COMPLETED.
     */
    @Transactional
    public ServiceRequestDto customerConfirmCompletion(Long requestId, Long currentUserId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        if (!request.getCustomer().getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("Only the customer of this request can confirm completion.");
        }

        if (request.getStatus() != RequestStatus.IN_PROGRESS) {
            throw new BadRequestException("Request must be IN_PROGRESS to confirm completion.");
        }

        request.setCustomerConfirmed(true);

        if (Boolean.TRUE.equals(request.getElectricianConfirmed())) {
            request.setStatus(RequestStatus.COMPLETED);
        }

        ServiceRequest saved = serviceRequestRepository.save(request);
        return mapToDto(saved);
    }

    /**
     * 10. Selected electrician confirms completion.
     * Rule: When both customer and selected electrician confirm, status becomes COMPLETED.
     */
    @Transactional
    public ServiceRequestDto electricianConfirmCompletion(Long requestId, Long currentUserId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        if (request.getSelectedElectrician() == null ||
            !request.getSelectedElectrician().getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("Only the selected electrician can confirm completion for this request.");
        }

        if (request.getStatus() != RequestStatus.IN_PROGRESS) {
            throw new BadRequestException("Request must be IN_PROGRESS to confirm completion.");
        }

        request.setElectricianConfirmed(true);

        if (Boolean.TRUE.equals(request.getCustomerConfirmed())) {
            request.setStatus(RequestStatus.COMPLETED);
        }

        ServiceRequest saved = serviceRequestRepository.save(request);
        return mapToDto(saved);
    }

    public ServiceRequestDto mapToDto(ServiceRequest req) {
        ServiceRequestDto dto = new ServiceRequestDto();
        dto.setId(String.valueOf(req.getRequestId()));
        dto.setRequestNumber("REQ-" + req.getRequestId());

        if (req.getCustomer() != null) {
            dto.setCustomerId(String.valueOf(req.getCustomer().getCustomerId()));
            if (req.getCustomer().getUser() != null) {
                dto.setCustomerName(req.getCustomer().getUser().getFullName());
                dto.setCustomerPhone(req.getCustomer().getUser().getPhone());
                dto.setCustomerEmail(req.getCustomer().getUser().getEmail());
            }
        }

        if (req.getCategory() != null) {
            dto.setServiceCategoryId(String.valueOf(req.getCategory().getCategoryId()));
            dto.setServiceCategory(req.getCategory().getCategoryName());
        }

        dto.setTitle(req.getTitle());
        dto.setServiceType(req.getTitle());
        dto.setDescription(req.getDescription());
        dto.setCity(req.getCity());
        dto.setLocality(req.getLocality());
        dto.setAddress(req.getAddress());
        dto.setAddressDetails(req.getAddress());
        dto.setBudget(req.getExpectedBudget());
        dto.setExpectedBudget(req.getExpectedBudget());
        dto.setStatus(req.getStatus().name());

        if (req.getSelectedElectrician() != null) {
            dto.setSelectedElectricianId(String.valueOf(req.getSelectedElectrician().getElectricianId()));
            dto.setAcceptedProviderId(String.valueOf(req.getSelectedElectrician().getElectricianId()));

            Double avgRating = ratingRepository.calculateAverageScoreByUserId(
                    req.getSelectedElectrician().getUser().getUserId()
            );

            ServiceRequestDto.ElectricianSummaryDto summary = new ServiceRequestDto.ElectricianSummaryDto(
                    String.valueOf(req.getSelectedElectrician().getElectricianId()),
                    req.getSelectedElectrician().getUser().getFullName(),
                    req.getSelectedElectrician().getUser().getPhone(),
                    req.getSelectedElectrician().getUser().getEmail(),
                    avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0,
                    req.getSelectedElectrician().getExperienceYears()
            );
            dto.setSelectedElectrician(summary);
            dto.setAcceptedProvider(summary);
        }

        dto.setCustomerConfirmed(Boolean.TRUE.equals(req.getCustomerConfirmed()));
        dto.setElectricianConfirmed(Boolean.TRUE.equals(req.getElectricianConfirmed()));
        dto.setProviderCompleted(Boolean.TRUE.equals(req.getElectricianConfirmed()));

        // Populate interests
        List<RequestInterest> interests = requestInterestRepository
                .findByRequest_RequestIdOrderByCreatedAtDesc(req.getRequestId());

        List<InterestDto> interestDtos = interests.stream()
                .filter(i -> i.getStatus() != InterestStatus.WITHDRAWN)
                .map(this::mapInterestToDto)
                .collect(Collectors.toList());

        dto.setInterestedProviders(interestDtos);
        dto.setInterestedCount(interestDtos.size());

        dto.setCreatedAt(req.getCreatedAt());
        dto.setUpdatedAt(req.getUpdatedAt());

        return dto;
    }

    private InterestDto mapInterestToDto(RequestInterest interest) {
        InterestDto dto = new InterestDto();
        dto.setInterestId(interest.getInterestId());
        dto.setRequestId(interest.getRequest().getRequestId());
        dto.setElectricianId(interest.getElectrician().getElectricianId());
        dto.setElectricianName(interest.getElectrician().getUser().getFullName());
        dto.setElectricianPhone(interest.getElectrician().getUser().getPhone());
        dto.setElectricianEmail(interest.getElectrician().getUser().getEmail());
        dto.setElectricianExperienceYears(interest.getElectrician().getExperienceYears());
        dto.setSkills(interest.getElectrician().getSkills());
        dto.setDescription(interest.getElectrician().getDescription());
        dto.setServiceCity(interest.getElectrician().getServiceCity());
        dto.setServiceLocality(interest.getElectrician().getServiceLocality());

        Double avg = ratingRepository.calculateAverageScoreByUserId(
                interest.getElectrician().getUser().getUserId()
        );
        dto.setElectricianRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0);

        dto.setBidAmount(interest.getBidAmount());
        dto.setStatus(interest.getStatus().name());
        dto.setMessage(interest.getMessage());
        dto.setCreatedAt(interest.getCreatedAt());

        return dto;
    }
}
