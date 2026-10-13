package com.servicehub.controller;

import com.servicehub.dto.ElectricianProfileDto;
import com.servicehub.dto.UpdateElectricianProfileDto;
import com.servicehub.entity.User;
import com.servicehub.service.AuthService;
import com.servicehub.service.ElectricianProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class ElectricianProfileController {

    private final ElectricianProfileService electricianProfileService;
    private final AuthService authService;

    public ElectricianProfileController(ElectricianProfileService electricianProfileService,
                                        AuthService authService) {
        this.electricianProfileService = electricianProfileService;
        this.authService = authService;
    }

    @GetMapping({"/api/electricians/me", "/api/providers/me"})
    public ResponseEntity<ElectricianProfileDto> getCurrentProfile(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ElectricianProfileDto profile = electricianProfileService.getProfileByUserId(user.getUserId());
        return ResponseEntity.ok(profile);
    }

    @GetMapping({"/api/electricians/{id}", "/api/providers/{id}"})
    public ResponseEntity<ElectricianProfileDto> getProfileById(@PathVariable Long id) {
        ElectricianProfileDto profile = electricianProfileService.getProfileByElectricianId(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping({"/api/electricians/{id}", "/api/providers/{id}"})
    public ResponseEntity<ElectricianProfileDto> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateElectricianProfileDto dto,
            Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        ElectricianProfileDto updated = electricianProfileService.updateProfile(id, dto, user.getUserId());
        return ResponseEntity.ok(updated);
    }
}
