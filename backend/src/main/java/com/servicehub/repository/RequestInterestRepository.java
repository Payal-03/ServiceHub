package com.servicehub.repository;

import com.servicehub.entity.RequestInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestInterestRepository extends JpaRepository<RequestInterest, Long> {

    List<RequestInterest> findByRequest_RequestIdOrderByCreatedAtDesc(Long requestId);

    Optional<RequestInterest> findByRequest_RequestIdAndElectrician_ElectricianId(Long requestId, Long electricianId);

    boolean existsByRequest_RequestIdAndElectrician_ElectricianId(Long requestId, Long electricianId);

    List<RequestInterest> findByElectrician_ElectricianIdOrderByCreatedAtDesc(Long electricianId);

    long countByRequest_RequestId(Long requestId);
}
