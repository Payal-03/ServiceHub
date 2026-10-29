package com.servicehub.config;

import com.servicehub.entity.ServiceCategory;
import com.servicehub.repository.ServiceCategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class CategoryDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CategoryDataInitializer.class);

    private final ServiceCategoryRepository serviceCategoryRepository;

    public CategoryDataInitializer(ServiceCategoryRepository serviceCategoryRepository) {
        this.serviceCategoryRepository = serviceCategoryRepository;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and initializing standard service categories...");

        // Standard 7 electrical categories requested
        Map<String, String> standardCategories = new LinkedHashMap<>();
        standardCategories.put("Fan & Lighting", "Fans, regulators, bulbs, tube lights, LED lights, decorative lights, and exhaust fans.");
        standardCategories.put("Switches, Sockets & Wiring", "Switchboards, plug points, new wiring, rewiring, and loose connections.");
        standardCategories.put("Electrical Faults & Power", "Power failures, short circuits, MCBs, fuses, and inverter connections.");
        standardCategories.put("AC Installation & Repair", "AC installation, servicing, cooling issues, and AC electrical faults.");
        standardCategories.put("Home Appliance Repair", "Washing machines, refrigerators, and other household appliances.");
        standardCategories.put("Geyser & Water Heater", "Installation, electrical connection issues, and repairs.");
        standardCategories.put("General Electrical Work", "Doorbells, new electrical points, appliance connections, and other small electrical jobs.");

        // 1. Deactivate any category not in the standard set
        serviceCategoryRepository.findAll().forEach(cat -> {
            if (!standardCategories.containsKey(cat.getCategoryName()) && Boolean.TRUE.equals(cat.getIsActive())) {
                cat.setIsActive(false);
                serviceCategoryRepository.save(cat);
                log.info("Deactivated legacy service category: {}", cat.getCategoryName());
            }
        });

        // 2. Insert or update the 7 standard categories
        standardCategories.forEach((name, desc) -> {
            Optional<ServiceCategory> existing = serviceCategoryRepository.findByCategoryNameIgnoreCase(name);
            if (existing.isPresent()) {
                ServiceCategory cat = existing.get();
                cat.setDescription(desc);
                cat.setIsActive(true);
                serviceCategoryRepository.save(cat);
            } else {
                ServiceCategory cat = new ServiceCategory(name, desc, true);
                serviceCategoryRepository.save(cat);
                log.info("Created new service category: {}", name);
            }
        });

        log.info("Service categories successfully synchronized with the 7 required categories.");
    }
}
