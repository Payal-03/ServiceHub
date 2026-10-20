package com.servicehub.controller;

import com.servicehub.dto.CustomerProfileDto;
import com.servicehub.dto.RatingDto;
import com.servicehub.dto.UpdateCustomerProfileDto;
import com.servicehub.entity.Customer;
import com.servicehub.entity.User;
import com.servicehub.repository.CustomerRepository;
import com.servicehub.repository.RatingRepository;
import com.servicehub.repository.ServiceRequestRepository;
import com.servicehub.repository.UserRepository;
import com.servicehub.service.AuthService;
import com.servicehub.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final RatingRepository ratingRepository;
    private final RatingService ratingService;
    private final ServiceRequestRepository serviceRequestRepository;

    public CustomerController(CustomerRepository customerRepository,
                              UserRepository userRepository,
                              AuthService authService,
                              RatingRepository ratingRepository,
                              RatingService ratingService,
                              ServiceRequestRepository serviceRequestRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.ratingRepository = ratingRepository;
        this.ratingService = ratingService;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @GetMapping({"/api/customers/me", "/api/customer/profile"})
    public ResponseEntity<CustomerProfileDto> getCustomerProfile(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        Customer customer = customerRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> customerRepository.save(new Customer(user)));

        CustomerProfileDto dto = buildProfileDto(user, customer);
        return ResponseEntity.ok(dto);
    }

    @PutMapping({"/api/customers/me", "/api/customer/profile"})
    @Transactional
    public ResponseEntity<CustomerProfileDto> updateCustomerProfile(
            @RequestBody UpdateCustomerProfileDto updateDto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        Customer customer = customerRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> new Customer(user));

        if (updateDto.getFullName() != null && !updateDto.getFullName().trim().isEmpty()) {
            user.setFullName(updateDto.getFullName().trim());
        }
        if (updateDto.getPhone() != null) {
            user.setPhone(updateDto.getPhone().trim());
        }
        userRepository.save(user);

        if (updateDto.getDefaultCity() != null) {
            customer.setDefaultCity(updateDto.getDefaultCity().trim());
        }
        if (updateDto.getDefaultLocality() != null) {
            customer.setDefaultLocality(updateDto.getDefaultLocality().trim());
        }
        if (updateDto.getDefaultAddress() != null) {
            customer.setDefaultAddress(updateDto.getDefaultAddress().trim());
        }
        customer.setUser(user);
        Customer savedCustomer = customerRepository.save(customer);

        CustomerProfileDto dto = buildProfileDto(user, savedCustomer);
        return ResponseEntity.ok(dto);
    }

    private CustomerProfileDto buildProfileDto(User user, Customer customer) {
        CustomerProfileDto dto = new CustomerProfileDto();
        dto.setCustomerId(customer.getCustomerId());
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDefaultCity(customer.getDefaultCity());
        dto.setDefaultLocality(customer.getDefaultLocality());
        dto.setDefaultAddress(customer.getDefaultAddress());
        dto.setMemberSince(user.getCreatedAt());

        // Ratings info
        List<RatingDto> ratings = ratingService.getRatingsByUserId(user.getUserId());
        dto.setRatings(ratings);
        dto.setTotalRatingsCount(ratings.size());

        Double avgScore = ratingRepository.calculateAverageScoreByUserId(user.getUserId());
        dto.setAverageRating(avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : null);

        // Requests count
        var requests = serviceRequestRepository.findByCustomer_User_UserIdOrderByCreatedAtDesc(user.getUserId());
        dto.setTotalRequestsCount(requests.size());

        return dto;
    }
}
