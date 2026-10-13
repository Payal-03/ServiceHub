package com.servicehub.service;

import com.servicehub.config.JwtTokenProvider;
import com.servicehub.dto.AuthRequest;
import com.servicehub.dto.AuthResponse;
import com.servicehub.dto.RegisterRequest;
import com.servicehub.dto.UserDto;
import com.servicehub.entity.Customer;
import com.servicehub.entity.ElectricianProfile;
import com.servicehub.entity.Role;
import com.servicehub.entity.User;
import com.servicehub.exception.BadRequestException;
import com.servicehub.exception.ConflictException;
import com.servicehub.repository.CustomerRepository;
import com.servicehub.repository.ElectricianProfileRepository;
import com.servicehub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ElectricianProfileRepository electricianProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       ElectricianProfileRepository electricianProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.electricianProfileRepository = electricianProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ConflictException("An account with this email address already exists.");
        }

        Role role;
        String rawRole = request.getRole() != null ? request.getRole().trim().toUpperCase() : "CUSTOMER";
        if ("PROVIDER".equals(rawRole) || "ELECTRICIAN".equals(rawRole)) {
            role = Role.ELECTRICIAN;
        } else if ("ADMIN".equals(rawRole)) {
            role = Role.ADMIN;
        } else {
            role = Role.CUSTOMER;
        }

        User user = new User();
        user.setFullName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : "");
        user.setRole(role);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create matching 1:1 profile row as specified in Section 4
        if (role == Role.CUSTOMER) {
            Customer customer = new Customer(savedUser);
            customer.setDefaultCity("");
            customer.setDefaultLocality("");
            customer.setDefaultAddress("");
            customerRepository.save(customer);
        } else if (role == Role.ELECTRICIAN) {
            ElectricianProfile electrician = new ElectricianProfile(savedUser);
            electrician.setSkills("General Electrical Wiring & Repair");
            electrician.setServiceCity("");
            electrician.setServiceLocality("");
            electrician.setExperienceYears(1);
            electrician.setDescription("Certified electrician ready to provide high quality electrical services.");
            electricianProfileRepository.save(electrician);
        }

        String token = jwtTokenProvider.generateToken(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        UserDto userDto = mapToUserDto(savedUser);
        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password.");
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadRequestException("This account is currently deactivated.");
        }

        String token = jwtTokenProvider.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole().name()
        );

        UserDto userDto = mapToUserDto(user);
        return new AuthResponse(token, userDto);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found for email: " + email));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found for id: " + userId));
    }

    public UserDto mapToUserDto(User user) {
        return new UserDto(
                String.valueOf(user.getUserId()),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                Boolean.TRUE.equals(user.getIsActive()) ? "ACTIVE" : "INACTIVE",
                user.getCreatedAt()
        );
    }
}
