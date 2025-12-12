# Daily Check-In API Documentation

Base URL: `http://localhost:3000/api/daily-check-in`

## 1. Create Daily Check-In

Records a new daily check-in with wellness stats.

- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field                | Type    | Required | Description                                                                   |
| :------------------- | :------ | :------- | :---------------------------------------------------------------------------- |
| `todaysFeeling`      | String  | Yes      | Enum: `GREAT`, `GOOD`, `OKAY`, `LOW`, `ANGRY`                                 |
| `didTakeAnythingNew` | Boolean | Yes      | Whether user took any new supplements                                         |
| `anySideEffect`      | String  | Yes      | Enum: `NAUSEA`, `ANXIETY`, `FATIGUE`, `HEADACHE`, `JITTERS`, `NO_SIDE_EFFECT` |
| `sleepLastNight`     | Int     | Yes      | Hours of sleep (1-24)                                                         |
| `sleepQuality`       | Int     | Yes      | Rating 1-5                                                                    |
| `energyLevel`        | Int     | Yes      | Rating 1-10                                                                   |
| `focus`              | Int     | Yes      | Rating 1-10                                                                   |
| `wellnessImpact`     | String  | Yes      | Qualitative feedback                                                          |

#### Example Request

```json
{
  "todaysFeeling": "GOOD",
  "didTakeAnythingNew": true,
  "anySideEffect": "NO_SIDE_EFFECT",
  "sleepLastNight": 8,
  "sleepQuality": 4,
  "energyLevel": 7,
  "focus": 8,
  "wellnessImpact": "Feeling energetic and focused today."
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "todaysFeeling": "GOOD",
  "didTakeAnythingNew": true,
  "anySideEffect": "NO_SIDE_EFFECT",
  "sleepLastNight": 8,
  "sleepQuality": 4,
  "energyLevel": 7,
  "focus": 8,
  "wellnessImpact": "Feeling energetic and focused today.",
  "userId": 1,
  "createdAt": "2025-12-12T10:00:00.000Z",
  "updatedAt": "2025-12-12T10:00:00.000Z"
}
```
