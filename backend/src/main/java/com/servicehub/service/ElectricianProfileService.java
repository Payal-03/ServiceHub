package com.servicehub.service;

import com.servicehub.dto.ElectricianProfileDto;
import com.servicehub.dto.UpdateElectricianProfileDto;
import com.servicehub.entity.ElectricianProfile;
import com.servicehub.entity.User;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.ElectricianProfileRepository;
import com.servicehub.repository.RatingRepository;
import com.servicehub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ElectricianProfileService {

    private final ElectricianProfileRepository electricianProfileRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    public ElectricianProfileService(ElectricianProfileRepository electricianProfileRepository,
                                     RatingRepository ratingRepository,
                                     UserRepository userRepository) {
        this.electricianProfileRepository = electricianProfileRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }

    public ElectricianProfileDto getProfileByUserId(Long userId) {
        ElectricianProfile profile = electricianProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for user ID: " + userId));
        return mapToDto(profile);
    }

    public ElectricianProfileDto getProfileByElectricianId(Long electricianId) {
        ElectricianProfile profile = electricianProfileRepository.findById(electricianId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for ID: " + electricianId));
        return mapToDto(profile);
    }

    @Transactional
    public ElectricianProfileDto updateProfile(Long electricianId, UpdateElectricianProfileDto dto, Long currentUserId) {
        ElectricianProfile profile = electricianProfileRepository.findById(electricianId)
                .orElseThrow(() -> new ResourceNotFoundException("Electrician profile not found for ID: " + electricianId));

        // Ensure only the owner can update their profile
        if (!profile.getUser().getUserId().equals(currentUserId)) {
            throw new BadRequestException("You can only update your own electrician profile.");
        }

        if (dto.getSkills() != null) {
            profile.setSkills(dto.getSkills().trim());
        }
        if (dto.getServiceCity() != null) {
            profile.setServiceCity(dto.getServiceCity().trim());
        }
        if (dto.getServiceLocality() != null) {
            profile.setServiceLocality(dto.getServiceLocality().trim());
        }
        if (dto.getExperienceYears() != null) {
            profile.setExperienceYears(dto.getExperienceYears());
        }
        if (dto.getDescription() != null) {
            profile.setDescription(dto.getDescription().trim());
        }

        // Optionally update user name or phone if provided
        User user = profile.getUser();
        boolean userUpdated = false;
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setFullName(dto.getName().trim());
            userUpdated = true;
        }
        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            user.setPhone(dto.getPhone().trim());
            userUpdated = true;
        }
        if (userUpdated) {
            userRepository.save(user);
        }

        ElectricianProfile saved = electricianProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public ElectricianProfileDto mapToDto(ElectricianProfile profile) {
        ElectricianProfileDto dto = new ElectricianProfileDto();
        dto.setId(String.valueOf(profile.getElectricianId()));
        dto.setUserId(String.valueOf(profile.getUser().getUserId()));
        dto.setName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getUser().getPhone());
        dto.setSkills(profile.getSkills());
        dto.setServiceCity(profile.getServiceCity());
        dto.setServiceLocality(profile.getServiceLocality());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setDescription(profile.getDescription());
        dto.setBio(profile.getDescription());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());

        // Calculate average rating dynamically from ratings table
        Double avgRating = ratingRepository.calculateAverageScoreByUserId(profile.getUser().getUserId());
        long ratingCount = ratingRepository.countByRevieweeUser_UserId(profile.getUser().getUserId());

        if (avgRating != null) {
            dto.setRating(Math.round(avgRating * 10.0) / 10.0);
        } else {
            dto.setRating(5.0);
        }
        dto.setRatingCount(ratingCount);
        dto.setJobCount(ratingCount);

        return dto;
    }
}
