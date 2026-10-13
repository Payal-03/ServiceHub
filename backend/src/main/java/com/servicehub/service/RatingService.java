package com.servicehub.service;

import com.servicehub.dto.CreateRatingDto;
import com.servicehub.dto.RatingDto;
import com.servicehub.entity.*;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ConflictException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.ElectricianProfileRepository;
import com.servicehub.repository.RatingRepository;
import com.servicehub.repository.ServiceRequestRepository;
import com.servicehub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final ElectricianProfileRepository electricianProfileRepository;

    public RatingService(RatingRepository ratingRepository,
                         ServiceRequestRepository serviceRequestRepository,
                         UserRepository userRepository,
                         ElectricianProfileRepository electricianProfileRepository) {
        this.ratingRepository = ratingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
        this.electricianProfileRepository = electricianProfileRepository;
    }

    /**
     * Create rating.
     * Rule: Ratings are mutual: one rating per person per completed request.
     * Only the customer and the selected electrician of that request can rate, and only after COMPLETED.
     */
    @Transactional
    public RatingDto createRating(CreateRatingDto dto, Long reviewerUserId) {
        Long requestId = dto.getResolvedRequestId();
        if (requestId == null) {
            throw new BadRequestException("Request ID is required.");
        }

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found for ID: " + requestId));

        // Rule: Only after COMPLETED
        if (request.getStatus() != RequestStatus.COMPLETED) {
            throw new BadRequestException("Ratings can only be submitted after the request is COMPLETED.");
        }

        User customerUser = request.getCustomer().getUser();
        ElectricianProfile selectedElectrician = request.getSelectedElectrician();

        if (selectedElectrician == null) {
            throw new BadRequestException("No electrician was selected for this request.");
        }
        User electricianUser = selectedElectrician.getUser();

        // Rule: Only the customer and the selected electrician can rate
        boolean isCustomer = customerUser.getUserId().equals(reviewerUserId);
        boolean isElectrician = electricianUser.getUserId().equals(reviewerUserId);

        if (!isCustomer && !isElectrician) {
            throw new BadRequestException("Only the customer or the selected electrician of this request can submit a rating.");
        }

        // Rule: One rating per person per completed request (enforce unique constraint)
        if (ratingRepository.existsByRequest_RequestIdAndReviewerUser_UserId(requestId, reviewerUserId)) {
            throw new ConflictException("You have already submitted a rating for this service request.");
        }

        // Determine who is reviewing whom
        User reviewer = isCustomer ? customerUser : electricianUser;
        User reviewee = isCustomer ? electricianUser : customerUser;

        Rating rating = new Rating();
        rating.setRequest(request);
        rating.setReviewerUser(reviewer);
        rating.setRevieweeUser(reviewee);
        rating.setScore(dto.getResolvedScore());
        rating.setReview(dto.getResolvedReview());

        Rating saved = ratingRepository.save(rating);
        return mapToDto(saved);
    }

    /**
     * Get all ratings received by an electrician.
     */
    public List<RatingDto> getRatingsByElectricianId(Long electricianId) {
        ElectricianProfile profile = electricianProfileRepository.findById(electricianId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for ID: " + electricianId));

        return ratingRepository.findByRevieweeUser_UserIdOrderByCreatedAtDesc(profile.getUser().getUserId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all ratings received by a user ID.
     */
    public List<RatingDto> getRatingsByUserId(Long userId) {
        return ratingRepository.findByRevieweeUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RatingDto mapToDto(Rating rating) {
        RatingDto dto = new RatingDto();
        dto.setRatingId(rating.getRatingId());
        dto.setRequestId(rating.getRequest().getRequestId());

        if (rating.getReviewerUser() != null) {
            dto.setReviewerUserId(rating.getReviewerUser().getUserId());
            dto.setReviewerName(rating.getReviewerUser().getFullName());
        }

        if (rating.getRevieweeUser() != null) {
            dto.setRevieweeUserId(rating.getRevieweeUser().getUserId());
            dto.setRevieweeName(rating.getRevieweeUser().getFullName());
        }

        dto.setScore(rating.getScore());
        dto.setReview(rating.getReview());
        dto.setCreatedAt(rating.getCreatedAt());

        return dto;
    }
}
