package com.servicehub;

import com.servicehub.dto.*;
import com.servicehub.entity.InterestStatus;
import com.servicehub.entity.RequestStatus;
import com.servicehub.entity.ServiceCategory;
import com.servicehub.repository.ServiceCategoryRepository;
import com.servicehub.service.AuthService;
import com.servicehub.service.ElectricianProfileService;
import com.servicehub.service.RatingService;
import com.servicehub.service.ServiceRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class ServiceHubFlowTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ElectricianProfileService electricianProfileService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private com.servicehub.service.NotificationService notificationService;

    private Long customerUserId;
    private Long electrician1UserId;
    private Long electrician2UserId;
    private Long electrician1Id;
    private Long electrician2Id;
    private Long categoryId;

    @BeforeEach
    void setUp() {
        // Ensure at least one category exists
        ServiceCategory cat = serviceCategoryRepository.findByCategoryNameIgnoreCase("Fan repair")
                .orElseGet(() -> serviceCategoryRepository.save(new ServiceCategory("Fan repair", "Ceiling and exhaust fans", true)));
        categoryId = cat.getCategoryId();

        // Register Customer
        RegisterRequest custReq = new RegisterRequest();
        custReq.setName("Amit Sharma");
        custReq.setEmail("amit@example.com");
        custReq.setPassword("password123");
        custReq.setPhone("9876543210");
        custReq.setRole("CUSTOMER");
        AuthResponse custAuth = authService.register(custReq);
        customerUserId = Long.valueOf(custAuth.getUser().getId());

        // Register Electrician 1
        RegisterRequest elec1Req = new RegisterRequest();
        elec1Req.setName("Ramesh Kumar");
        elec1Req.setEmail("ramesh@example.com");
        elec1Req.setPassword("password123");
        elec1Req.setPhone("9876543211");
        elec1Req.setRole("ELECTRICIAN");
        AuthResponse elec1Auth = authService.register(elec1Req);
        electrician1UserId = Long.valueOf(elec1Auth.getUser().getId());
        ElectricianProfileDto prof1 = electricianProfileService.getProfileByUserId(electrician1UserId);
        electrician1Id = Long.valueOf(prof1.getId());

        // Register Electrician 2
        RegisterRequest elec2Req = new RegisterRequest();
        elec2Req.setName("Suresh Verma");
        elec2Req.setEmail("suresh@example.com");
        elec2Req.setPassword("password123");
        elec2Req.setPhone("9876543212");
        elec2Req.setRole("ELECTRICIAN");
        AuthResponse elec2Auth = authService.register(elec2Req);
        electrician2UserId = Long.valueOf(elec2Auth.getUser().getId());
        ElectricianProfileDto prof2 = electricianProfileService.getProfileByUserId(electrician2UserId);
        electrician2Id = Long.valueOf(prof2.getId());
    }

    @Test
    @DisplayName("Complete ServiceHub lifecycle: Create Request -> Express Interest -> Select -> Confirm Both -> Rate")
    void testCompleteLifecycle() {
        // 1. Customer creates request
        CreateRequestDto createDto = new CreateRequestDto();
        createDto.setCategoryId(categoryId);
        createDto.setTitle("Ceiling fan not working");
        createDto.setDescription("Fan is humming but not rotating");
        createDto.setCity("Mathura");
        createDto.setLocality("Krishna Nagar");
        createDto.setAddress("House 42, Sector 3");
        createDto.setExpectedBudget(new BigDecimal("500.00"));

        ServiceRequestDto request = serviceRequestService.createRequest(createDto, customerUserId);
        assertNotNull(request.getId());
        assertEquals("OPEN", request.getStatus());
        assertEquals("Mathura", request.getCity());
        Long reqId = Long.valueOf(request.getId());

        // 2. Electrician browses open requests
        List<ServiceRequestDto> available = serviceRequestService.browseOpenRequests("Mathura", "Krishna");
        assertFalse(available.isEmpty());
        assertTrue(available.stream().anyMatch(r -> r.getId().equals(String.valueOf(reqId))));

        // 3. Electrician 1 expresses interest
        ExpressInterestDto interest1Dto = new ExpressInterestDto();
        interest1Dto.setBidAmount(new BigDecimal("450.00"));
        interest1Dto.setMessage("I can fix it in 30 minutes with genuine capacitor.");
        serviceRequestService.expressInterest(reqId, interest1Dto, electrician1UserId);

        // 4. Electrician 2 expresses interest
        ExpressInterestDto interest2Dto = new ExpressInterestDto();
        interest2Dto.setBidAmount(new BigDecimal("480.00"));
        interest2Dto.setMessage("Experienced technician available today.");
        serviceRequestService.expressInterest(reqId, interest2Dto, electrician2UserId);

        // Verify customer sees 2 interested electricians
        ServiceRequestDto reqWithInterests = serviceRequestService.getRequestById(reqId);
        assertEquals(2, reqWithInterests.getInterestedProviders().size());

        // 5. Customer selects Electrician 1
        ServiceRequestDto selectedReq = serviceRequestService.selectElectrician(reqId, electrician1Id, customerUserId);
        assertEquals("IN_PROGRESS", selectedReq.getStatus());
        assertEquals(String.valueOf(electrician1Id), selectedReq.getSelectedElectricianId());

        // Verify Electrician 1 is SELECTED, Electrician 2 is NOT_SELECTED
        ServiceRequestDto reqAfterSelect = serviceRequestService.getRequestById(reqId);
        for (InterestDto item : reqAfterSelect.getInterestedProviders()) {
            if (item.getElectricianId().equals(electrician1Id)) {
                assertEquals("SELECTED", item.getStatus());
            } else if (item.getElectricianId().equals(electrician2Id)) {
                assertEquals("NOT_SELECTED", item.getStatus());
            }
        }

        // 6. Completion confirmation
        // Electrician 1 confirms
        ServiceRequestDto elecConfirmed = serviceRequestService.electricianConfirmCompletion(reqId, electrician1UserId);
        assertTrue(elecConfirmed.getElectricianConfirmed());
        assertFalse(elecConfirmed.getCustomerConfirmed());
        assertEquals("IN_PROGRESS", elecConfirmed.getStatus()); // Not yet COMPLETED until both confirm

        // Customer confirms
        ServiceRequestDto fullyCompleted = serviceRequestService.customerConfirmCompletion(reqId, customerUserId);
        assertTrue(fullyCompleted.getCustomerConfirmed());
        assertTrue(fullyCompleted.getElectricianConfirmed());
        assertEquals("COMPLETED", fullyCompleted.getStatus());

        // 7. Mutual Ratings after COMPLETED
        // Customer rates Electrician 1
        CreateRatingDto custRating = new CreateRatingDto();
        custRating.setRequestId(reqId);
        custRating.setScore(5);
        custRating.setReview("Excellent work and polite behavior!");
        RatingDto r1 = ratingService.createRating(custRating, customerUserId);
        assertEquals(5, r1.getScore());

        // Electrician 1 rates Customer
        CreateRatingDto elecRating = new CreateRatingDto();
        elecRating.setRequestId(reqId);
        elecRating.setScore(5);
        elecRating.setReview("Polite customer, prompt payment.");
        RatingDto r2 = ratingService.createRating(elecRating, electrician1UserId);
        assertEquals(5, r2.getScore());

        // Verify Electrician 1 profile average rating
        ElectricianProfileDto updatedProf = electricianProfileService.getProfileByElectricianId(electrician1Id);
        assertEquals(5.0, updatedProf.getRating());
        assertEquals(1L, updatedProf.getRatingCount());
    }

    @Test
    @DisplayName("Electrician withdraw interest and cannot bid again")
    void testWithdrawInterestRule() {
        CreateRequestDto createDto = new CreateRequestDto();
        createDto.setCategoryId(categoryId);
        createDto.setTitle("Switchboard sparking");
        createDto.setDescription("Sparks coming from bedroom switchboard");
        createDto.setCity("Mathura");
        createDto.setLocality("Krishna Nagar");
        createDto.setExpectedBudget(new BigDecimal("300.00"));

        ServiceRequestDto request = serviceRequestService.createRequest(createDto, customerUserId);
        Long reqId = Long.valueOf(request.getId());

        ExpressInterestDto interestDto = new ExpressInterestDto();
        interestDto.setBidAmount(new BigDecimal("300.00"));
        interestDto.setMessage("Available immediately");
        serviceRequestService.expressInterest(reqId, interestDto, electrician1UserId);

        // Withdraw interest
        serviceRequestService.withdrawInterest(reqId, electrician1UserId);

        // Try expressing interest again -> should fail
        assertThrows(RuntimeException.class, () -> {
            serviceRequestService.expressInterest(reqId, interestDto, electrician1UserId);
        });
    }

    @Test
    @DisplayName("Customer can cancel request only while OPEN")
    void testCancellationRule() {
        CreateRequestDto createDto = new CreateRequestDto();
        createDto.setCategoryId(categoryId);
        createDto.setTitle("Wiring repair");
        createDto.setDescription("Main wire needs replacement");
        createDto.setCity("Mathura");
        createDto.setLocality("Krishna Nagar");
        createDto.setExpectedBudget(new BigDecimal("800.00"));

        ServiceRequestDto request = serviceRequestService.createRequest(createDto, customerUserId);
        Long reqId = Long.valueOf(request.getId());

        // Cancel while OPEN -> Success
        ServiceRequestDto cancelled = serviceRequestService.cancelRequest(reqId, customerUserId);
        assertEquals("CANCELLED", cancelled.getStatus());

        // Try cancelling already CANCELLED request -> should fail
        assertThrows(RuntimeException.class, () -> {
            serviceRequestService.cancelRequest(reqId, customerUserId);
        });
    }

    @Test
    @DisplayName("Customer can edit OPEN job and interested electricians receive notification")
    void testCustomerCanEditOpenJobAndNotifyInterestedElectricians() {
        // 1. Customer creates a job
        CreateRequestDto createDto = new CreateRequestDto();
        createDto.setCategoryId(categoryId);
        createDto.setTitle("Ceiling fan slow speed");
        createDto.setDescription("Fan running slow on regulator 5");
        createDto.setCity("Mathura");
        createDto.setLocality("Krishna Nagar");
        createDto.setAddress("House 12, Street 3");
        createDto.setExpectedBudget(new BigDecimal("250.00"));

        ServiceRequestDto request = serviceRequestService.createRequest(createDto, customerUserId);
        Long reqId = Long.valueOf(request.getId());

        // 2. Electrician 1 expresses interest
        ExpressInterestDto interest1 = new ExpressInterestDto();
        interest1.setBidAmount(new BigDecimal("250.00"));
        interest1.setMessage("I can replace the capacitor today.");
        serviceRequestService.expressInterest(reqId, interest1, electrician1UserId);

        // 3. Electrician 2 expresses interest
        ExpressInterestDto interest2 = new ExpressInterestDto();
        interest2.setBidAmount(new BigDecimal("220.00"));
        interest2.setMessage("Available in 30 mins.");
        serviceRequestService.expressInterest(reqId, interest2, electrician2UserId);

        // Verify initial unread notifications for electricians is 0
        assertEquals(0, notificationService.getUnreadCount(electrician1UserId));
        assertEquals(0, notificationService.getUnreadCount(electrician2UserId));

        // 4. Customer edits the job while still OPEN
        UpdateRequestDto updateDto = new UpdateRequestDto();
        updateDto.setTitle("Ceiling fan not spinning and humming noise");
        updateDto.setDescription("Capacitor burned out, need urgent repair");
        updateDto.setCity("Mathura");
        updateDto.setLocality("Krishna Nagar");
        updateDto.setAddress("House 12, Street 3, Landmark: Shiv Temple");
        updateDto.setExpectedBudget(new BigDecimal("350.00"));

        ServiceRequestDto updated = serviceRequestService.updateRequest(reqId, updateDto, customerUserId);

        // Verify updated request fields
        assertEquals("Ceiling fan not spinning and humming noise", updated.getTitle());
        assertEquals("Capacitor burned out, need urgent repair", updated.getDescription());
        assertEquals(new BigDecimal("350.00"), updated.getBudget());
        assertEquals("House 12, Street 3, Landmark: Shiv Temple", updated.getAddress());

        // 5. Verify both interested electricians received notification
        assertEquals(1, notificationService.getUnreadCount(electrician1UserId));
        assertEquals(1, notificationService.getUnreadCount(electrician2UserId));

        List<NotificationDto> elec1Notifications = notificationService.getUserNotifications(electrician1UserId);
        assertFalse(elec1Notifications.isEmpty());
        NotificationDto notif = elec1Notifications.get(0);
        assertEquals(reqId, notif.getRequestId());
        assertTrue(notif.getTitle().contains("Job Post Updated"));
        assertTrue(notif.getMessage().contains("350"));
        assertEquals("JOB_UPDATED", notif.getType());
        assertFalse(notif.isRead());

        // Mark notification as read
        NotificationDto readNotif = notificationService.markAsRead(notif.getId(), electrician1UserId);
        assertTrue(readNotif.isRead());
        assertEquals(0, notificationService.getUnreadCount(electrician1UserId));
    }

    @Test
    @DisplayName("Once an electrician is selected, no further changes to job post can be made")
    void testJobCannotBeEditedAfterElectricianSelected() {
        // 1. Customer creates a job
        CreateRequestDto createDto = new CreateRequestDto();
        createDto.setCategoryId(categoryId);
        createDto.setTitle("Geyser thermostat issue");
        createDto.setDescription("Water is overheating");
        createDto.setCity("Mathura");
        createDto.setLocality("Krishna Nagar");
        createDto.setExpectedBudget(new BigDecimal("500.00"));

        ServiceRequestDto request = serviceRequestService.createRequest(createDto, customerUserId);
        Long reqId = Long.valueOf(request.getId());

        // 2. Electrician 1 expresses interest
        ExpressInterestDto interest1 = new ExpressInterestDto();
        interest1.setBidAmount(new BigDecimal("500.00"));
        interest1.setMessage("I have spare thermostat ready.");
        serviceRequestService.expressInterest(reqId, interest1, electrician1UserId);

        // 3. Customer selects Electrician 1
        serviceRequestService.selectElectrician(reqId, electrician1Id, customerUserId);

        // Verify job is now IN_PROGRESS with selected electrician
        ServiceRequestDto current = serviceRequestService.getRequestById(reqId);
        assertEquals("IN_PROGRESS", current.getStatus());
        assertNotNull(current.getSelectedElectrician());

        // 4. Customer tries to edit the job post -> must be REJECTED!
        UpdateRequestDto updateDto = new UpdateRequestDto();
        updateDto.setTitle("Change title after hire");
        updateDto.setDescription("Trying to change scope");
        updateDto.setCity("Mathura");
        updateDto.setLocality("Krishna Nagar");
        updateDto.setExpectedBudget(new BigDecimal("400.00"));

        com.servicehub.exception.BadRequestException ex = assertThrows(
                com.servicehub.exception.BadRequestException.class,
                () -> serviceRequestService.updateRequest(reqId, updateDto, customerUserId)
        );

        assertTrue(ex.getMessage().contains("selected") || ex.getMessage().contains("open"));
    }
}
