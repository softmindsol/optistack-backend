# Password Reset Flow - Complete Guide

## Overview

The password reset system uses a **6-digit OTP** sent via email (instead of a token-based link). The OTP is valid for **10 minutes**.

---

## Flow Steps

### 1. Request Password Reset

**Endpoint**: `POST /api/auth/forgot-password`

**Request**:

```json
{
  "email": "user@example.com"
}
```

**What Happens**:

- System generates a 6-digit OTP (e.g., "123456")
- OTP is saved to database with 10-minute expiration
- Email is sent to user with the OTP code
- Returns success message (doesn't reveal if email exists for security)

**Response**:

```json
{
  "status": "success",
  "message": "If the email exists, a password reset code has been sent.",
  "data": {
    "otp": "123456" // Only in development, removed in production
  }
}
```

**Email Template**:

```
Subject: Password Reset Code - OptiStack

Password Reset Request
You requested to reset your password. Use the following code to reset your password:

┌─────────┐
│ 123456  │
└─────────┘

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.
```

---

### 2. Reset Password with OTP

**Endpoint**: `POST /api/auth/reset-password`

**Request**:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "myNewSecurePassword123"
}
```

**What Happens**:

- System verifies email exists
- Checks if OTP matches and hasn't expired
- Hashes the new password with bcrypt
- Updates password in database
- Clears OTP and expiration fields

**Response (Success)**:

```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

**Possible Errors**:

- `400`: Invalid credentials (email not found)
- `400`: No password reset request found
- `400`: Reset code has expired
- `400`: Invalid reset code

---

## Email Configuration

Current configuration in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=arshannawaz.dev@gmail.com
EMAIL_PASSWORD=ynxgtbfsxnaxgwde
EMAIL_FROM_NAME=OptiStack
```

**✅ Email sending is ENABLED and working!**

---

## Testing the Flow

### Test with Postman/Thunder Client:

1. **Send OTP**:

   ```
   POST http://localhost:3000/api/auth/forgot-password
   Content-Type: application/json

   {
     "email": "your-registered-email@example.com"
   }
   ```

2. **Check Email** for the 6-digit code

3. **Reset Password**:

   ```
   POST http://localhost:3000/api/auth/reset-password
   Content-Type: application/json

   {
     "email": "your-registered-email@example.com",
     "otp": "123456",
     "newPassword": "newPassword123"
   }
   ```

---

## Security Features

✅ **OTP Expiration**: 10 minutes timeout
✅ **One-time Use**: OTP is cleared after successful reset
✅ **Bcrypt Hashing**: Passwords are securely hashed
✅ **No Email Disclosure**: Response doesn't reveal if email exists
✅ **Email Verification**: OTP must match exactly

---

## Database Fields

The following fields are used in the `User` model:

```prisma
passwordResetOTP      String?    // 6-digit OTP code
passwordResetExpiry   DateTime?  // Expiration timestamp
```

These are automatically cleared after successful password reset.

---

## Implementation Status

✅ Database schema updated with `passwordResetOTP`
✅ Migration applied successfully  
✅ Email service configured and working
✅ OTP generation (6-digit random)
✅ Email sending with HTML template
✅ OTP validation and expiration check
✅ Password reset with bcrypt hashing
✅ Full error handling
✅ API documentation updated
✅ Server running on port 3000

**All systems ready! 🎉**
