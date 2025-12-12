# Product API Documentation

Base URL: `http://localhost:3000/api/products`

## 1. Create Product

Adds a new product to the global catalog AND automatically adds it to the creating user's stack.

- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field             | Type   | Required | Description                    |
| :---------------- | :----- | :------- | :----------------------------- |
| `name`            | String | Yes      | Product name                   |
| `category`        | String | Yes      | Product category or brand      |
| `image`           | String | No       | URL to product image           |
| `rating`          | Float  | No       | Product rating (0-10)          |
| `ratingLabel`     | String | No       | e.g. "Excellent"               |
| `servings`        | Int    | No       | Number of servings             |
| `pricePerServing` | Float  | No       | Cost per serving               |
| `totalPrice`      | Float  | Yes      | Total price                    |
| `currency`        | String | No       | Currency (Default: `$`)        |
| `format`          | String | No       | e.g. "Tablets"                 |
| **Stack Fields**  |        |          | _Optional fields for Schedule_ |
| `healthGoal`      | String | No       | e.g. "Immunity"                |
| `morningDose`     | Int    | No       | Morning quantity               |
| `isDaily`         | Bool   | No       | Default: `true`                |

#### Example Request

```json
{
  "name": "My Custom Vits",
  "category": "General",
  "totalPrice": 20,
  "healthGoal": "Energy",
  "morningDose": 1
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "name": "Extra Strength Ashwagandha",
  "category": "Eskstrakty",
  "totalPrice": 39,
  "currency": "$",
  ...
}
```

---

## 2. Get All Products

Retrieves all products from the catalog.

- **Endpoint**: `/`
- **Method**: `GET`
- **Auth Required**: No (Public)

### Response (200 OK)

```json
[
  {
    "id": 1,
    "name": "Extra Strength Ashwagandha",
    ...
  },
  {
    "id": 2,
    "name": "Omega 3",
    ...
  }
]
```

---

## 3. Delete Product

Removes a product from the catalog.

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)

### Response (204 No Content)

_No body returned on success._
