package com.servicehub.repository;

import com.servicehub.entity.RequestStatus;
import com.servicehub.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCustomer_CustomerIdOrderByCreatedAtDesc(Long customerId);

    List<ServiceRequest> findByCustomer_User_UserIdOrderByCreatedAtDesc(Long userId);

    List<ServiceRequest> findBySelectedElectrician_ElectricianIdOrderByCreatedAtDesc(Long electricianId);

    List<ServiceRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    @Query("SELECT r FROM ServiceRequest r " +
           "WHERE r.status = :status " +
           "AND (:city IS NULL OR :city = '' OR LOWER(r.city) = LOWER(:city)) " +
           "AND (:locality IS NULL OR :locality = '' OR LOWER(r.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) " +
           "ORDER BY r.createdAt DESC")
    List<ServiceRequest> findOpenRequestsFiltered(
            @Param("status") RequestStatus status,
            @Param("city") String city,
            @Param("locality") String locality
    );
}
