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

    public RatingController(RatingService ratingService, AuthService authService) {
        this.ratingService = ratingService;
        this.authService = authService;
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
     * Get all ratings for a given electrician.
     */
    @GetMapping({"/api/ratings/electrician/{id}", "/api/providers/{id}/reviews"})
    public ResponseEntity<List<RatingDto>> getRatingsByElectricianId(@PathVariable Long id) {
        List<RatingDto> ratings = ratingService.getRatingsByElectricianId(id);
        return ResponseEntity.ok(ratings);
    }
}
