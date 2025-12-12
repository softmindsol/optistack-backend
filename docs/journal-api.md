# Journal & Mood API Documentation

Base URL: `http://localhost:3000/api/journal`

## 1. Create Journal Entry

Creates a new text-based journal entry.

- **Endpoint**: `/entries`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field       | Type   | Required | Description                 |
| :---------- | :----- | :------- | :-------------------------- |
| `title`     | String | Yes      | Title of the entry          |
| `dailyNote` | String | Yes      | Main content of the journal |
| `date`      | String | No       | ISO Date (Default: today)   |

#### Example Request

```json
{
  "title": "Reflecting on the week",
  "dailyNote": "Today was a productive day. I felt energetic...",
  "date": "2025-12-12"
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "userId": 1,
  "title": "Reflecting on the week",
  "dailyNote": "Today was a productive day. I felt energetic...",
  "date": "2025-12-12T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 2. Get Journal Entries

Retrieves all journal entries for the current user, ordered by date (descending).

- **Endpoint**: `/entries`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Response (200 OK)

```json
[
  {
    "id": 1,
    "title": "Reflecting on the week",
    "date": "2025-12-12T00:00:00.000Z",
    ...
  }
]
```

---

## 3. Create Mood Log

Logs the user's mood and energy level.

- **Endpoint**: `/moods`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field         | Type   | Required | Description                |
| :------------ | :----- | :------- | :------------------------- |
| `todayMode`   | String | Yes      | e.g., "Happy", "Stressed"  |
| `energyLevel` | Int    | Yes      | Rating 1-5 (1=Low, 5=High) |
| `dailyNote`   | String | No       | Optional note about mood   |
| `date`        | String | No       | ISO Date (Default: today)  |

#### Example Request

```json
{
  "todayMode": "Energetic",
  "energyLevel": 4,
  "dailyNote": "Had a good workout session."
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "userId": 1,
  "todayMode": "Energetic",
  "energyLevel": 4,
  "dailyNote": "Had a good workout session.",
  "date": "2025-12-12T00:00:00.000Z",
  ...
}
```

---

## 4. Get Mood Logs

Retrieves all mood logs for the current user.

- **Endpoint**: `/moods`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)

### Response (200 OK)

```json
[
  {
    "id": 1,
    "todayMode": "Energetic",
    "energyLevel": 4,
    "date": "2025-12-12T00:00:00.000Z",
    ...
  }
]
```
