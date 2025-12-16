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
  "name": "Omega 3 Fish Oil",
  "category": "MyProtein",
  "image": "https://example.com/omega3.jpg",
  "rating": 9.5,
  "ratingLabel": "Excellent",
  "servings": 90,
  "pricePerServing": 0.44,
  "totalPrice": 39.99,
  "currency": "$",
  "format": "Softgels",

  "healthGoal": "Heart Health",
  "morningDose": 1,
  "midDayDose": 0,
  "eveningDose": 1,
  "nightDose": 0,
  "withFood": true,
  "isDaily": true
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
  "stackItemId": 10,
  "stackItem": {
     "id": 10,
     "userId": 1,
     "productId": 1,
     "isDaily": true,
     ...
  }
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

### Response (200 OK)

```json
{
  "message": "Product deleted successfully"
}
```
