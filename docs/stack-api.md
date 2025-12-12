# Stack API Documentation

Base URL: `http://localhost:3000/api/stack`

## 1. Add to Stack

Adds a product to the user's personal stack with a schedule.

- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field          | Type    | Required | Description                                                          |
| :------------- | :------ | :------- | :------------------------------------------------------------------- |
| `productId`    | Int     | Optional | ID of an _existing_ product (Required if `product` not provided)     |
| `product`      | Object  | Optional | Full product details to create new (Required if `productId` missing) |
| `healthGoal`   | String  | No       | e.g. "Bone & Joint"                                                  |
| `isDaily`      | Boolean | No       | is daily schedule (Default: true)                                    |
| `withFood`     | Boolean | No       | Take with food (Default: false)                                      |
| `morningDose`  | Int     | No       | Quantity for morning (Default: 0)                                    |
| `midDayDose`   | Int     | No       | Quantity for mid-day (Default: 0)                                    |
| `eveningDose`  | Int     | No       | Quantity for evening (Default: 0)                                    |
| `nightDose`    | Int     | No       | Quantity for night (Default: 0)                                      |
| `aiSuggestion` | String  | No       | AI note for intake                                                   |

#### Example Request (With Existing Product)

```json
{
  "productId": 1,
  "healthGoal": "Stress & Mood",
  "isDaily": true,
  "withFood": false,
  "morningDose": 2,
  "nightDose": 1
}
```

#### Example Request (Creating New Product on the Fly)

```json
{
  "product": {
    "name": "My Custom Vitamin",
    "totalPrice": 15.0,
    "category": "General"
  },
  "healthGoal": "Immunity",
  "morningDose": 1
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "healthGoal": "Stress & Mood",
  "morningDose": 2,
  "nightDose": 1,
  "product": { ... }
}
```

---

## 2. Get My Stack

Retrieves all items in the user's stack.

- **Endpoint**: `/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Response (200 OK)

```json
[
  {
    "id": 1,
    "product": { "name": "Ashwagandha", ... },
    "healthGoal": "Stress & Mood",
    "morningDose": 2,
    ...
  }
]
```

---

## 3. Update Stack Item

Updates schedule, health goal, or doses for a stack item.

- **Endpoint**: `/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)

### Request Body

_Any of the fields from "Add to Stack" (except `productId`)._

#### Example Request

```json
{
  "morningDose": 1,
  "nightDose": 0
}
```

### Response (200 OK)

_Returns updated stack item._

---

## 4. Remove from Stack

Removes an item from the user's stack.

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)

### Response (204 No Content)

_No body returned on success._
