User Roles & RBAC
The platform enforces strict role‑based access control (RBAC).
4.1 Landlord
The landlord is the portfolio owner. They can:
    • Create properties and units
    • Add or remove tenants
    • Configure rent and billing rules
    • View dashboards and reports
    • Approve maintenance jobs and payment plans
    • Export data (PDF, CSV)
4.2 Property Manager / Agent
If a landlord still uses a Property Manager, the manager can:
    • Manage multiple properties
    • Generate invoices and bulk bill tenants
    • Reconcile payments
    • Report to the landlord
    • Do approvals
4.3 Caretaker
Caretakers handle on‑site operations. They can:
    • Confirm occupancy and tenant moves
    • Triage maintenance requests and upload evidence
    • Notify tenants (invoices and notices) upon approval
They cannot view full financial data or alter billing rules.
4.4 Tenant
Tenants use the system to:
    • Pay rent (BYOP or Smart Collection)
    • View balances, receipts and arrears
    • Submit maintenance requests and track status
    • Receive notices and reminders
4.5 Service Provider
Service providers (plumbers, electricians, cleaners, security companies) can:
    • Register a profile and receive job requests
    • Submit quotes
    • Update job progress and upload proof of work
    • Build a rating and performance history

5. Core System Architecture
RentIQ is built as a web‑based platform with mobile optimisation. It includes the following modules:
    1. Authentication & RBAC – secure user logins and strict role permissions.
    2. Property & Unit Management – creation and management of properties, units and rent configurations.
    3. Tenant Management – onboarding, storing tenant details, lease documents and ledgers.
    4. Billing & Invoicing – recurring rent and additional charges (utilities, service charge, penalties, credits).
    5. Rent Collection – BYOP reconciliation and optional Smart Collection payment rails.
    6. Payment Reconciliation – automatic or manual matching of payments to invoices.
    7. Arrears Management – discipline engine with escalation ladders, payment plans and audit trails.
    8. Maintenance Workflow – request submission, triage, approval, vendor assignment, job completion and rating.
    9. Vendor Marketplace – listing and assigning service providers, tracking performance and enabling commissions.
    10. Communication – in‑app, SMS and email notifications, with bulk messaging capabilities.
    11. Reporting & Analytics – dashboards, arrears analytics, property comparisons, exports (PDF, CSV) and scheduled owner statements.

6. Phase 1 – Core MVP Features
6.1 Dashboard
The dashboard provides landlords with a real‑time overview:
    • Tenant arrears – list of tenants who owe rent with quick access to send reminders.
    • Payments & invoices summary – total billed vs. total paid with date filters and charts.
    • Occupancy – breakdown of occupied vs. vacant units plus quick actions to add or remove tenants.
    • Top arrears tenants – top five tenants with the highest arrears.
    • Quick actions – shortcuts to add tenants, upload statements, shift tenants, etc.
6.2 Property & Unit Management
Landlords can add properties (name, location, units) and units (unit number, monthly rent, occupancy status). Units can then be assigned to tenants.
6.3 Tenant Onboarding
Each tenant profile stores:
    • Name, phone, ID number, email
    • Property and unit
    • Monthly rent amount
    • Lease start and end dates
    • Deposit amount
    • Move‑in and move‑out dates
    • Optional KRA PIN
    • Uploaded lease document (PDF)
Tenants are tracked in a ledger and can be shifted between units, deleted or restored via a history log. Bulk imports and PDF exports of tenants are supported.
6.4 Rent Collection
Two payment models are supported:
    • BYOP (Bring Your Own PayBill) – landlords keep their bank paybill or direct settlement. RentIQ reconciles payments via references and statement imports.
    • Smart Collection (Optional) – tenants pay into RentIQ rails. Payments post instantly, generate receipts automatically and feed the ledger without manual intervention.
Rent statuses include paid, partially paid or overdue.
6.5 Automated Reminders
The system sends automatic reminders at configurable intervals (e.g. 5th, 10th, 15th of the month) before, on and after the rent due date.
6.6 Receipts & Payment Records
Each successful payment triggers an auto‑generated receipt. Payment histories can be exported as PDF or CSV.
6.7 Payment Module
The payment module allows:
    • Bank statement uploads for reconciliation
    • Manual payment entries for tenants who pay cash
    • Filters by payment source (M‑Pesa, bank, manual)
    • Date filters and search

7. Phase 2 – Operational Control
These features reduce reliance on agents and caretakers.
7.1 Maintenance Management
Tenants submit maintenance requests with a category, description and photo evidence. Caretakers triage requests, landlords approve or decline, vendors are assigned, and job completion is tracked (including rating and cost).
7.2 Vendor Marketplace
Service providers register profiles. Landlords select providers, track job histories and rate performance. This builds a marketplace that can later be monetised via commissions or subscriptions.
7.3 Communication System
Built‑in messaging supports landlord–tenant communication and broadcast announcements. SMS integration is available for critical alerts.