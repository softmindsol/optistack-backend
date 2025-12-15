# Stack Log API Documentation

Base URL: `http://localhost:3000/api/stack-log`

## 1. Log Stack Item

Marks a specific stack item as COMPLETED or SKIPPED for a specific time slot.

- **Endpoint**: `/log`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field         | Type   | Required | Description                                         |
| :------------ | :----- | :------- | :-------------------------------------------------- |
| `stackItemId` | Int    | Yes      | ID of the stack item                                |
| `timeSlot`    | String | Yes      | Enum: `MORNING`, `MID_DAY`, `EVENING`, `NIGHT`      |
| `date`        | String | No       | YYYY-MM-DD (Default: today)                         |
| `status`      | String | No       | Enum: `COMPLETED`, `SKIPPED` (Default: `COMPLETED`) |

#### Example Request 

```json
{
  "stackItemId": 1,
  "timeSlot": "MORNING",
  "date": "2025-12-12",
  "status": "COMPLETED"
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "stackItemId": 1,
  "userId": 1,
  "date": "2025-12-12T00:00:00.000Z",
  "timeSlot": "MORNING",
  "status": "COMPLETED",
  ...
}
```

---

## 2. Mark All Completed

Automatically logs "COMPLETED" for all stack items that have a scheduled dose (>0) for the given time slot.

- **Endpoint**: `/log-all`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field      | Type   | Required | Description                                    |
| :--------- | :----- | :------- | :--------------------------------------------- |
| `timeSlot` | String | Yes      | Enum: `MORNING`, `MID_DAY`, `EVENING`, `NIGHT` |
| `date`     | String | No       | YYYY-MM-DD (Default: today)                    |

#### Example Request

```json
{
  "timeSlot": "MORNING",
  "date": "2025-12-12"
}
```

### Response (200 OK)

_Returns an array of created/updated log objects._

```json
[
  {
    "id": 1,
    "stackItemId": 1,
    "status": "COMPLETED",
    ...
  },
  {
    "id": 2,
    "stackItemId": 3,
    "status": "COMPLETED",
    ...
  }
]
```

---

## 3. Get Logs

Retrieves log history for a specific date.

- **Endpoint**: `/logs`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Query Parameters

| Field  | Type   | Required | Description                 |
| :----- | :----- | :------- | :-------------------------- |
| `date` | String | No       | YYYY-MM-DD (Default: today) |

#### Example Request

`GET /logs?date=2025-12-12`

### Response (200 OK)

```json
[
  {
    "id": 1,
    "stackItemId": 1,
    "timeSlot": "MORNING",
    "status": "COMPLETED",
    ...
  }
]
```
