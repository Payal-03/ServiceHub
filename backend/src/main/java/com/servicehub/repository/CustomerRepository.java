package com.servicehub.repository;

import com.servicehub.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUser_UserId(Long userId);
    Optional<Customer> findByUser_Email(String email);
}
