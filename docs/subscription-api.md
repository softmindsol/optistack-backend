# Subscription API Documentation

Base URL: `http://localhost:3000/api/subscription`

Manage user subscriptions and payments (powered by Stripe).

## 1. Get Current Subscription

Retrieves the user's current subscription plan, status, and recent transactions.

- **Endpoint**: `/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "subscriptionPlan": "FREE",
    "subscriptionStatus": "ACTIVE",
    "subscriptionExpiry": null,
    "transactions": []
  }
}
```

#### Response (Pro User)

```json
{
  "status": "success",
  "data": {
    "subscriptionPlan": "PRO",
    "subscriptionStatus": "ACTIVE",
    "subscriptionExpiry": "2024-01-15T14:30:00.000Z",
    "transactions": [
      {
        "id": 1,
        "amount": 25,
        "currency": "USD",
        "type": "SUBSCRIPTION_PAYMENT",
        "status": "COMPLETED",
        "transactionDate": "2023-12-15T14:30:00.000Z",
        "description": "Pro Plan - Monthly (Stripe ID: pi_123...)"
      }
    ]
  }
}
```

---

## 2. Upgrade to PRO Plan (Recurring)

Create a recurring monthly subscription ($25/month).

- **Endpoint**: `/upgrade`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field             | Type   | Required | Description                                    |
| :---------------- | :----- | :------- | :--------------------------------------------- |
| `paymentMethodId` | String | Yes      | Stripe Payment Method ID (e.g., `pm_12345...`) |

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "subscriptionId": "sub_1Q...",
    "status": "incomplete", // or 'active'
    "clientSecret": "pi_3N...",
    "message": "Subscription created. Waiting for payment confirmation."
  }
}
```

> **Note**: If `status` is `incomplete`, use the `clientSecret` on the frontend with `stripe.confirmCardPayment` to complete 3D Secure authentication.

### Error Responses

**400 Bad Request** _(Card Error)_

```json
{
  "status": "error",
  "message": "Card Error: Your card was declined."
}
```

---

## 3. Cancel Subscription

Cancels the auto-renewal. The user retains access until the end of the current billing period.

- **Endpoint**: `/cancel`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

_None required._

### Response (200 OK)

```json
{
  "status": "success",
  "message": "Subscription cancelled successfully",
  "data": {
    "message": "Subscription will be cancelled at the end of the billing period.",
    "cancelAt": "2024-02-15T10:00:00.000Z"
  }
}
```

**400 Bad Request** _(No Active Subscription)_

```json
{
  "status": "error",
  "message": "No active subscription found to cancel."
}
```
