# OptiStack Backend - Complete Implementation Roadmap

Based on SOW: AI-Powered Health & Wellness Mobile Application

---

## Project Overview

Backend for a health & wellness platform with AI assistants, wearable sync, health journaling, OCR scanning, and admin dashboard.

**Tech Stack:**

- Node.js + Express
- PostgreSQL + Prisma ORM
- AI: OpenAI GPT-4o / Claude / Gemini
- OCR: Google Vision API
- Payments: Stripe
- Wearables: Apple HealthKit + Google Fit APIs

---

## Implementation Status

### ✅ Phase 1: Authentication (COMPLETED)

- [x] User Registration with onboarding
- [x] Login with JWT
- [x] Email Verification (OTP)
- [x] Password Reset (OTP via email)
- [x] Protected Routes Middleware
- [x] User Profile with health data

**Files Created:**

- `src/services/auth.service.js`
- `src/controllers/auth.controller.js`
- `src/routes/auth.routes.js`
- `src/middlewares/auth.js`
- `src/validations/auth.validation.js`
- `src/utils/sendEmail.js`

---

## 🚀 Phase 2: Core Backend Features (NEXT STEPS)

### 2.1 Database Schema Design

**Priority: HIGH**

Models to create:

```prisma
// Health Data Models
model HealthMetric {
  id          Int      @id @default(autoincrement())
  userId      Int
  type        String   // weight, blood_pressure, heart_rate, etc.
  value       Float
  unit        String
  source      String   // manual, wearable, etc.
  recordedAt  DateTime
  user        User     @relation(fields: [userId], references: [id])
}

model Journal {
  id          Int      @id @default(autoincrement())
  userId      Int
  content     String   @db.Text
  mood        String?
  aiSummary   String?  @db.Text
  tags        String[]
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model DoctorReport {
  id            Int      @id @default(autoincrement())
  userId        Int
  title         String
  ocrText       String?  @db.Text
  aiAnalysis    String?  @db.Text
  fileUrl       String
  uploadedAt    DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
}

model Reminder {
  id          Int       @id @default(autoincrement())
  userId      Int
  title       String
  description String?
  time        DateTime
  frequency   String    // daily, weekly, custom
  isActive    Boolean   @default(true)
  user        User      @relation(fields: [userId], references: [id])
}

model WearableData {
  id          Int      @id @default(autoincrement())
  userId      Int
  source      String   // apple_health, google_fit
  dataType    String   // steps, calories, sleep, etc.
  value       Float
  unit        String
  syncedAt    DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model Subscription {
  id              Int      @id @default(autoincrement())
  userId          Int      @unique
  plan            String   // free, premium, pro
  stripeCustomerId String?
  status          String   // active, cancelled, expired
  startDate       DateTime
  endDate         DateTime?
  user            User     @relation(fields: [userId], references: [id])
}

model AffiliateProduct {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @db.Text
  category    String
  affiliateLink String
  imageUrl    String?
  price       Float?
  isActive    Boolean  @default(true)
  clicks      Int      @default(0)
}

model AffiliateClick {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  clickedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  product   AffiliateProduct @relation(fields: [productId], references: [id])
}

model AIConversation {
  id          Int      @id @default(autoincrement())
  userId      Int
  messages    Json     // Array of {role, content, timestamp}
  context     String?  // health, journal, general
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

---

### 2.2 Health Data Management

**Priority: HIGH**

**Endpoints:**

- `POST /api/health/metrics` - Log health metric
- `GET /api/health/metrics` - Get user's health data
- `GET /api/health/metrics/:type` - Get specific metric type
- `DELETE /api/health/metrics/:id` - Delete metric
- `GET /api/health/summary` - Get AI-powered health summary

**Features:**

- Manual health data entry
- Data visualization helpers
- Export to PDF
- Historical trending

---

### 2.3 Health Journal System

**Priority: HIGH**

**Endpoints:**

- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get all entries
- `GET /api/journal/:id` - Get single entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry
- `POST /api/journal/:id/analyze` - AI analysis of entry

**Features:**

- Rich text support
- Mood tracking
- AI-powered insights
- Tag system
- Search & filter

---

### 2.4 AI Integration

**Priority: HIGH**

**Services to create:**

```javascript
// src/services/ai.service.js
-chatWithAssistant() - // General AI chat
  analyzeJournalEntry() - // Journal analysis
  generateHealthSummary() - // Health insights
  analyzeDoctorReport() - // OCR + AI analysis
  suggestProducts(); // Product recommendations
```

**AI Providers:**

- OpenAI GPT-4o (primary)
- Claude API (fallback)
- Gemini Pro (alternative)

**Configuration:**

```env
OPENAI_API_KEY=
CLAUDE_API_KEY=
GEMINI_API_KEY=
AI_PROVIDER=openai  # openai | claude | gemini
```

---

### 2.5 OCR Integration (Google Vision API)

**Priority: MEDIUM**

**Endpoints:**

- `POST /api/ocr/scan` - Upload and scan document
- `GET /api/ocr/reports` - Get all scanned reports
- `GET /api/ocr/reports/:id` - Get single report

**Features:**

- Document upload (images, PDFs)
- Text extraction
- AI analysis of extracted text
- Storage with cloud service

---

### 2.6 Wearable Integration

**Priority: MEDIUM**

**Endpoints:**

- `POST /api/wearable/sync/apple` - Sync Apple HealthKit
- `POST /api/wearable/sync/google` - Sync Google Fit
- `GET /api/wearable/data` - Get synced data
- `DELETE /api/wearable/disconnect` - Disconnect device

**Features:**

- OAuth for device connection
- Background sync scheduling
- Data normalization
- Historical data import

---

### 2.7 Reminder System

**Priority: MEDIUM**

**Endpoints:**

- `POST /api/reminders` - Create reminder
- `GET /api/reminders` - Get all reminders
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

**Features:**

- Time-based reminders
- Wearable-triggered reminders
- Push notifications
- Recurring schedules

---

### 2.8 Subscription & Payment (Stripe)

**Priority: HIGH**

**Endpoints:**

- `POST /api/subscription/create` - Create subscription
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/webhook` - Stripe webhook

**Features:**

- Free tier limitations
- Premium features unlock
- Subscription management
- Payment history

---

### 2.9 Affiliate System

**Priority: MEDIUM**

**Endpoints:**

- `GET /api/products` - Get recommended products
- `POST /api/products/click/:id` - Track click
- `GET /api/products/analytics` - Click analytics

**Features:**

- Product recommendations
- Affiliate link tracking
- Commission tracking
- Analytics dashboard

---

### 2.10 PDF Generation

**Priority: MEDIUM**

**Endpoints:**

- `GET /api/reports/health-summary` - Generate health PDF
- `GET /api/reports/journal/:dateRange` - Journal PDF

**Libraries:**

- PDFKit or Puppeteer

---

### 2.11 Notification System

**Priority: MEDIUM**

**Features:**

- Push notifications (FCM/APNS)
- Email notifications
- In-app notifications
- Notification preferences

---

## 🎯 Phase 3: Admin Dashboard Backend

### 3.1 Admin Authentication

**Priority: HIGH**

**Endpoints:**

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`

**Features:**

- Role-based access (Super Admin, Staff)
- Separate JWT for admin
- Admin-specific middleware

---

### 3.2 User Management

**Priority: HIGH**

**Endpoints:**

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - User details
- `PUT /api/admin/users/:id/block` - Block user
- `DELETE /api/admin/users/:id` - Remove user
- `PUT /api/admin/users/:id/role` - Assign role

---

### 3.3 Analytics & Metrics

**Priority: HIGH**

**Endpoints:**

- `GET /api/admin/analytics/overview` - Dashboard stats
- `GET /api/admin/analytics/users` - User metrics
- `GET /api/admin/analytics/revenue` - Financial data
- `GET /api/admin/analytics/engagement` - App usage
- `GET /api/admin/analytics/demographics` - Map data

**Metrics:**

- New users (daily/weekly/monthly)
- Active users
- Subscription conversions
- Revenue tracking
- Feature usage
- Geographic distribution

---

### 3.4 Team Management

**Priority: LOW**

**Endpoints:**

- `POST /api/admin/team` - Add team member
- `GET /api/admin/team` - List team
- `PUT /api/admin/team/:id` - Update permissions
- `DELETE /api/admin/team/:id` - Remove member

---

### 3.5 Export & Reports

**Priority: MEDIUM**

**Endpoints:**

- `GET /api/admin/export/users` - Export users CSV
- `GET /api/admin/export/analytics` - Export analytics CSV
- `GET /api/admin/export/health-data` - Export health insights

---

## 📋 Implementation Timeline

### Week 1-2: Database & Core Features

- [ ] Update Prisma schema with all models
- [ ] Run migrations
- [ ] Health metrics CRUD
- [ ] Journal system
- [ ] AI service foundation

### Week 3-4: AI & OCR Integration

- [ ] OpenAI integration
- [ ] Google Vision OCR
- [ ] AI chat assistant
- [ ] Report analysis

### Week 5-6: Wearables & Subscriptions

- [ ] Apple HealthKit integration
- [ ] Google Fit integration
- [ ] Stripe payment setup
- [ ] Subscription logic

### Week 7-8: Admin Dashboard

- [ ] Admin authentication
- [ ] User management
- [ ] Analytics endpoints
- [ ] Export functionality

### Week 9-10: Testing & Polish

- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation
- [ ] Performance optimization

---

## 🔐 Security Considerations

- HIPAA-style data encryption
- Anonymous usage tracking
- Data opt-out options
- HTTPS only
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection

---

## 📚 Documentation To Create

1. API Documentation (Swagger/Postman)
2. Database Schema Diagram
3. AI Integration Guide
4. Wearable Sync Guide
5. Admin Dashboard API Reference
6. Deployment Guide

---

## Next Immediate Steps

1. ✅ Review & approve this roadmap
2. 🔄 Design complete Prisma schema
3. 🔄 Implement Health Metrics API
4. 🔄 Set up AI service
5. 🔄 Integrate OpenAI

**Ready to proceed with the next phase?** 🚀
