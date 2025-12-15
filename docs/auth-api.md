# Authentication API Documentation

Base URL: `http://localhost:3000/api/auth`

## 1. Register User

Creates a new user account with optional onboarding profile data.

- **Endpoint**: `/register`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field                | Type          | Required | Description                                           |
| :------------------- | :------------ | :------- | :---------------------------------------------------- |
| `email`              | String        | Yes      | Valid email address                                   |
| `password`           | String        | Yes      | Min 6 characters                                      |
| `fullname`           | String        | Yes      | Full name of the user                                 |
| `phone`              | String        | No       | Contact number                                        |
| `dob`                | String        | No       | Date of birth (ISO Date String e.g. "1990-01-01")     |
| `age`                | Number        | No       | User's age                                            |
| `gender`             | String        | No       | e.g. "Male", "Female", "Other"                        |
| `height`             | Number        | No       | Height in cm                                          |
| `weight`             | Number        | No       | Weight in kg                                          |
| `averageSleep`       | Number        | No       | Sleep hours per night                                 |
| `dietType`           | String        | No       | e.g. "Vegan", "Keto"                                  |
| `activityLevel`      | String        | No       | e.g. "Sedentary", "Active"                            |
| `caffeineIntake`     | String        | No       | e.g. "None", "High"                                   |
| `habits`             | Array<Object> | No       | e.g. `[{ "type": "Nicotine", "frequency": "Daily" }]` |
| `medicalConditions`  | Array<String> | No       | List of conditions                                    |
| `currentSupplements` | Array<String> | No       | List of current supplements                           |

#### Example Request

```json
{
  "email": "jane.doe@example.com",
  "password": "securePassword123",
  "fullname": "Jane Doe",
  "dob": "1995-05-20",
  "gender": "Female",
  "height": 165,
  "weight": 60,
  "averageSleep": 7.5,
  "dietType": "Vegetarian",
  "activityLevel": "Moderate",
  "caffeineIntake": "Once a day",
  "medicalConditions": ["Seasonal Allergies"],
  "currentSupplements": ["Vitamin D", "Iron"]
}
```

### Response (201 Created)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "jane.doe@example.com",
      "fullname": "Jane Doe",
      "roleId": 2,
      "subscriptionPlan": "FREE",
      "subscriptionStatus": "ACTIVE",
      "createdAt": "2023-11-01T10:00:00.000Z",
      ...
    }
  }
}
```

---

## 2. Login

Authenticates a user and returns a JWT token.

- **Endpoint**: `/login`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field      | Type   | Required | Description      |
| :--------- | :----- | :------- | :--------------- |
| `email`    | String | Yes      | Registered email |
| `password` | String | Yes      | User password    |

#### Example Request

```json
{
  "email": "jane.doe@example.com",
  "password": "securePassword123"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "data": {
    "user": {
      "id": 1,
      "email": "jane.doe@example.com",
      "fullname": "Jane Doe"
    }
  }
}
```

---

## 3. Get Current User

Retrieves the profile of the currently logged-in user.

- **Endpoint**: `/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Headers

| Header          | Value            | Description             |
| :-------------- | :--------------- | :---------------------- |
| `Authorization` | `Bearer <token>` | JWT received from login |

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "jane.doe@example.com",
      "fullname": "Jane Doe",
      "role": {
        "id": 2,
        "name": "USER"
      },
      ...
    }
  }
}
```

---

## 4. Update Profile & Health Preferences

Updates user profile details and health preferences. Partial updates are allowed.

- **Endpoint**: `/profile`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)

### Request Body

_All fields are optional. Only valid fields will be updated._

| Field                | Type          | Description                                           |
| :------------------- | :------------ | :---------------------------------------------------- |
| `fullname`           | String        | Full name                                             |
| `email`              | String        | Valid email address                                   |
| `phone`              | String        | Contact number                                        |
| `dob`                | String        | Date of birth (ISO Date String)                       |
| `age`                | Number        | User's age                                            |
| `gender`             | String        | Gender                                                |
| `height`             | Number        | Height in cm                                          |
| `weight`             | Number        | Weight in kg                                          |
| `healthGoals`        | Array<String> | List of health goals                                  |
| `averageSleep`       | Number        | Sleep hours per night                                 |
| `dietType`           | String        | e.g. "Vegan", "Keto"                                  |
| `activityLevel`      | String        | e.g. "Sedentary", "Active"                            |
| `habits`             | Array<Object> | e.g. `[{ "type": "Nicotine", "frequency": "Daily" }]` |
| `medicalConditions`  | Array<String> | List of conditions                                    |
| `currentSupplements` | Array<String> | List of current supplements                           |

#### Example Request

```json
{
  "fullname": "Alex Sullivan Updated",
  "weight": 75,
  "healthGoals": ["Improve Sleep", "Muscle Gain"],
  "activityLevel": "Active"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "jane.doe@example.com",
      "fullname": "Alex Sullivan Updated",
      "weight": 75,
      "healthGoals": ["Improve Sleep", "Muscle Gain"],
      ...
    }
  }
}
```

---

## 5. Send Email Verification OTP

Sends a 6-digit OTP to the user's email for verification.

- **Endpoint**: `/send-otp`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field   | Type   | Required | Description              |
| :------ | :----- | :------- | :----------------------- |
| `email` | String | Yes      | Registered email address |

#### Example Request

```json
{
  "email": "jane.doe@example.com"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "message": "OTP sent to email",
  "data": {
    "otp": "123456"
  }
}
```

**Note**: OTP is valid for 10 minutes.

---

## 6. Verify Email OTP

Verifies the OTP sent to user's email.

- **Endpoint**: `/verify-otp`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field   | Type   | Required | Description      |
| :------ | :----- | :------- | :--------------- |
| `email` | String | Yes      | User's email     |
| `otp`   | String | Yes      | 6-digit OTP code |

#### Example Request

```json
{
  "email": "jane.doe@example.com",
  "otp": "123456"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

---

## 7. Forgot Password (Send OTP)

Initiates password reset process by sending a 6-digit OTP to the email.

- **Endpoint**: `/forgot-password`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field   | Type   | Required | Description             |
| :------ | :----- | :------- | :---------------------- |
| `email` | String | Yes      | User's registered email |

#### Example Request

```json
{
  "email": "jane.doe@example.com"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "message": "If the email exists, a password reset code has been sent.",
  "data": {
    "otp": "123456"
  }
}
```

**Note**: OTP is valid for 10 minutes.

---

## 8. Verify Password Reset OTP

Verifies that the OTP is valid before allowing password reset.

- **Endpoint**: `/verify-password-reset-otp`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field   | Type   | Required | Description                    |
| :------ | :----- | :------- | :----------------------------- |
| `email` | String | Yes      | User's email                   |
| `otp`   | String | Yes      | 6-digit OTP from previous step |

#### Example Request

```json
{
  "email": "jane.doe@example.com",
  "otp": "123456"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "message": "OTP verified successfully"
}
```

---

## 9. Reset Password

Resets user password using the OTP and new password.

- **Endpoint**: `/reset-password`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field         | Type   | Required | Description                |
| :------------ | :----- | :------- | :------------------------- |
| `email`       | String | Yes      | User's email               |
| `otp`         | String | Yes      | Valid OTP from email       |
| `newPassword` | String | Yes      | New password (min 6 chars) |

#### Example Request

```json
{
  "email": "jane.doe@example.com",
  "otp": "123456",
  "newPassword": "newSecurePass123"
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

---

## Email Configuration

To enable email sending for OTP and password reset:

1. Add to `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=OptiStack
FRONTEND_URL=http://localhost:3000
```

2. Uncomment email sending code in `auth.service.js`
