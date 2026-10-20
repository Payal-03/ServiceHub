# ServiceHub

ServiceHub is an on-demand web platform connecting customers needing household electrical services (fan repair, lighting installation, switchboard repair, wiring, socket repairs, appliance installation) with qualified, verified local electricians. 

Customers post electrical repair jobs with location details and an expected budget. Nearby electricians browse open jobs and submit price bids with custom notes. The customer reviews quotes, compares electrician ratings and experience, and hires the best pro. Once the work is done, both parties confirm completion and exchange mutual reviews and ratings.

---

## 1. Key Features Built

### Customer Flow
- **Post an Electrical Job**: Choose a category (Fan repair, Wiring, Switchboard, Lighting, Inverter, etc.), describe the problem, specify location (city, locality, address), and set an expected budget.
- **My Requests Dashboard**: View all posted jobs filtered by status (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- **Review Bids & Select Electrician**: Review quote bids from interested local electricians with their dynamic rating (⭐), years of experience, quoted price, and message. Hire an electrician with a single click.
- **Job Cancellation**: Cancel a request at any time while its status is still `OPEN`.
- **Confirm Completion**: Once work is completed, confirm job completion.
- **Mutual Rating & Review**: Submit a 1–5 star rating and written review after job completion.

### Electrician Flow
- **Browse Open Jobs**: Explore all active `OPEN` electrical jobs in real-time, filtered by city and locality.
- **Submit Quotes / Bids**: Submit competitive bid quotes with custom pricing and explanatory messages.
- **Withdraw Bids**: Withdraw interest/bids before the customer makes a selection.
- **Manage Assigned Jobs**: View assigned customer contact details and exact address once hired.
- **Mark Completion**: Mark the job completed from the electrician side.
- **Profile & Reputation Management**: Edit skills, experience years, service city, service locality, and bio. Dynamic average star rating and customer reviews are computed directly from completed jobs.

### Backend & Security
- **Role-Based Access Control**: Spring Security protecting APIs for `CUSTOMER` and `ELECTRICIAN` roles.
- **Stateless Authentication**: JWT tokens with BCrypt password hashing.
- **Transactional Consistency**: Selecting an electrician atomically marks the request as `IN_PROGRESS`, flags the chosen interest as `SELECTED`, and marks competing interests as `NOT_SELECTED`.
- **Two-Sided Completion**: Automatically transitions status to `COMPLETED` when both `customer_confirmed` and `electrician_confirmed` are true.
- **Strict Database Validation**: `spring.jpa.hibernate.ddl-auto=validate` enforces zero schema drift against MySQL tables.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | HTML5, CSS3, Tailwind CSS | Page structure, responsive layouts, modern glassmorphic aesthetics |
| **Frontend Framework** | React.js (React 19), Vite | Reusable components, fast hot module replacement, optimized bundling |
| **Frontend Routing** | React Router DOM v7 | Single-page client-side navigation without full reloads |
| **HTTP Client** | Axios | Intercepted REST API calls with JWT Bearer token injection |
| **Icons** | Lucide React | Clean, modern UI iconography |
| **Backend Framework** | Java 17+, Spring Boot 3.3.5 | Robust application logic, dependency injection, and REST controllers |
| **Security** | Spring Security 6, JWT, BCrypt | Token-based authentication, role-based endpoint authorization |
| **ORM & Data Access** | Spring Data JPA, Hibernate, Jakarta Persistence | Type-safe entity mapping and repository layer |
| **Validation** | Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Min`) | Declarative input validation on incoming requests |
| **Database** | MySQL 8.x | Relational persistent storage for all 7 domain tables |
| **Build & Dependencies**| Maven (backend), npm (frontend) | Multi-module build management and package tracking |
| **Testing** | JUnit 5, Spring Boot Test, Postman | Automated integration testing and REST API verification |

---

## 3. Project Structure

```
ServiceHub/
├── README.md                           # Comprehensive project documentation
├── .gitignore                          # Git ignore rules for Maven, Node, and IDE files
│
├── frontend/                           # React + Vite frontend
│   ├── index.html                      # HTML5 entry point
│   ├── package.json                    # Frontend dependencies & npm scripts
│   ├── vite.config.ts                  # Vite development and build configuration
│   ├── tailwind.config.js              # Tailwind CSS styling configuration
│   └── src/
│       ├── App.tsx                     # Main application shell & route definitions
│       ├── main.tsx                    # React DOM root mounting
│       ├── index.css                   # Global Tailwind utilities & custom styles
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx          # Responsive navigation header with auth state
│       │   │   └── Footer.tsx          # Platform footer
│       │   └── ui/
│       │       ├── Button.tsx          # Accessible, loading-state button
│       │       ├── Badge.tsx           # Status badge component
│       │       └── StarRating.tsx      # Display and interactive 1-5 star rating
│       ├── context/
│       │   ├── AuthContext.tsx         # JWT token & user session management
│       │   └── ToastContext.tsx        # Toast feedback notifications
│       ├── pages/
│       │   ├── HomePage.tsx            # Landing page with service categories & how it works
│       │   ├── RequestDetailsPage.tsx  # Central job details, bidding, hiring & rating page
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx       # Sign-in with quick one-click demo accounts
│       │   │   └── RegisterPage.tsx    # Customer vs Electrician registration
│       │   ├── customer/
│       │   │   ├── CustomerRequestsPage.tsx # Customer dashboard & status filter tabs
│       │   │   └── CreateRequestPage.tsx    # Electrical job posting form
│       │   └── electrician/
│       │       ├── ElectricianJobsPage.tsx  # Open jobs marketplace with location filter
│       │       ├── ElectricianMyJobsPage.tsx # Electrician bid and job history
│       │       └── ElectricianProfilePage.tsx # Electrician profile editor & reviews
│       ├── routes/
│       │   └── ProtectedRoute.tsx      # Role-based route guard
│       ├── services/
│       │   └── api.ts                  # Axios client & typed API endpoints
│       └── types/
│           └── index.ts                # TypeScript interfaces matching Spring Boot DTOs
│
└── backend/                            # Spring Boot backend
    ├── pom.xml                         # Maven dependencies & build plugins
    ├── schema.sql                      # Complete MySQL DDL script with seed categories
    ├── mvnw / mvnw.cmd                 # Maven wrapper scripts
    └── src/
        ├── main/
        │   ├── java/com/servicehub/
        │   │   ├── ServiceHubApplication.java
        │   │   ├── config/             # SecurityConfig, CorsConfig, JwtTokenProvider, JwtFilter
        │   │   ├── controller/         # Auth, Category, ElectricianProfile, Request, Rating Controllers
        │   │   ├── dto/                # Request & response transfer objects with validation
        │   │   ├── entity/             # JPA entities (User, Customer, ElectricianProfile, etc.)
        │   │   ├── exception/          # GlobalExceptionHandler and custom exceptions
        │   │   ├── repository/         # Spring Data JPA repositories
        │   │   └── service/            # Transactional business logic
        │   └── resources/
        │       ├── application.properties # Spring Boot configuration (ddl-auto=validate)
        │       └── schema.sql          # Resource copy of database initialization DDL
        └── test/
            ├── java/com/servicehub/    # Spring Boot integration tests (ServiceHubFlowTests)
            └── resources/
                └── application-test.properties # In-memory H2 test configuration
```

---

## 4. Database Schema (7 Normalized Tables)

The database schema strictly conforms to the 7-table ER model:

1. **`users`**: Central account credentials and identity (`user_id`, `full_name`, `email` [UK], `password_hash`, `phone`, `role`, `is_active`, `created_at`, `updated_at`).
2. **`customers`**: Customer profile linked 1:1 with `users` (`customer_id`, `user_id` [FK, UK], `default_city`, `default_locality`, `default_address`, `created_at`).
3. **`electrician_profiles`**: Electrician profile linked 1:1 with `users` (`electrician_id`, `user_id` [FK, UK], `skills`, `service_city`, `service_locality`, `experience_years`, `description`, `created_at`, `updated_at`).
4. **`service_categories`**: Master category catalog (`category_id`, `category_name` [UK], `description`, `is_active`). Pre-seeded with *Fan repair*, *Light installation*, *Switchboard repair*, *Wiring*, *Socket repair*, *Inverter & UPS*.
5. **`service_requests`**: Service jobs posted by customers (`request_id`, `customer_id` [FK], `category_id` [FK], `selected_electrician_id` [FK, nullable], `title`, `description`, `address`, `locality`, `city`, `expected_budget`, `status`, `expires_at`, `customer_confirmed`, `electrician_confirmed`, `created_at`, `updated_at`).
6. **`request_interests`**: Electricians' bids and quotes on jobs (`interest_id`, `request_id` [FK], `electrician_id` [FK], `bid_amount`, `status`, `message`, `expires_at`, `created_at`, `updated_at`). Enforces `UNIQUE (request_id, electrician_id)`.
7. **`ratings`**: Mutual reviews between customer and selected electrician for completed jobs (`rating_id`, `request_id` [FK], `reviewer_user_id` [FK], `reviewee_user_id` [FK], `score`, `review`, `created_at`). Enforces `UNIQUE (request_id, reviewer_user_id)`.

---

## 5. REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register as `CUSTOMER` or `ELECTRICIAN` (automatically initializes profile) | Public |
| `POST` | `/api/auth/login` | Authenticate user credentials and return JWT token | Public |

### Service Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/categories` | Retrieve all active service categories | Public |

### Electrician Profiles (`/api/electricians`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/electricians/me` | Fetch authenticated electrician's profile | Authenticated |
| `GET` | `/api/electricians/{id}` | Fetch public electrician profile with dynamic rating | Public |
| `PUT` | `/api/electricians/{id}` | Update skills, service area, experience, and bio | Electrician Owner |

### Service Requests (`/api/requests`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/requests` | Post a new electrical request (status: `OPEN`) | Customer |
| `GET` | `/api/requests/my` | View all jobs posted by current customer / electrician | Authenticated |
| `GET` | `/api/requests/available` | Browse `OPEN` requests (filter by `city`, `locality`) | Public / Electrician |
| `GET` | `/api/requests/{id}` | View single request details and list of quoted bids | Authenticated |
| `POST` | `/api/requests/{id}/cancel` | Cancel an open request | Customer Owner |
| `POST` | `/api/requests/{id}/interest` | Electrician submits bid quote and message | Electrician |
| `DELETE`| `/api/requests/{id}/interest` | Electrician withdraws bid quote | Electrician |
| `POST` | `/api/requests/{id}/accept` | Customer selects an electrician (`IN_PROGRESS`) | Customer Owner |
| `PATCH`| `/api/requests/{id}/customer-confirm` | Customer confirms job completion | Customer Owner |
| `PATCH`| `/api/requests/{id}/provider-complete`| Electrician confirms job completion | Selected Electrician |

### Ratings & Reviews (`/api/ratings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/ratings` | Submit review & star rating (only allowed once job is `COMPLETED`) | Customer / Electrician |
| `GET` | `/api/ratings/electrician/{id}` | Retrieve all reviews and ratings for an electrician | Public |

---

## 6. Setup and Running Instructions

### Prerequisites
- **Java JDK 17+** (JDK 17, 21, or 24)
- **Node.js 18+** and **npm**
- **MySQL Server 8.0+**

---

### Step 1: Create Database & Execute `schema.sql`
In MySQL Workbench or the `mysql` CLI:
```sql
source backend/schema.sql;
```
*This creates the `servicehub` database, all 7 tables with their constraints and foreign keys, and seeds the initial categories.*

---

### Step 2: Configure Database Credentials
Edit [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties) with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/servicehub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Validates matching tables without altering production schema
spring.jpa.hibernate.ddl-auto=validate
```

---

### Step 3: Run the Backend
From the root directory:
```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
./mvnw spring-boot:run
```
The Spring Boot backend will run at **`http://localhost:8080`**.

---

### Step 4: Run the Frontend
In a separate terminal from the root directory:
```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start Vite dev server
npm run dev
```
The React frontend will be accessible at **`http://localhost:5173`**.

---

## 7. Testing & Demo Credentials

### Automated Backend Tests
Run the complete integration test suite with:
```bash
cd backend
.\mvnw.cmd test
```
*Executes full lifecycle test: customer posts request -> electrician submits bid -> customer selects electrician -> both confirm completion -> mutual rating created.*

### Production Frontend Build
```bash
cd frontend
npm run build
```
*Builds type-checked, optimized production bundle to `frontend/dist`.*

### Quick Demo Accounts
You can register new accounts on the registration page, or sign in using these default credentials (or click the quick demo fill buttons on the login page):

- **Customer Demo**:
  - Email: `customer@servicehub.com`
  - Password: `password123`
- **Electrician Demo**:
  - Email: `electrician@servicehub.com`
  - Password: `password123`

---

