-- =============================================================================
-- ServiceHub Database Schema (MySQL)
-- Tables: users, customers, electrician_profiles, service_categories,
--         service_requests, request_interests, ratings
-- =============================================================================

CREATE DATABASE IF NOT EXISTS servicehub;
USE servicehub;

-- 1. users: Authentication and shared identity
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. customers: Profile table for customer users (1:1 with users)
CREATE TABLE IF NOT EXISTS customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    default_city VARCHAR(100),
    default_locality VARCHAR(100),
    default_address VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. electrician_profiles: Profile table for electricians (1:1 with users)
CREATE TABLE IF NOT EXISTS electrician_profiles (
    electrician_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    skills VARCHAR(255),
    service_city VARCHAR(100),
    service_locality VARCHAR(100),
    experience_years INT NOT NULL DEFAULT 0,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_electricians_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. service_categories: Catalog of electrical repair categories
CREATE TABLE IF NOT EXISTS service_categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. service_requests: Work requests posted by customers
-- Note: Includes customer_confirmed and electrician_confirmed for completion
CREATE TABLE IF NOT EXISTS service_requests (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    selected_electrician_id BIGINT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255),
    locality VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    expected_budget DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    expires_at TIMESTAMP NULL,
    customer_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    electrician_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE RESTRICT,
    CONSTRAINT fk_requests_category FOREIGN KEY (category_id) REFERENCES service_categories (category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_requests_electrician FOREIGN KEY (selected_electrician_id) REFERENCES electrician_profiles (electrician_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. request_interests: Electricians' expressed interest with quoted bid amount
CREATE TABLE IF NOT EXISTS request_interests (
    interest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    electrician_id BIGINT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INTERESTED',
    message VARCHAR(500),
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_request_electrician UNIQUE (request_id, electrician_id),
    CONSTRAINT fk_interests_request FOREIGN KEY (request_id) REFERENCES service_requests (request_id) ON DELETE RESTRICT,
    CONSTRAINT fk_interests_electrician FOREIGN KEY (electrician_id) REFERENCES electrician_profiles (electrician_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ratings: Mutual post-completion reviews
CREATE TABLE IF NOT EXISTS ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    reviewer_user_id BIGINT NOT NULL,
    reviewee_user_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    review VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_request_reviewer UNIQUE (request_id, reviewer_user_id),
    CONSTRAINT fk_ratings_request FOREIGN KEY (request_id) REFERENCES service_requests (request_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ratings_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users (user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ratings_reviewee FOREIGN KEY (reviewee_user_id) REFERENCES users (user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Seed Data: Service Categories
-- =============================================================================
INSERT INTO service_categories (category_name, description, is_active)
VALUES 
    ('Fan repair', 'Ceiling fan, exhaust fan, regulator and speed problems', TRUE),
    ('Light installation', 'Tube lights, LED panels, chandeliers, fancy decorative lights', TRUE),
    ('Switchboard repair', 'Broken switches, loose sockets, spark issues, MCB replacement', TRUE),
    ('Wiring', 'Full house wiring, short circuit troubleshooting, rewiring', TRUE),
    ('Socket repair', 'Power plugs, 16A AC/geyser sockets, burnt socket replacement', TRUE)
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);
