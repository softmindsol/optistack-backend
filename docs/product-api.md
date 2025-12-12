# Product API Documentation

Base URL: `http://localhost:3000/api/products`

## 1. Create Product

Adds a new product to the global catalog.

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
| `currency`        | String | No       | Currency symbol (Default: `$`) |
| `format`          | String | No       | e.g. "Tablets", "Capsules"     |

#### Example Request

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
