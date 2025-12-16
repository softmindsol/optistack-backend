# AI Chat API Documentation

Base URL: `http://localhost:3000/api/ai`

## 1. Chat with Health Assistant

Sends a message to the AI Health Assistant. The backend injects the user's profile and supplement stack into the context before sending it to Google's Gemini API.

- **Endpoint**: `/chat`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

### Request Body

| Field          | Type           | Required | Description                                                               |
| :------------- | :------------- | :------- | :------------------------------------------------------------------------ |
| `message`      | String         | Yes      | The user's current question or message.                                   |
| `localHistory` | Array\<Object> | No       | List of previous messages in the conversation (stored locally on client). |

#### `localHistory` Object Structure

The `localHistory` array should follow the Google Gemini format:

```json
{
  "role": "user" | "model",
  "parts": [
    { "text": "Message content here" }
  ]
}
```

### Example Request

```json
{
  "message": "Is it safe to take Vitamin D with Fish Oil?",
  "localHistory": [
    {
      "role": "user",
      "parts": [{ "text": "Hi, I just started taking Magnesium." }]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "That's great! Magnesium is good for sleep. Do you have any specific questions?"
        }
      ]
    }
  ]
}
```

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "message": "Yes, taking Vitamin D with Fish Oil is actually beneficial because Vitamin D is fat-soluble and Fish Oil helps with absorption. Just make sure to stick to recommended dosages."
  }
}
```

### Error Responses

**401 Unauthorized**

```json
{
  "status": "fail",
  "message": "Please authenticate"
}
```

**500 Internal Server Error**

```json
{
  "status": "error",
  "message": "Failed to generate AI response. Please try again later."
}
```

---

## Configuration & Privacy

1. **AI Model**: Uses Google `gemini-1.5-flash` (Free Tier).
2. **Context Injection**: The backend automatically fetches and injects:
   - User Profile (Name, Age, Goals, Medical Conditions).
   - Current Supplement Stack.
3. **Data Privacy**: Chat messages are **NOT** stored in the backend database. The conversation history is managed client-side and passed via `localHistory`.
