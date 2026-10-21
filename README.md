# Asaan Safar (آسان سفر) • TransitPK Intercity Express
### Enterprise Bus Terminal & Adda Management Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-green?logo=vitest)](https://vitest.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 1. Overview & System Architecture

**Asaan Safar (آسان سفر)** is a national transit management platform engineered for Pakistani intercity coach operators and municipal feeder lines. Built with high resilience, strict role-based data governance, atomic seat locking, and live telemetry, the platform serves passengers, conductors, station managers, and fleet executives.

### Key Architectural Principles
- **Atomic Seat Hold & Collision Shield**: Concurrent booking conflicts are prevented at the service layer with automatic 5-minute expiry sweeps.
- **Role-Based PII Masking**: Conductors receive masked manifests (CNIC: `35201-*****67-1`, Phone: `0300-***4567`). Access to unmasked records requires admin authority and writes to an immutable security audit log.
- **Safe Vehicle Replacement Engine**: Coach swaps validate that replacement capacity $\ge$ current booked seats, preventing passenger displacement or reservation loss during breakdowns.
- **Offline & Error Resilience**: Global React Error Boundaries and dynamic connection status banners gracefully handle intermittent mobile connectivity.

---

## 2. Quick Start & Operational Verification

### Prerequisites
- Node.js `v20.0+` or `v25.0+`
- npm `v10.0+`

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Run automated Vitest test suites (29 tests)
npm test

# Run ESLint compliance check (0 errors, 0 warnings)
npm run lint

# Run TypeScript static analysis
npx tsc --noEmit

# Compile production bundle
npm run build
```

---

## 3. Demo Staff & Customer Credentials

| Role | Email | Password | Access Level & Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@transitpk.pk` | `admin123` | Full access: Fleet swaps, route creation, fare edits, unmasked manifest, security audit log |
| **Terminal Conductor** | `conductor@transitpk.pk` | `conductor123` | Gate scanner: Masked passenger manifests, platform boarding check-in, ticket verification |
| **Passenger** | `customer@transitpk.pk` | `customer123` | Public portal: Journey search, interactive seat selection, payment settlement, digital e-tickets |

---

## 4. External Integrations Matrix (Live vs. Simulated)

| Integration / Provider | Purpose | Status in Dev/Demo | Production Implementation |
| :--- | :--- | :--- | :--- |
| **1LINK 1BILL (PSID)** | Interbank payments & ATM bill voucher generation | **Simulated** | Live 1LINK REST API via State Bank regulated fintech aggregator |
| **Easypaisa Merchant** | Mobile wallet direct debits | **Simulated** | Live Telenor Easypaisa Merchant Gateway via IPN callback |
| **JazzCash Merchant** | Mobile wallet & debit processing | **Simulated** | Live Mobilink JazzCash API with SHA256 HMAC integrity hashes |
| **NADRA Verisys** | Citizen CNIC identity verification | **Simulated** | Live NADRA B2B API (5-7-1 format validation active) |
| **Pakistan Telemetry WS** | Real-time vehicle GPS & Bay telemetry | **Simulated WebSocket** | Live MQTT / WebSocket broker linked to Teltonika OBD-II vehicle trackers |
| **SMS / WhatsApp Gateway** | Booking confirmation & gate boarding alerts | **Simulated** | Live Twilio / Zong Bulk SMS API with `TransitPK` alpha masking |

> [!NOTE]
> All simulated integrations strictly emulate real-world payloads, idempotency keys, verification tokens, and failure response codes.

---

## 5. Environment Variables & Configuration

A template configuration is provided in [`.env.example`](file:///d:/fullweb%20box/Asaan%20Saffar/.env.example):

```env
# Application Host & WebSocket
VITE_APP_ENV=production
VITE_API_URL=https://api.transitpk.pk/v1
VITE_WS_URL=wss://telemetry.transitpk.pk/ws/fleet

# Security & PII Protection
JWT_SECRET=replace_with_64_byte_cryptographic_string
ENCRYPTION_KEY_AES256=replace_with_256_bit_hex_key
PII_MASKING_STRICT_MODE=true

# Database & Cache Cluster
DATABASE_URL=postgresql://transitpk_app:password@db-cluster:5432/transitpk_prod?sslmode=require
REDIS_URL=redis://default:password@redis-cluster:6379/0
REDIS_SEAT_HOLD_TTL_SECONDS=300
```

---

## 6. Deployment, Backup & Disaster Recovery Runbook

### Production Deployment (Docker & NGINX)
```dockerfile
# Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Database Backup & Retention Policy
- **Continuous Archiving**: PostgreSQL WAL (Write-Ahead Logging) streamed to encrypted S3 / Cloud Storage buckets with 1-minute RPO (Recovery Point Objective).
- **Daily Snapshots**: Automated pg_dump full backups executed daily at 03:00 PKT (low traffic period) with 90-day retention.
- **Disaster Recovery Target**:
  - **RTO (Recovery Time Objective)**: $< 15\text{ minutes}$ via automated container failover.
  - **RPO (Recovery Point Objective)**: $< 5\text{ minutes}$ via WAL replication.

### Emergency Rollback Procedure
1. If a production release encounters a critical bug, roll back the NGINX or container image tag to the preceding immutable hash:
   ```bash
   kubectl rollout undo deployment/transitpk-frontend
   ```
2. Clear Redis seat cache keys if seat layout schema underwent incompatible changes:
   ```bash
   redis-cli -u $REDIS_URL EVAL "return redis.call('del', unpack(redis.call('keys', 'seat_hold:*')))" 0
   ```
3. Audit the immutable security log at `/admin/audit` to ensure no transactions were dropped during the failover window.

---

## 7. Automated Testing Suite

The repository contains 4 comprehensive test suites executed via Vitest and Happy-DOM:

1. [`src/__tests__/booking-flow-concurrency.test.ts`](file:///d:/fullweb%20box/Asaan%20Saffar/src/__tests__/booking-flow-concurrency.test.ts):
   - Atomic seat holding and concurrency conflict rejection.
   - Prevention of double-booking under simultaneous load.
   - Idempotency key preservation (replays return identical booking without duplicate charge).
   - Opaque QR code payload verification.
2. [`src/__tests__/validation-and-errors.test.ts`](file:///d:/fullweb%20box/Asaan%20Saffar/src/__tests__/validation-and-errors.test.ts):
   - Pakistani CNIC format (5-7-1) validation and masking.
   - Pakistani mobile prefix (03XX) validation and middle-digit masking.
   - XSS sanitization and Rupee currency formatting.
3. [`src/__tests__/security-rbac-pii.test.ts`](file:///d:/fullweb%20box/Asaan%20Saffar/src/__tests__/security-rbac-pii.test.ts):
   - Service-level authorization assertions throwing 403 Forbidden.
   - Conductor role manifest masking vs. Admin unmasked access with audit logging.
   - Gate check-in admission and duplicate-boarding prevention.
4. [`src/__tests__/cancellation-and-safe-operations.test.ts`](file:///d:/fullweb%20box/Asaan%20Saffar/src/__tests__/cancellation-and-safe-operations.test.ts):
   - Tiered cancellation refund calculator (>24h = 100%, 12-24h = 75%, 2-12h = 50%, <2h = 0%).
   - Terminal fee retention policy.
   - Safe vehicle replacement capacity safeguard.
   - Safe departure cancellation with automatic refund batch queuing.
