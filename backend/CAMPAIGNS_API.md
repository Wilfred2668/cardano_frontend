# Campaign API Documentation

## Overview
Campaign creation and management system with SQLite database storage.

## Database Setup
The SQLite database is automatically initialized when the application starts. Database file: `campaigns.db`

## API Endpoints

### Create Campaign
**POST** `/campaigns`

Creates a new campaign and submits it to the external job processing API.

**Authentication Required**: Bearer token (JWT)

**Request Body**:
```json
{
  "identifier_from_purchaser": "a1b2c3d4e5f6g7h8i9j0k1l2",
  "input_data": {
    "text": "Write a story about a robot learning to paint"
  }
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "campaign_id": "abc123...",
  "did": "did:prism:...",
  "identifier_from_purchaser": "a1b2c3d4e5f6g7h8i9j0k1l2",
  "input_text": "Write a story about a robot learning to paint",
  "status": "processing",
  "created_at": "2025-11-30T10:00:00",
  "updated_at": "2025-11-30T10:00:00"
}
```

### Get All Campaigns
**GET** `/campaigns`

Retrieves all campaigns for the authenticated user.

**Authentication Required**: Bearer token (JWT)

**Response**: `200 OK`
```json
{
  "campaigns": [...],
  "total": 5
}
```

### Get Campaign by ID
**GET** `/campaigns/{campaign_id}`

Retrieves a specific campaign by ID.

**Authentication Required**: Bearer token (JWT)

**Response**: `200 OK`
```json
{
  "id": 1,
  "campaign_id": "abc123...",
  "did": "did:prism:...",
  "identifier_from_purchaser": "a1b2c3d4e5f6g7h8i9j0k1l2",
  "input_text": "Write a story about a robot learning to paint",
  "status": "processing",
  "created_at": "2025-11-30T10:00:00",
  "updated_at": "2025-11-30T10:00:00"
}
```

## Field Descriptions

- **identifier_from_purchaser**: 24-character hexadecimal string identifying the purchaser
- **input_text**: Campaign description or prompt text
- **status**: Campaign status (`pending`, `processing`, `completed`, `failed`)
- **campaign_id**: Unique 32-character hex identifier for the campaign

## External Job API

Campaigns are automatically submitted to:
```
POST https://dac99f68ab3e.ngrok-free.app/start_job
```

## Running the Server

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

## Testing

You can test the API using the interactive docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
