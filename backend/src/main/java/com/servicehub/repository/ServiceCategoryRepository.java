package com.servicehub.repository;

import com.servicehub.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    List<ServiceCategory> findByIsActiveTrue();
    Optional<ServiceCategory> findByCategoryNameIgnoreCase(String categoryName);
}
