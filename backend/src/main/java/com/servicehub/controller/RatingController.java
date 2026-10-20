package com.servicehub.controller;

import com.servicehub.dto.CreateRatingDto;
import com.servicehub.dto.RatingDto;
import com.servicehub.entity.User;
import com.servicehub.service.AuthService;
import com.servicehub.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class RatingController {

    private final RatingService ratingService;
    private final AuthService authService;
    private final com.servicehub.repository.RatingRepository ratingRepository;

    public RatingController(RatingService ratingService, AuthService authService,
                            com.servicehub.repository.RatingRepository ratingRepository) {
        this.ratingService = ratingService;
        this.authService = authService;
        this.ratingRepository = ratingRepository;
    }

    /**
     * Create rating for a completed request.
     */
    @PostMapping({"/api/ratings", "/api/reviews"})
    public ResponseEntity<RatingDto> createRating(
            @Valid @RequestBody CreateRatingDto dto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        RatingDto created = ratingService.createRating(dto, user.getUserId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Get all ratings received by the currently authenticated user.
     * Returns a map with: ratings (list), averageScore, totalCount, userName.
     */
    @GetMapping("/api/ratings/my")
    public ResponseEntity<java.util.Map<String, Object>> getMyRatings(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = authService.getUserByEmail(principal.getName());
        List<RatingDto> ratings = ratingService.getRatingsByUserId(user.getUserId());
        Double avgScore = ratingRepository.calculateAverageScoreByUserId(user.getUserId());
        long totalCount = ratingRepository.countByRevieweeUser_UserId(user.getUserId());

        java.util.Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("ratings", ratings);
        result.put("averageScore", avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : null);
        result.put("totalCount", totalCount);
        result.put("userName", user.getFullName());
        result.put("userEmail", user.getEmail());
        result.put("userRole", user.getRole().name());
        return ResponseEntity.ok(result);
    }

    /**
     * Get all ratings for a given electrician.
     */
    @GetMapping({"/api/ratings/electrician/{id}", "/api/providers/{id}/reviews"})
    public ResponseEntity<List<RatingDto>> getRatingsByElectricianId(@PathVariable Long id) {
        List<RatingDto> ratings = ratingService.getRatingsByElectricianId(id);
        return ResponseEntity.ok(ratings);
    }
}
