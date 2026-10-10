package com.servicehub.repository;

import com.servicehub.entity.ElectricianProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricianProfileRepository extends JpaRepository<ElectricianProfile, Long> {
    Optional<ElectricianProfile> findByUser_UserId(Long userId);
    Optional<ElectricianProfile> findByUser_Email(String email);
    List<ElectricianProfile> findByServiceCityIgnoreCase(String city);
}
