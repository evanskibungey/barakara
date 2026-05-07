# Baraka Fintech Hub — Laravel Backend Development Roadmap

## Context

Baraka Fintech Hub is a Kenyan fintech platform digitizing communal savings groups (Chamas).
The Next.js frontend is a fully designed, production-quality prototype running entirely on mock data.
This roadmap delivers a complete Laravel REST API backend, replacing all mock data with a real,
persistent, authenticated, and payment-integrated system — built phase by phase, tested before advancing.

| | |
|---|---|
| **Frontend** | Next.js 15, TypeScript, App Router — `c:\xampp\htdocs\baraka` |
| **Backend** | Laravel 11 (PHP 8.3) — to be created at `c:\xampp\htdocs\baraka-api` |
| **Database** | MySQL 8 |
| **Auth** | Laravel Sanctum (token-based) |
| **Roles** | spatie/laravel-permission |
| **Payments** | Safaricom Daraja API (M-Pesa) |
| **Queue** | Redis + Laravel Horizon |
| **Storage** | Laravel Storage (S3-compatible or local for dev) |

---

## Architecture

```
Next.js (Vercel)  ←──── REST API (HTTPS) ────→  Laravel 11 (Forge VPS)
                                                        │
                                         ┌──────────────┼──────────────┐
                                       MySQL         Redis          Storage
                                    (main data)   (queues/cache)  (files/docs)
                                                        │
                                              Daraja API (M-Pesa)
                                              Google Gemini (AI)
                                              Africa's Talking (SMS)
```

---

## Global Standards

> These standards apply to **every phase** without exception.

- All endpoints under `/api/v1/` with versioned routes
- All responses use a standard JSON envelope:
  ```json
  { "status": "success", "data": {}, "message": "" }
  { "status": "error",   "errors": {}, "message": "" }
  ```
- All controllers use **Form Request** classes for validation — zero validation in controllers
- All models use Eloquent with explicit `$fillable` and `$casts`
- **Service layer** holds all business logic — zero logic in controllers
- Feature tests written and passing **before** a phase is marked complete
- Soft deletes on all critical tables
- All money stored as **integers** (KES × 100 — avoids float precision bugs)
- All dates stored as **UTC**, returned as ISO 8601

---

## Phase Summary

| Phase | Module | Duration | Dependencies |
|---|---|---|---|
| 1 | Foundation & Infrastructure | 2–3 days | — |
| 2 | Database Schema & Models | 3–4 days | Phase 1 |
| 3 | Authentication & Users | 3–4 days | Phase 2 |
| 4 | Chama Management | 4–5 days | Phase 3 |
| 5 | Loan Management | 4–5 days | Phase 4 |
| 6 | Contributions, Penalties & Transactions | 3–4 days | Phase 5 |
| 7 | Meetings, Events, Polls & Documents | 3–4 days | Phase 4 |
| 8 | Crowdfunding & Welfare Drives | 3–4 days | Phase 6 |
| 9 | M-Pesa Integration (Daraja API) | 4–5 days | Phase 6, 8 |
| 10 | Reporting, BI & AI Integration | 3–4 days | Phase 6, 9 |
| 11 | Communications & Notifications | 3–4 days | Phase 3 |
| 12 | Marketplace, Investments & LMS | 3–4 days | Phase 3 |
| 13 | Admin, Subscriptions & Support | 3–4 days | Phase 4 |
| 14 | Security Hardening & Optimisation | 2–3 days | All phases |
| 15 | Full Test Suite | 3–4 days | All phases |
| 16 | Deployment & CI/CD | 2–3 days | Phase 15 |
| **Total** | | **~52–65 days** | |

---

## Phase 1 — Project Foundation & Infrastructure

**Goal:** A running Laravel project with correct architecture, database connectivity, and API skeleton.
**Duration:** 2–3 days

### 1.1 Project Scaffolding

```bash
cd C:\xampp\htdocs
composer create-project laravel/laravel baraka-api
cd baraka-api
```

**Core packages:**
```bash
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require spatie/laravel-query-builder
composer require barryvdh/laravel-dompdf
composer require maatwebsite/excel
composer require intervention/image
composer require guzzlehttp/guzzle
```

**Dev packages:**
```bash
composer require --dev pestphp/pest pestphp/pest-plugin-laravel
composer require --dev laravel/telescope
```

### 1.2 Configuration

- Configure `.env`: DB, mail (Mailtrap for dev), Redis, queue driver
- Configure `config/cors.php`: Allow `http://localhost:3000` and production domain
- Configure `config/sanctum.php`: Set `stateful_domains` and `expiration`
- Publish Sanctum, Spatie permission, and Telescope configs
- Create `config/baraka.php` for platform-wide constants (tiers, fine rule defaults, CMA limits)

### 1.3 API Architecture

```
app/
├── Http/
│   ├── Controllers/Api/V1/     ← all controllers go here
│   ├── Requests/               ← Form Request validation classes
│   └── Resources/              ← API Resource transformers
├── Services/                   ← all business logic
├── Enums/                      ← PHP 8.1 backed enums
└── Exceptions/
    └── Handler.php             ← standardised JSON error responses
```

- Create base `ApiController` with `success()` and `error()` response helpers
- Register `api/v1` route prefix in `routes/api.php`

### 1.4 Enums to Create

```php
// Mirrors every TypeScript union type from the frontend
UserRole::Admin | Chairperson | Secretary | Treasurer | Guarantor | Member
ChamaStatus::Active | PendingPayout | Suspended
SubscriptionTier::Starter | Growth | Scale
SubscriptionStatus::Active | Overdue | Suspended
LoanStatus::Pending | Active | Paid | Rejected
LoanInterestMethod::Amortized | FlatRate
TransactionType::Contribution | Loan | MembershipFee | Investment | Dividend | LoanRepayment | Penalty | Withdrawal | Deposit
TransactionStatus::Completed | Pending | Failed
FineType::Fixed | Percentage
FineRecurrence::Once | Daily
TicketStatus::Open | Answered | Closed
TicketPriority::Low | Medium | High
CampaignStatus::Active | Funded | Failed | Expired
BroadcastChannel::InApp | SMS | WhatsApp | Email
```

### 1.5 Verification

- `php artisan serve` runs without errors
- `GET /api/v1/ping` returns `{ "status": "success", "message": "Baraka API v1" }`
- Feature test: `PingTest` passes

---

## Phase 2 — Database Schema & Core Models

**Goal:** All database tables created with correct relationships, constraints, and indexes.
**Duration:** 3–4 days

### 2.1 Migrations (in dependency order)

**`users`**
```
id, name, email (unique), phone (unique), national_id (unique, nullable),
password, avatar_url, location, occupation, status,
kyc_status (pending|approved|rejected), kyc_approved_at,
two_factor_enabled, email_verified_at, phone_verified_at,
member_id (unique, auto-generated e.g. BRK-0001),
remember_token, timestamps, softDeletes
```

**`chamas`**
```
id, name, description, pool_id (unique, e.g. BC-2948),
registration_number, logo_url, address,
tier (enum), subscription_status (enum), renewal_date,
membership_fee, membership_target,
created_by (FK users), manager_id (FK users),
status (enum), timestamps, softDeletes
```

**`chama_members`** *(pivot)*
```
id, chama_id (FK), user_id (FK),
role (enum: Chairperson|Secretary|Treasurer|Guarantor|Member),
joined_at, status (active|inactive|pending),
contribution_status (good_standing|needs_attention),
allowance (nullable, for management team),
timestamps — UNIQUE(chama_id, user_id)
```

**`member_requests`**
```
id, chama_id, user_id, introduction (text),
status (pending|approved|rejected), reviewed_by, reviewed_at, timestamps
```

**`subscriptions`**
```
id, chama_id, tier, status, base_fee, per_member_fee,
transaction_fee_percentage, renewal_date, timestamps
```

**`pricing_tiers`**
```
id, name (Starter|Growth|Scale), min_members, max_members,
base_fee, per_member_fee, transaction_fee_percentage, is_active, timestamps
```

**`loans`**
```
id, chama_id, member_id (FK users),
amount, interest_rate, interest_method (enum),
status (enum), purpose (text),
application_date, approval_date, disbursed_date,
repayment_period (months), amount_paid, payments_made,
next_payment_date, approved_by, disbursed_by,
timestamps, softDeletes
```

**`loan_guarantors`**
```
id, loan_id, guarantor_id (FK users),
status (pending|signed|declined), signed_at, timestamps
```

**`loan_repayments`**
```
id, loan_id, member_id, amount, reference_id,
payment_method (mpesa|bank|cash), paid_at, timestamps
```

**`contributions`**
```
id, chama_id, member_id, amount, period (YYYY-MM),
status (paid|overdue|pending), reference_id,
payment_method, paid_at, recorded_by, timestamps
```

**`transactions`**
```
id, chama_id (nullable), user_id, type (enum), amount (integer),
reference_id (unique), status (enum), description,
payment_method, metadata (JSON), timestamps
```

**`wallets`** *(revolving welfare fund — one per member per chama)*
```
id, chama_id, user_id, balance, target, timestamps — UNIQUE(chama_id, user_id)
```

**`wallet_transactions`**
```
id, wallet_id, type (credit|debit), amount, description, timestamps
```

**`penalties`**
```
id, chama_id, member_id, reason, amount,
status (paid|unpaid|waived), issued_by, paid_at, timestamps
```

**`fine_rules`** *(per chama)*
```
id, chama_id,
type (late_payment|missed_meeting|late_arrival|custom),
enabled, amount, fine_type (fixed|percentage),
recurrence (once|daily), grace_period_days,
minutes_threshold, name (for custom rule), timestamps
```

**`payout_schedules`**
```
id, chama_id, recipient_id (FK users), amount, scheduled_date,
status (pending|paid|cancelled), paid_at, timestamps
```

**`expenses`**
```
id, chama_id, category (meeting|admin), description,
amount, status (paid|pending), incurred_by, timestamps
```

**`meetings`**
```
id, chama_id, scheduled_at, agenda (text), minutes_url,
location, status (scheduled|completed|cancelled), timestamps
```

**`meeting_attendance`**
```
id, meeting_id, member_id,
status (attended|absent|apology), timestamps — UNIQUE(meeting_id, member_id)
```

**`polls`**
```
id, chama_id, title, type (Election|General),
status (pending|active|closed),
start_date, end_date, created_by, timestamps
```

**`poll_options`**
```
id, poll_id, label, votes (default 0), timestamps
```

**`poll_votes`**
```
id, poll_id, option_id, voter_id, timestamps — UNIQUE(poll_id, voter_id)
```

**`events`**
```
id, chama_id, title, type (Meeting|Payout|Deadline),
scheduled_at, location (nullable), amount (nullable, for Payout type),
created_by, timestamps
```

**`crowdfunding_drives`**
```
id, title, description, creator_id (FK users),
chama_id (nullable), goal, raised (default 0),
status (enum), campaign_start, campaign_end,
cover_image_url, cma_compliant (boolean), timestamps, softDeletes
```

**`drive_backers`**
```
id, drive_id, user_id (nullable for anonymous),
amount, donor_name, reference_id, payment_method, paid_at, timestamps
```

**`drive_managers`** | **`drive_updates`** | **`welfare_drives`** | **`welfare_drive_managers`**

**`documents`**
```
id, chama_id, title, category (meeting_minutes|financial_report|legal_document),
document_number, document_date, file_url, file_size,
uploaded_by, timestamps, softDeletes
```

**`investment_portfolios`**
```
id, name, description, category, risk_level (low|medium|high),
roi (decimal), min_investment, image_url, is_active, curated_by, timestamps
```

**`user_investments`** | **`businesses`** | **`courses`** | **`course_enrollments`** | **`certificates`**

**`awards`** | **`member_awards`**

**`broadcasts`**
```
id, sender_id, audience_type, chama_id (nullable), message (text),
channels (JSON array), status (sent|scheduled|failed),
scheduled_at (nullable), sent_at (nullable), timestamps
```

**`broadcast_attachments`** | **`notifications`**

**`support_tickets`**
```
id, user_id, chama_id (nullable), subject, category,
description, priority (enum), status (enum),
assigned_to (nullable), timestamps
```

**`ticket_comments`** | **`knowledge_base_categories`** | **`knowledge_base_articles`** | **`faqs`**

**`mpesa_transactions`**
```
id, user_id, reference_id (unique), checkout_request_id,
merchant_request_id, phone, amount, type, status,
result_code, result_desc, mpesa_receipt_number,
callback_metadata (JSON), timestamps
```

**`activity_logs`**
```
id, user_id, chama_id (nullable), action, description,
reference_type, reference_id, ip_address, timestamps
```

### 2.2 Models

Create an Eloquent model for every table with:
- Explicit `$fillable` and `$casts` (enums, JSON, dates)
- `$hidden` for sensitive fields (password, raw national_id)
- All `HasMany`, `BelongsTo`, `BelongsToMany`, `HasManyThrough` relationships
- Query scopes: `scopeActive()`, `scopePending()`, `scopeForChama()`, etc.
- Model observers for activity logging and auto-field generation (`member_id`, `pool_id`)

### 2.3 Seeders

| Seeder | Contents |
|---|---|
| `RolesAndPermissionsSeeder` | 3 roles × 10 permissions (mirrors frontend RBAC matrix) |
| `PricingTierSeeder` | Starter, Growth, Scale with exact values |
| `AdminUserSeeder` | Default admin account |
| `KnowledgeBaseSeeder` | FAQ and KB categories from frontend data |
| `DatabaseSeeder` | Orchestrates all seeders |

### 2.4 Verification

- `php artisan migrate --seed` runs without errors
- All foreign key constraints resolve correctly
- Relationships tested in `php artisan tinker`
- Feature test: `DatabaseSchemaTest` asserts all tables exist

---

## Phase 3 — Authentication & User Management

**Goal:** Secure token-based auth, role management, KYC onboarding, and profile management.
**Duration:** 3–4 days

### 3.1 Endpoints

```
POST   /api/v1/auth/register            Create account + send verification email
POST   /api/v1/auth/login               Return Sanctum Bearer token + user + role
POST   /api/v1/auth/logout              Revoke current token
POST   /api/v1/auth/verify-email        Verify email with OTP/link
POST   /api/v1/auth/verify-phone        Verify phone with SMS OTP
POST   /api/v1/auth/forgot-password     Send password reset email
POST   /api/v1/auth/reset-password      Reset with token

GET    /api/v1/user/profile             Authenticated user + role + permissions
PUT    /api/v1/user/profile             Update personal info
PUT    /api/v1/user/password            Change password
PUT    /api/v1/user/notifications       Toggle notification preferences
GET    /api/v1/user/wallet              Wallet balance + history
POST   /api/v1/user/wallet/withdraw     Request withdrawal (triggers M-Pesa B2C)

POST   /api/v1/onboarding              Submit member application
POST   /api/v1/onboarding/documents    Upload KYC documents (multipart)
GET    /api/v1/onboarding/:id/status   Check application status
```

### 3.2 Services

| Service | Responsibility |
|---|---|
| `AuthService` | Register, login, OTP generation and verification |
| `UserService` | Profile CRUD, notification preferences |
| `KycService` | Document upload, status management |
| `WalletService` | Balance queries, history, withdrawal initiation |

### 3.3 Key Business Rules

- Auto-generate unique `member_id` on registration — format: `BRK-XXXX`
- Default role on registration: `Member` — Admin upgrades manually
- Password policy: minimum 8 chars, 1 uppercase, 1 number
- Phone verification required before accessing protected resources
- Token TTL: 7 days
- Middleware stack: `auth:sanctum`, `role:admin`, `verified` applied per route group

### 3.4 Verification

- Register → verification email arrives (Mailtrap)
- Login → Bearer token returned
- `GET /api/v1/user/profile` with token → correct user + role
- Unauthenticated request → 401; wrong role → 403
- Feature tests: `AuthTest`, `ProfileTest`, `OnboardingTest`

---

## Phase 4 — Chama Management

**Goal:** Full CRUD for Chamas, member management, fine rules, payout schedules, and activity stream.
**Duration:** 4–5 days

### 4.1 Endpoints

```
GET    /api/v1/chamas                               List user's chamas
POST   /api/v1/chamas                               Create new chama
GET    /api/v1/chamas/:id                           Full chama detail + aggregated stats
PUT    /api/v1/chamas/:id                           Update chama info
DELETE /api/v1/chamas/:id                           Soft delete chama

GET    /api/v1/chamas/:id/members                   Member roster with contribution status
POST   /api/v1/chamas/:id/members                   Add single member
DELETE /api/v1/chamas/:id/members/:memberId         Remove member
PUT    /api/v1/chamas/:id/members/:memberId/role    Change member role

GET    /api/v1/chamas/:id/requests                  Pending join applications
POST   /api/v1/chamas/:id/requests/:reqId/approve   Approve application
POST   /api/v1/chamas/:id/requests/:reqId/reject    Reject application

GET    /api/v1/chamas/:id/fine-rules                Get fine configuration
PUT    /api/v1/chamas/:id/fine-rules                Update fine configuration

GET    /api/v1/chamas/:id/payout-schedule           List payout schedule
POST   /api/v1/chamas/:id/payout-schedule           Add payout entry
PUT    /api/v1/chamas/:id/payout-schedule/:id       Update payout entry

GET    /api/v1/chamas/:id/expenses                  List expenses
POST   /api/v1/chamas/:id/expenses                  Record expense

GET    /api/v1/chamas/:id/activity                  Activity stream (paginated)

POST   /api/v1/chamas/:id/members/bulk-import       CSV/Excel bulk member upload
GET    /api/v1/chamas/:id/members/template          Download CSV import template

GET    /api/v1/chamas/:id/management-team           Team + allowances
PUT    /api/v1/chamas/:id/management-team           Update team roles/allowances
```

### 4.2 Services

| Service | Responsibility |
|---|---|
| `ChamaService` | CRUD, stats aggregation, member management |
| `FineRuleService` | Rule CRUD, auto-apply fines on trigger events |
| `BulkImportService` | Parse CSV, validate rows, batch-create in DB transaction |
| `ActivityLogService` | Write to `activity_logs` for the activity stream |

### 4.3 Key Business Rules

- Stats endpoint aggregates: pool value, outstanding loans, monthly contributions, next payout
- `pool_id` auto-generated: `BC-` + random 4-digit unique number
- Late contribution auto-triggers `FineRuleService::applyLatePayment()` after grace period
- Bulk import: validate every row, return per-row errors, rollback all on any failure
- Member request approval sends notification to the applicant

### 4.4 Verification

- Create Chama → add members → configure fine rules → all persist correctly
- Bulk import of 10-row CSV creates all members
- Activity stream returns paginated log of all actions
- Feature tests: `ChamaTest`, `MemberManagementTest`, `FineRuleTest`, `BulkImportTest`

---

## Phase 5 — Loan Management System

**Goal:** Full loan lifecycle from application through repayment, with guarantor workflow and amortization.
**Duration:** 4–5 days

### 5.1 Endpoints

```
GET    /api/v1/chamas/:id/loans                         All loans + PAR metric
POST   /api/v1/chamas/:id/loans                         Apply for loan
GET    /api/v1/chamas/:id/loans/:loanId                 Loan detail + amortization schedule
PUT    /api/v1/chamas/:id/loans/:loanId/approve         Approve (chairperson/admin)
PUT    /api/v1/chamas/:id/loans/:loanId/reject          Reject
PUT    /api/v1/chamas/:id/loans/:loanId/disburse        Mark as disbursed

GET    /api/v1/chamas/:id/loans/:loanId/guarantors              List guarantors
PUT    /api/v1/chamas/:id/loans/:loanId/guarantors/:userId      Sign as guarantor

POST   /api/v1/chamas/:id/loans/:loanId/repayments      Record repayment
GET    /api/v1/chamas/:id/loans/:loanId/repayments      Repayment history

GET    /api/v1/user/loans                               All loans for auth user
```

### 5.2 Services

| Service | Responsibility |
|---|---|
| `LoanService` | Application, approval, disbursement, rejection lifecycle |
| `AmortizationService` | Generate full payment schedule (Flat Rate and Amortized) |
| `RepaymentService` | Record payment, update counters, detect full repayment |
| `GuarantorService` | Sign/decline requests, enforce minimum guarantor count |

### 5.3 Amortization Formulas

**Flat Rate**
```
total_interest    = principal × rate × months
monthly_payment   = (principal + total_interest) / months
```

**Amortized (Reducing Balance)**
```
monthly_payment   = P × [r(1+r)^n] / [(1+r)^n − 1]
where r = monthly interest rate, n = number of months
```

### 5.4 Key Business Rules

- Minimum **2 guarantors** required before loan can be approved
- Guarantor cannot guarantee their own loan
- **PAR** = (overdue loan balance / total outstanding balance) × 100
- `next_payment_date` auto-updated after each repayment
- Loan status → `Paid` when `amount_paid >= principal + total_interest`
- Scheduled job applies late repayment fines when `next_payment_date` passes

### 5.5 Verification

- Apply → guarantors notified → sign → loan becomes approvable → approve → disburse → repay → Paid
- Amortization schedule matches financial calculator output
- PAR metric updates correctly as loans go overdue
- Feature tests: `LoanApplicationTest`, `LoanRepaymentTest`, `AmortizationTest`, `GuarantorTest`

---

## Phase 6 — Contributions, Penalties & Transactions

**Goal:** Contribution recording, penalty management, and the unified transaction ledger.
**Duration:** 3–4 days

### 6.1 Endpoints

```
GET    /api/v1/chamas/:id/contributions             Contributions with period filter
POST   /api/v1/chamas/:id/contributions             Record contribution
GET    /api/v1/chamas/:id/contributions/summary     Monthly summary (paid/overdue/pending counts)

GET    /api/v1/chamas/:id/penalties                 All penalties (filterable by status)
POST   /api/v1/chamas/:id/penalties                 Issue penalty manually
PUT    /api/v1/chamas/:id/penalties/:id/pay         Mark penalty as paid
PUT    /api/v1/chamas/:id/penalties/:id/waive       Waive penalty (chairperson only)

GET    /api/v1/transactions                         Unified transaction log (type/date/search filters)
GET    /api/v1/transactions/:id                     Single transaction detail
GET    /api/v1/chamas/:id/transactions              Chama-scoped transactions

GET    /api/v1/user/wallet/transactions             Personal wallet statement
```

### 6.2 Services

| Service | Responsibility |
|---|---|
| `ContributionService` | Record payment, check grace period, trigger fine if late |
| `PenaltyService` | Issue, pay, waive; auto-apply from fine rules |
| `TransactionService` | Write a `transactions` row for every financial event |

### 6.3 Key Business Rules

- **Every financial event** (contribution, loan, repayment, penalty, payout) writes a `transactions` row
- Contribution marks member `status = paid` for that period
- Transaction `reference_id` format: `#TRX-` + 5 random digits (unique)
- Transaction list paginated, filterable by type, date range, and search term

### 6.4 Verification

- Record contribution → transaction row created → member status updated
- Late contribution (past grace period) → penalty auto-issued
- Transaction filters work correctly by type and date
- Feature tests: `ContributionTest`, `PenaltyTest`, `TransactionTest`

---

## Phase 7 — Meetings, Events, Polls & Documents

**Goal:** Full governance module — meetings with attendance, polls/elections, events, and document repository.
**Duration:** 3–4 days

### 7.1 Endpoints

```
GET/POST       /api/v1/chamas/:id/meetings
GET/PUT        /api/v1/chamas/:id/meetings/:meetingId
POST           /api/v1/chamas/:id/meetings/:meetingId/attendance    Bulk attendance record
POST           /api/v1/chamas/:id/meetings/:meetingId/apology       Submit apology

GET/POST/PUT/DELETE  /api/v1/chamas/:id/events/:eventId

GET/POST       /api/v1/chamas/:id/polls
GET            /api/v1/chamas/:id/polls/:pollId                     Poll detail + results
POST           /api/v1/chamas/:id/polls/:pollId/vote                Cast vote
PUT            /api/v1/chamas/:id/polls/:pollId/close               Close poll

GET/POST       /api/v1/chamas/:id/documents
DELETE         /api/v1/chamas/:id/documents/:docId
GET            /api/v1/chamas/:id/documents/:docId/download         Authenticated download
```

### 7.2 Key Business Rules

- Absent members auto-fined when meeting status transitions to `completed`
- Poll double-voting prevented by DB unique constraint on `(poll_id, voter_id)`
- Document `document_number` format: `{CATEGORY_CODE}-{CHAMA_CODE}-{YEAR}-{SEQUENCE}`
- Files stored at `documents/{chama_id}/{uuid}.{ext}` — never predictable URLs

### 7.3 Verification

- Meeting marked complete → absent members receive missed-meeting fine
- Vote twice on same poll → second vote rejected (422)
- Upload PDF → secure URL generated → download requires auth token
- Feature tests: `MeetingTest`, `PollTest`, `DocumentTest`, `EventTest`

---

## Phase 8 — Crowdfunding & Welfare Drives

**Goal:** Public milestone crowdfunding with CMA compliance and internal chama welfare drives.
**Duration:** 3–4 days

### 8.1 Endpoints

```
GET/POST       /api/v1/crowdfunding
GET/PUT/DELETE /api/v1/crowdfunding/:id
POST           /api/v1/crowdfunding/:id/contribute        Triggers M-Pesa STK push
GET            /api/v1/crowdfunding/:id/backers
GET/POST       /api/v1/crowdfunding/:id/updates
POST           /api/v1/crowdfunding/:id/refund            Process refund for failed drive

GET/POST       /api/v1/chamas/:id/welfare-drives
POST           /api/v1/chamas/:id/welfare-drives/:id/contribute

GET            /api/v1/reports/failed-drives              Drives past deadline, unfunded
POST           /api/v1/reports/process-refunds            Batch refund processing
```

### 8.2 Services

| Service | Responsibility |
|---|---|
| `CrowdfundingService` | CRUD, status transitions, goal completion check |
| `WelfareDriveService` | Chama-internal welfare management |
| `RefundService` | M-Pesa reversals for failed drives, 48-hour deadline enforcement |
| `CmaComplianceService` | Enforce KES 100,000 retail investor cap |

### 8.3 Key Business Rules

- Status auto-transitions: `Active → Funded` when `raised >= goal`
- Status auto-transitions: `Active → Expired` when `campaign_end` passes unfunded
- CMA: individual contribution capped at **KES 100,000** per campaign
- Refund deadline: **48 hours** after `campaign_end` for failed campaigns
- Escrow model: funds held until goal met; all backers refunded if campaign expires
- Scheduled job: `CheckExpiredCampaigns` runs hourly

### 8.4 Verification

- Contribute until goal reached → status auto-transitions to `Funded`
- Expired campaign → batch refund runs → refund transactions created
- Contribution > KES 100,000 → rejected with CMA compliance error
- Feature tests: `CrowdfundingTest`, `WelfareDriveTest`, `RefundTest`

---

## Phase 9 — M-Pesa Integration (Daraja API)

**Goal:** Real mobile money integration for all payment operations.
**Duration:** 4–5 days

### 9.1 Endpoints

```
POST   /api/v1/payments/mpesa/stk-push            Initiate STK push (prompt on phone)
GET    /api/v1/payments/mpesa/:reference/status   Poll payment status
POST   /api/v1/payments/mpesa/callback            Daraja callback webhook (no auth — public)
POST   /api/v1/payments/withdraw                  Request M-Pesa B2C withdrawal
POST   /api/v1/payments/withdraw/callback         B2C result callback (no auth — public)
```

### 9.2 Daraja API Setup

1. Register on Safaricom Developer Portal → Consumer Key + Secret
2. Configure `.env`:
   ```
   MPESA_CONSUMER_KEY=
   MPESA_CONSUMER_SECRET=
   MPESA_SHORTCODE=
   MPESA_PASSKEY=
   MPESA_CALLBACK_URL=https://api.baraka.co.ke/api/v1/payments/mpesa/callback
   ```
3. Use **sandbox** for development, production credentials for staging/live
4. Expose locally via `ngrok http 8000` during development

### 9.3 Services

| Service | Responsibility |
|---|---|
| `MpesaService` | Authenticate (Redis-cached token), STK push, B2C, C2B |
| `MpesaCallbackService` | Parse Daraja callback, update records, fire domain events |

### 9.4 Key Business Rules

- Access token cached in **Redis for 55 minutes** (Daraja token expires at 60 min)
- On successful callback → fire `PaymentReceived` event
- Event listeners: `RecordContribution`, `RecordLoanRepayment`, `RecordWalletTopUp`, `RecordCrowdfundingContribution`
- Validate callback IP is from Safaricom's IP range before processing
- **Idempotent**: check `mpesa_receipt_number` exists before processing — ignore duplicates

### 9.5 Verification

- Sandbox STK push → payment prompt appears on test phone
- Callback received → `mpesa_transactions` and `transactions` updated correctly
- Failed payment → status set to `failed`
- Feature tests: `MpesaCallbackTest` (mocked HTTP), `PaymentFlowTest`

---

## Phase 10 — Reporting, BI & AI Integration

**Goal:** Financial reports, PDF/Excel exports, platform BI metrics, and AI-powered analysis.
**Duration:** 3–4 days

### 10.1 Endpoints

```
GET    /api/v1/reports/financial                    Financial report with date/category filters
GET    /api/v1/reports/financial/export             Export as PDF or Excel
GET    /api/v1/reports/chama/:id/statement          Chama financial statement
GET    /api/v1/reports/member/:id/statement         Member individual statement (PDF)
GET    /api/v1/reports/summary                      Platform-wide KPIs (admin only)

GET    /api/v1/accountability/kpis                  MAU, retention, churn rate
GET    /api/v1/accountability/engagement            DAU/WAU trend data
GET    /api/v1/accountability/feature-adoption      Feature usage percentages
GET    /api/v1/accountability/revenue               MRR breakdown by tier
GET    /api/v1/accountability/growth                Historical MRR trend

POST   /api/v1/ai/summarize-report                  AI financial report summarization
POST   /api/v1/ai/investment-recommendations        AI investment recommendations
POST   /api/v1/ai/create-documentation              AI document generation
POST   /api/v1/ai/inflation-goal-adjuster           Inflation contribution calculator
```

### 10.2 Services

| Service | Responsibility |
|---|---|
| `ReportService` | Query transactions, aggregate income/expenses, group by category |
| `PdfExportService` | DomPDF — render Blade templates as PDF with Baraka branding |
| `ExcelExportService` | Maatwebsite Excel — XLSX exports |
| `AccountabilityService` | Platform KPIs, engagement metrics, revenue aggregation |
| `AiService` | Guzzle → Google Gemini REST API, Redis-cache responses for 1 hour |

### 10.3 AI Integration Notes

- Move AI calls from Next.js Genkit to **Laravel backend** for centralised key management
- Use `guzzlehttp/guzzle` to call Google Gemini REST API directly
- Identical inputs return cached result from Redis (1-hour TTL) — avoids duplicate AI costs
- Input/output schemas match the existing Genkit flow contracts exactly:
  - `summarize-report`: `{ financialReport: string }` → `{ summary: string }`
  - `investment-recommendations`: `{ milestones, riskTolerance, investmentPreferences, financialHabits }` → `{ recommendations[], summary }`
  - `create-documentation`: `{ title, rawText, format }` → `{ structuredContent: string }`
  - `inflation-goal-adjuster`: `{ goalName, initialCost, currentCost, numberOfMembers, contributionFrequency }` → `{ percentageIncrease, alertMessage, suggestedIncrease, suggestionMessage }`

### 10.4 Key Metrics

| Metric | Calculation |
|---|---|
| MAU | Distinct users with a transaction/action in last 30 days |
| Churn Rate | Cancelled subscriptions / total subscriptions for period |
| PAR (Portfolio at Risk) | Overdue loan balance / total outstanding loan balance × 100 |
| MRR | Sum of active subscription monthly fees by tier |

### 10.5 Verification

- Financial report aggregates income/expenses correctly for a date range
- PDF renders with correct data and Baraka branding (emerald + gold)
- Excel file opens correctly in Google Sheets
- AI summarization returns structured insight for sample financial text
- Feature tests: `ReportTest`, `ExportTest`, `AccountabilityTest`, `AiServiceTest`

---

## Phase 11 — Communications & Notifications

**Goal:** Multi-channel broadcast system with scheduling and in-app notification management.
**Duration:** 3–4 days

### 11.1 Endpoints

```
POST   /api/v1/communications/broadcast             Send broadcast immediately
POST   /api/v1/communications/schedule              Schedule broadcast for later
GET    /api/v1/communications/history               Broadcast history (paginated)
GET    /api/v1/communications/scheduled             Pending scheduled broadcasts
PUT    /api/v1/communications/scheduled/:id         Edit scheduled broadcast
DELETE /api/v1/communications/scheduled/:id         Cancel scheduled broadcast
GET    /api/v1/communications/analytics             Delivery + engagement metrics
POST   /api/v1/communications/upload                Upload audio/PDF attachment

GET    /api/v1/notifications                        User's in-app notifications
PUT    /api/v1/notifications/:id/read               Mark as read
PUT    /api/v1/notifications/read-all               Mark all as read
```

### 11.2 Channel Services

| Service | Integration |
|---|---|
| `BroadcastService` | Resolve audience, fan-out to all selected channels |
| `InAppNotificationService` | Insert to `notifications` table |
| `SmsService` | Africa's Talking bulk SMS API |
| `WhatsAppService` | Meta Cloud API / Twilio for Business |
| `EmailService` | Laravel Mail + queued jobs (Mailgun or Postmark) |
| `SchedulerService` | `SendScheduledBroadcasts` job runs every minute |

### 11.3 Key Business Rules

- All broadcasts dispatched as **queued jobs** — HTTP response never blocks on delivery
- Audience resolution: `AllChamas → all members`, `SingleChama → specific chama members`
- WhatsApp uses **template messages** for regulatory compliance
- Delivery tracking: update `broadcasts.status` on success/failure per channel

### 11.4 Verification

- Send broadcast → all target members receive in-app notification immediately
- Schedule broadcast 1 minute ahead → fires at correct time
- Cancel before firing → does not send
- Feature tests: `BroadcastTest`, `NotificationTest`, `SmsServiceTest` (mocked)

---

## Phase 12 — Marketplace, Investments & Learning

**Goal:** Member business directory, investment portfolio management, and course LMS with certificates.
**Duration:** 3–4 days

### 12.1 Marketplace

```
GET/POST       /api/v1/businesses
GET/PUT/DELETE /api/v1/businesses/:id
```

### 12.2 Investments

```
GET/POST       /api/v1/investments/portfolios               Admin manages portfolios
PUT/DELETE     /api/v1/investments/portfolios/:id
GET            /api/v1/investments/user                     User's active investments
POST           /api/v1/investments/invest                   Make investment
```

### 12.3 Learning (LMS)

```
GET/POST       /api/v1/courses
GET            /api/v1/courses/:id
POST           /api/v1/courses/:id/enroll                   Enrol in course
PUT            /api/v1/courses/:id/progress                 Update progress (0–100)
GET            /api/v1/certificates                         User's earned certificates
GET            /api/v1/certificates/:id/download            Download certificate PDF

POST/PUT/DELETE /api/v1/admin/courses/:id
GET             /api/v1/admin/courses/stats
```

### 12.4 Services

| Service | Responsibility |
|---|---|
| `BusinessService` | CRUD + image upload |
| `InvestmentService` | Portfolio management, user investment tracking |
| `CourseService` | Enrolment, progress tracking, completion detection |
| `CertificateService` | Auto-generate PDF certificate when progress reaches 100% |

### 12.5 Verification

- Member lists business → searchable by others by name and category
- Admin creates portfolio → member invests → `user_investments` record created
- Enrol → update progress to 100 → certificate PDF auto-generated → downloadable
- Feature tests: `MarketplaceTest`, `InvestmentTest`, `LearningTest`, `CertificateTest`

---

## Phase 13 — Admin, Subscriptions & Support

**Goal:** SaaS subscription lifecycle, platform admin controls, awards, and help desk.
**Duration:** 3–4 days

### 13.1 Admin & Subscription Endpoints

```
GET    /api/v1/admin/subscriptions
PUT    /api/v1/admin/subscriptions/:id              Edit (tier, status, renewal date)
POST   /api/v1/admin/subscriptions/:id/upgrade
POST   /api/v1/admin/subscriptions/:id/suspend
POST   /api/v1/admin/subscriptions/:id/cancel
POST   /api/v1/admin/subscriptions/:id/reminder     Send renewal reminder email

GET    /api/v1/admin/pricing
PUT    /api/v1/admin/pricing                        Update tier pricing

GET    /api/v1/admin/roles
PUT    /api/v1/admin/roles                          Update permission matrix

GET/POST       /api/v1/admin/awards
PUT/DELETE     /api/v1/admin/awards/:id
POST           /api/v1/admin/awards/:id/assign      Assign award to member
```

### 13.2 Support Endpoints

```
GET/POST       /api/v1/support/tickets
GET            /api/v1/support/tickets/:id
POST           /api/v1/support/tickets/:id/comments
PUT            /api/v1/support/tickets/:id/status   Admin updates status

GET            /api/v1/support/knowledge-base       Public — no auth required
GET            /api/v1/support/faqs                 Public — no auth required

POST/PUT/DELETE /api/v1/admin/knowledge-base/:id
```

### 13.3 Scheduled Jobs

| Job | Schedule | Action |
|---|---|---|
| `CheckSubscriptionRenewals` | Daily | Send reminder email 7 days before renewal |
| `SuspendOverdueSubscriptions` | Daily | Suspend if payment overdue > 14 days |

### 13.4 Verification

- Admin suspends chama subscription → chama members notified
- Renewal reminder email sent 7 days before expiry (verified in Mailtrap)
- Support ticket → staff comment → status updated to `Answered` → user notified
- Feature tests: `SubscriptionTest`, `SupportTest`, `AwardTest`

---

## Phase 14 — Security Hardening & Optimisation

**Goal:** Production-ready security posture, N+1 elimination, and rate limiting.
**Duration:** 2–3 days

### 14.1 Security Checklist

| Area | Implementation |
|---|---|
| Rate limiting | 60 req/min on `api`; 5 req/min on `auth` routes |
| Input sanitization | Strip dangerous HTML from all text fields |
| SQL injection | Eloquent ORM only — audit all code for raw queries |
| File uploads | Validate MIME type server-side; reject executables |
| Sensitive data masking | `national_id` returned as `*****XXXX` in all responses |
| HTTPS | Enforced via Forge/Nginx in production |
| Token scopes | Granular Sanctum token abilities per route group |
| Webhook validation | Daraja callback IP whitelist enforced |
| Audit logging | All failed auth attempts logged to `activity_logs` |

### 14.2 Performance Checklist

| Area | Implementation |
|---|---|
| N+1 queries | Eager load all relationships with `with()` — verify via Telescope |
| Database indexes | All FK columns + common query columns indexed |
| Redis caching | AI responses (1hr), pricing tiers (24hr), platform KPIs (1hr) |
| Production caching | `route:cache`, `config:cache`, `view:cache` in deploy script |
| Pagination | All list endpoints paginated — default 15, max 100 per page |
| Queue monitoring | Laravel Horizon installed and configured |

### 14.3 Verification

- Telescope shows zero N+1 queries on all main endpoints
- 100 concurrent requests to `GET /api/v1/chamas` complete under 2 seconds
- OWASP top-10 checklist reviewed and all items addressed
- Feature tests: `SecurityTest`, `RateLimitTest`

---

## Phase 15 — Full Test Suite

**Goal:** Comprehensive Pest test coverage across all modules.
**Duration:** 3–4 days *(tests written incrementally each phase, finalised here)*

### 15.1 Test Structure

```
tests/
├── Unit/
│   ├── AmortizationServiceTest.php
│   ├── FineRuleServiceTest.php
│   ├── MpesaServiceTest.php
│   └── CmaComplianceServiceTest.php
├── Feature/
│   ├── Auth/
│   ├── Chama/
│   ├── Loans/
│   ├── Contributions/
│   ├── Crowdfunding/
│   ├── Payments/
│   ├── Reports/
│   ├── Communications/
│   └── Admin/
└── Integration/
    └── MpesaCallbackTest.php
```

### 15.2 Coverage Targets

| Test Type | Scope |
|---|---|
| Unit | All Service class calculations and business rules |
| Feature | Every endpoint — happy path, validation errors, unauthorised access |
| Integration | Full M-Pesa callback flow with mocked Daraja response |
| **Minimum** | **80% code coverage** |

### 15.3 Pest Conventions

```php
// Authentication
Sanctum::actingAs($user, ['*']);

// External services (never call real APIs in tests)
Http::fake(['api.safaricom.co.ke/*' => Http::response([...])]);
Http::fake(['sms.africastalking.com/*' => Http::response([...])]);

// Database
uses(RefreshDatabase::class);

// Assertions
expect($response->status())->toBe(200);
expect($response->json('data.status'))->toBe('Active');
```

---

## Phase 16 — Deployment & CI/CD

**Goal:** Automated CI pipeline, Forge provisioning, and production go-live.
**Duration:** 2–3 days

### 16.1 GitHub Setup

- Repository: `github.com/{yourname}/baraka-api`
- Branch strategy: `main` (production), `develop` (staging), feature branches
- GitHub Actions CI: run full Pest suite on every push to `main` and `develop`

### 16.2 Forge Server Provisioning

1. Create server on Forge — DigitalOcean, minimum **2 vCPU / 2 GB RAM**
2. Forge auto-installs: **PHP 8.3, MySQL 8, Redis, Nginx, Supervisor, Certbot**
3. Create site: `api.baraka.co.ke` → connect to `baraka-api` GitHub repo
4. Enable **Let's Encrypt SSL** — one click in Forge dashboard

### 16.3 Forge Deploy Script

```bash
cd /home/forge/api.baraka.co.ke
git pull origin main
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan db:seed --class=PricingTierSeeder --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
php artisan horizon:terminate
```

### 16.4 Forge Daemon Configuration

| Daemon | Command | Purpose |
|---|---|---|
| Queue Worker | `php artisan queue:work redis --tries=3 --timeout=90` | Process background jobs |
| Horizon | `php artisan horizon` | Queue monitoring dashboard |
| Scheduler | `* * * * * php artisan schedule:run` | Cron jobs (subscriptions, campaign checks) |

### 16.5 Next.js on Vercel

```
Project: baraka (GitHub repo)
NEXT_PUBLIC_API_URL = https://api.baraka.co.ke/api/v1
Auto-deploy: on push to main
```

### 16.6 DNS Records

```
api.baraka.co.ke   A      → [Forge server IP]
app.baraka.co.ke   CNAME  → cname.vercel-dns.com
```

### 16.7 Go-Live Verification

- `GET https://api.baraka.co.ke/api/v1/ping` → 200 OK
- Login from `https://app.baraka.co.ke` → token received → data loads from real API
- M-Pesa STK push works on production (Daraja live credentials)
- All 15 test suites pass in GitHub Actions CI
- Laravel Horizon dashboard shows queues processing

---

## Frontend Integration — Files to Update

Once each phase is complete, the corresponding Next.js files are updated:

| Frontend File | Change |
|---|---|
| `src/app/lib/data.ts` | Replace static exports with `apiFetch()` calls |
| `src/middleware.ts` | Add token check → redirect to `/login` if missing |
| `src/hooks/use-role.tsx` | Fetch role from `GET /api/v1/user/profile` |
| `src/app/actions.ts` | Route all AI calls through `/api/v1/ai/*` |
| All form `page.tsx` files | Replace `setTimeout` simulations with real `POST` calls |

### Centralised API Client (`src/lib/api.ts`)

```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

*Total estimated duration: **52–65 working days** across 16 phases.*
*Each phase is independently deployable and tested before the next phase begins.*
