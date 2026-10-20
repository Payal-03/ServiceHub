package com.servicehub.controller;

import com.servicehub.dto.CreateRequestDto;
import com.servicehub.dto.ExpressInterestDto;
import com.servicehub.dto.SelectElectricianDto;
import com.servicehub.dto.ServiceRequestDto;
import com.servicehub.entity.User;
import com.servicehub.service.AuthService;
import com.servicehub.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final AuthService authService;

    public ServiceRequestController(ServiceRequestService serviceRequestService,
                                    AuthService authService) {
        this.serviceRequestService = serviceRequestService;
        this.authService = authService;
    }

    /**
     * Customer creates a service request.
     */
    @PostMapping
    public ResponseEntity<ServiceRequestDto> createRequest(
            @Valid @RequestBody CreateRequestDto dto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto created = serviceRequestService.createRequest(dto, user.getUserId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Role-aware "my requests" endpoint.
     * - CUSTOMER: returns requests they posted.
     * - ELECTRICIAN: returns requests they have bid on.
     */
    @GetMapping("/my")
    public ResponseEntity<List<ServiceRequestDto>> getMyRequests(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        List<ServiceRequestDto> requests;
        if (user.getRole() != null && user.getRole().name().equals("ELECTRICIAN")) {
            requests = serviceRequestService.getElectricianRequests(user.getUserId());
        } else {
            requests = serviceRequestService.getCustomerRequests(user.getUserId());
        }
        return ResponseEntity.ok(requests);
    }

    /**
     * Electricians browse OPEN requests, filtered by city and locality.
     */
    @GetMapping("/available")
    public ResponseEntity<List<ServiceRequestDto>> browseAvailableRequests(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String locality) {
        String effectiveLocality = (locality != null && !locality.trim().isEmpty()) ? locality : area;
        List<ServiceRequestDto> requests = serviceRequestService.browseOpenRequests(city, effectiveLocality);
        return ResponseEntity.ok(requests);
    }

    /**
     * View one service request by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDto> getRequestById(@PathVariable Long id) {
        ServiceRequestDto request = serviceRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    /**
     * Customer cancels an OPEN request.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestDto> cancelRequest(
            @PathVariable Long id,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto cancelled = serviceRequestService.cancelRequest(id, user.getUserId());
        return ResponseEntity.ok(cancelled);
    }

    /**
     * Electrician expresses interest with bid amount and message.
     */
    @PostMapping("/{id}/interest")
    public ResponseEntity<ServiceRequestDto> expressInterest(
            @PathVariable Long id,
            @Valid @RequestBody ExpressInterestDto dto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto updated = serviceRequestService.expressInterest(id, dto, user.getUserId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Electrician withdraws interest. Record kept with status WITHDRAWN.
     */
    @DeleteMapping("/{id}/interest")
    public ResponseEntity<ServiceRequestDto> withdrawInterest(
            @PathVariable Long id,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto updated = serviceRequestService.withdrawInterest(id, user.getUserId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Customer selects an electrician.
     */
    @PostMapping("/{id}/accept")
    public ResponseEntity<ServiceRequestDto> selectElectrician(
            @PathVariable Long id,
            @RequestBody SelectElectricianDto dto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        Long electricianId = dto.getResolvedElectricianId();
        ServiceRequestDto updated = serviceRequestService.selectElectrician(id, electricianId, user.getUserId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Customer confirms completion.
     */
    @PatchMapping("/{id}/customer-confirm")
    public ResponseEntity<ServiceRequestDto> customerConfirmCompletion(
            @PathVariable Long id,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto updated = serviceRequestService.customerConfirmCompletion(id, user.getUserId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Electrician confirms completion.
     */
    @PatchMapping({"/{id}/provider-complete", "/{id}/electrician-confirm"})
    public ResponseEntity<ServiceRequestDto> electricianConfirmCompletion(
            @PathVariable Long id,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ServiceRequestDto updated = serviceRequestService.electricianConfirmCompletion(id, user.getUserId());
        return ResponseEntity.ok(updated);
    }
}
