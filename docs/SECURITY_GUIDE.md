# Data Security & Privacy Implementation Guide

## 🔒 Security Objectives

**CRITICAL REQUIREMENT**: Each user must ONLY see their own data. No cross-user data leakage.

---

## ✅ Current Security Measures (Already Implemented)

### 1. Authentication Middleware

**File**: `src/middlewares/auth.js`

This middleware ensures:

- User must be logged in to access protected routes
- JWT token is verified
- User information is attached to `req.user`

```javascript
// Already implemented - verifies JWT and attaches user
const auth = catchAsync(async (req, res, next) => {
  // Extracts JWT from header
  // Verifies token
  // Finds user in database
  // Attaches to req.user
  req.user = currentUser; // This contains authenticated user's data
  next();
});
```

---

## 🛡️ Data Isolation Strategy

### Rule #1: Always Filter by User ID

**EVERY database query MUST filter by the authenticated user's ID.**

### ❌ WRONG (Security Breach):

```javascript
// BAD - Returns ALL users' health data
const healthData = await prisma.healthMetric.findMany();
```

### ✅ CORRECT (Secure):

```javascript
// GOOD - Only returns logged-in user's data
const healthData = await prisma.healthMetric.findMany({
  where: { userId: req.user.id }, // ← Always filter by authenticated user
});
```

---

## 📋 Security Implementation Checklist

### For Every API Endpoint:

1. ✅ **Use `auth` middleware** to protect the route
2. ✅ **Filter queries by `req.user.id`**
3. ✅ **Verify ownership before update/delete**
4. ✅ **Never trust client-sent user IDs**
5. ✅ **Validate all inputs**

---

## 🔐 Secure Middleware Pattern

### Ownership Verification Middleware

Create this middleware to ensure users can only access their own resources:

**File**: `src/middlewares/verifyOwnership.js`

```javascript
import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/ApiError.js";

const prisma = new PrismaClient();

/**
 * Verifies that the resource belongs to the authenticated user
 * @param {string} model - Prisma model name (e.g., 'healthMetric', 'journal')
 * @param {string} paramName - URL parameter name (default: 'id')
 */
const verifyOwnership = (model, paramName = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = parseInt(req.params[paramName]);
      const userId = req.user.id;

      // Check if resource exists and belongs to user
      const resource = await prisma[model].findFirst({
        where: {
          id: resourceId,
          userId: userId, // ← Critical: ensure it belongs to user
        },
      });

      if (!resource) {
        throw new ApiError(404, "Resource not found or access denied");
      }

      // Attach resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyOwnership;
```

---

## 📝 Secure API Examples

### Example 1: Health Metrics API (Secure)

**Route**: `src/routes/health.routes.js`

```javascript
import express from "express";
import auth from "../middlewares/auth.js";
import verifyOwnership from "../middlewares/verifyOwnership.js";
import healthController from "../controllers/health.controller.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all MY health metrics (auto-filtered by user)
router.get("/", healthController.getMyMetrics);

// Create MY health metric
router.post("/", healthController.createMetric);

// Get/Update/Delete specific metric (with ownership verification)
router.get("/:id", verifyOwnership("healthMetric"), healthController.getMetric);
router.put(
  "/:id",
  verifyOwnership("healthMetric"),
  healthController.updateMetric
);
router.delete(
  "/:id",
  verifyOwnership("healthMetric"),
  healthController.deleteMetric
);

export default router;
```

**Controller**: `src/controllers/health.controller.js`

```javascript
import healthService from "../services/health.service.js";
import catchAsync from "../utils/catchAsync.js";

const getMyMetrics = catchAsync(async (req, res) => {
  // Service MUST filter by req.user.id
  const metrics = await healthService.getMetrics(req.user.id);

  res.status(200).json({
    status: "success",
    data: { metrics },
  });
});

const createMetric = catchAsync(async (req, res) => {
  // Force userId from authenticated user, ignore client data
  const metricData = {
    ...req.body,
    userId: req.user.id, // ← Always use authenticated user's ID
  };

  const metric = await healthService.createMetric(metricData);

  res.status(201).json({
    status: "success",
    data: { metric },
  });
});

const updateMetric = catchAsync(async (req, res) => {
  // req.resource already verified by verifyOwnership middleware
  const metric = await healthService.updateMetric(
    req.resource.id,
    req.user.id, // ← Still pass for double verification
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { metric },
  });
});

const deleteMetric = catchAsync(async (req, res) => {
  await healthService.deleteMetric(req.resource.id, req.user.id);

  res.status(204).send();
});

export default {
  getMyMetrics,
  createMetric,
  updateMetric,
  deleteMetric,
};
```

**Service**: `src/services/health.service.js`

```javascript
import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/ApiError.js";

const prisma = new PrismaClient();

const getMetrics = async (userId, filters = {}) => {
  // ALWAYS filter by userId
  const metrics = await prisma.healthMetric.findMany({
    where: {
      userId: userId, // ← Critical security filter
      ...filters,
    },
    orderBy: { recordedAt: "desc" },
  });

  return metrics;
};

const createMetric = async (metricData) => {
  // userId already included in metricData from controller
  const metric = await prisma.healthMetric.create({
    data: metricData,
  });

  return metric;
};

const updateMetric = async (metricId, userId, updateData) => {
  // Double verification: check ownership again
  const metric = await prisma.healthMetric.findFirst({
    where: { id: metricId, userId: userId },
  });

  if (!metric) {
    throw new ApiError(404, "Metric not found or access denied");
  }

  const updated = await prisma.healthMetric.update({
    where: { id: metricId },
    data: updateData,
  });

  return updated;
};

const deleteMetric = async (metricId, userId) => {
  // Verify ownership before delete
  const metric = await prisma.healthMetric.findFirst({
    where: { id: metricId, userId: userId },
  });

  if (!metric) {
    throw new ApiError(404, "Metric not found or access denied");
  }

  await prisma.healthMetric.delete({
    where: { id: metricId },
  });
};

export default {
  getMetrics,
  createMetric,
  updateMetric,
  deleteMetric,
};
```

---

## 🚨 Common Security Mistakes to AVOID

### ❌ MISTAKE 1: Trusting Client-Sent User IDs

```javascript
// NEVER DO THIS - Client can send any userId!
const data = await prisma.journal.create({
  data: {
    userId: req.body.userId, // ❌ DANGEROUS!
    content: req.body.content,
  },
});
```

### ✅ CORRECT:

```javascript
// Always use authenticated user's ID
const data = await prisma.journal.create({
  data: {
    userId: req.user.id, // ✅ SAFE - from JWT
    content: req.body.content,
  },
});
```

---

### ❌ MISTAKE 2: No Ownership Verification

```javascript
// NEVER DO THIS - Anyone can delete any resource!
router.delete("/:id", async (req, res) => {
  await prisma.healthMetric.delete({
    where: { id: parseInt(req.params.id) }, // ❌ NO USER CHECK!
  });
});
```

### ✅ CORRECT:

```javascript
// Verify ownership first
router.delete(
  "/:id",
  auth,
  verifyOwnership("healthMetric"),
  async (req, res) => {
    await prisma.healthMetric.delete({
      where: { id: req.resource.id }, // ✅ Already verified
    });
  }
);
```

---

### ❌ MISTAKE 3: Exposing All Users' Data

```javascript
// DANGEROUS - Returns everyone's data
const allJournals = await prisma.journal.findMany(); // ❌
```

### ✅ CORRECT:

```javascript
// Only user's own data
const myJournals = await prisma.journal.findMany({
  where: { userId: req.user.id }, // ✅
});
```

---

## 🔍 Database-Level Security (Prisma)

### Use Prisma Middleware for Global Filtering

**File**: `src/config/prisma.js`

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Global middleware to log queries (for debugging)
prisma.$use(async (params, next) => {
  // Log all queries in development
  if (process.env.NODE_ENV === "development") {
    console.log("Query:", params.model, params.action);
  }

  return next(params);
});

export default prisma;
```

---

## 🛡️ Additional Security Measures

### 1. Rate Limiting

Prevent abuse by limiting requests per user.

```javascript
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});

app.use("/api/", apiLimiter);
```

### 2. Input Sanitization

Already using Zod for validation - ALWAYS validate inputs!

### 3. SQL Injection Prevention

Prisma automatically prevents SQL injection - NEVER use raw SQL.

### 4. Password Security

Already implemented with bcrypt - NEVER store plain passwords.

---

## 📊 Security Testing Checklist

Before deploying ANY endpoint:

- [ ] Is `auth` middleware applied?
- [ ] Does query filter by `req.user.id`?
- [ ] Is ownership verified for updates/deletes?
- [ ] Are inputs validated with Zod?
- [ ] Are error messages generic (not revealing data)?
- [ ] Is rate limiting in place?
- [ ] Are passwords hashed?
- [ ] Is HTTPS enforced in production?

---

## 🎯 Summary

### Golden Rules:

1. **ALWAYS use `auth` middleware** on protected routes
2. **ALWAYS filter by `req.user.id`** in database queries
3. **NEVER trust client-sent user IDs**
4. **ALWAYS verify ownership** before update/delete
5. **ALWAYS validate inputs** with Zod
6. **Use `verifyOwnership` middleware** for single-resource access

### Architecture Pattern:

```
Request → auth middleware → verifyOwnership → controller → service → database
          (verify JWT)      (verify resource)  (handle)    (filter)   (execute)
                                                            by userId
```

---

**Next Steps:**

1. Create `verifyOwnership` middleware
2. Apply this pattern to all future APIs
3. Test with multiple users to ensure data isolation

**Your data is now SECURE!** 🔒✅
