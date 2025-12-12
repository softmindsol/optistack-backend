# Opti-Stack Backend API Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

Most endpoints require a Bearer Token.
Header: `Authorization: Bearer <your_token>`

---

## 1. Authentication

### Register

**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "phone": "+1234567890",
  "dob": "1990-01-01",
  "age": 30,
  "gender": "Male",
  "height": 175,
  "weight": 70
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

_Returns user object and authentication token._

### Password Management

- **Send OTP**: `POST /auth/otp/send` (`{ "email": "..." }`)
- **Verify OTP**: `POST /auth/otp/verify` (`{ "email": "...", "otp": "..." }`)
- **Forgot Password**: `POST /auth/forgot-password` (`{ "email": "..." }`)
- **Reset Password**: `POST /auth/reset-password` (`{ "email": "...", "otp": "...", "newPassword": "..." }`)

---

## 2. Daily Check-In

**POST** `/daily-check-in`
_Requires Auth_

Record your daily wellness stats.

**Body:**

```json
{
  "todaysFeeling": "GOOD",
  "didTakeAnythingNew": true,
  "anySideEffect": "NO_SIDE_EFFECT",
  "sleepLastNight": 8,
  "sleepQuality": 4,
  "energyLevel": 7,
  "focus": 8,
  "wellnessImpact": "Feeling energetic"
}
```

**Enums Reference:**

- **todaysFeeling**: `GREAT`, `GOOD`, `OKAY`, `LOW`, `ANGRY`
- **anySideEffect**: `NAUSEA`, `ANXIETY`, `FATIGUE`, `HEADACHE`, `JITTERS`, `NO_SIDE_EFFECT`
- **Range Fields**: `sleepQuality` (1-5), `energyLevel` (1-10), `focus` (1-10)

---

## 3. Products

Manage the global catalog of supplements/products.

### Create Product

**POST** `/products`
_Requires Auth_

```json
{
  "name": "Extra Strength Ashwagandha",
  "category": "Eskstrakty",
  "rating": 9.5,
  "ratingLabel": "Excellent",
  "servings": 90,
  "pricePerServing": 0.44,
  "totalPrice": 39,
  "format": "Tablets",
  "currency": "$"
}
```

### Get All Products

**GET** `/products`
_Public_

### Delete Product

**DELETE** `/products/:id`
_Requires Auth_

---

## 4. User Stack (Schedule)

Manage the user's personal stack of products with their schedules.

### Add to Stack

**POST** `/stack`
_Requires Auth_

Add a product from the catalog to your personal stack.

```json
{
  "productId": 1,
  "healthGoal": "Stress & Mood",
  "isDaily": true,
  "withFood": false,
  "morningDose": 2,
  "midDayDose": 0,
  "eveningDose": 0,
  "nightDose": 1,
  "aiSuggestion": "Take with water"
}
```

### Get My Stack

**GET** `/stack`
_Requires Auth_

Returns all products in your stack with their configured schedules.

### Update Stack Item

**PATCH** `/stack/:id`
_Requires Auth_

Update schedule or doses.

```json
{
  "morningDose": 1,
  "nightDose": 0
}
```

### Remove from Stack

**DELETE** `/stack/:id`
_Requires Auth_

---

## 5. Stack History (Logging)

Track adherence to your stack schedule.

### Log Single Item

**POST** `/stack-log/log`
_Requires Auth_

Mark a specific stack item as taken for a specific time slot.

```json
{
  "stackItemId": 5,
  "timeSlot": "MORNING",
  "date": "2025-12-12",
  "status": "COMPLETED"
}
```

### Mark All Completed (Quick Action)

**POST** `/stack-log/log-all`
_Requires Auth_

Note: Automatically logs "COMPLETED" for _all_ stack items that have a dose scheduled for the given time slot.

```json
{
  "timeSlot": "MORNING",
  "date": "2025-12-12"
}
```

### Get Logs

**GET** `/stack-log/logs?date=2025-12-12`
_Requires Auth_

Get history/status for a specific date.

**Enums Reference:**

- **timeSlot**: `MORNING`, `MID_DAY`, `EVENING`, `NIGHT`
- **status**: `COMPLETED`, `SKIPPED`
