# Accexx Backend API Documentation

This document provides a comprehensive reference for integrating with the Accexx healthcare appointment management backend. It covers all main REST and WebSocket endpoints, authentication, request/response structures, and example payloads.

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## User Roles
- **USER**: Patients
- **DOCTOR**: Healthcare providers
- **ADMIN**: System administrators

---

## REST API Endpoints

### 1. Authentication

#### Register User
- **POST** `/api/auth/user/register`
- **Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01"
}
```
- **Response:**
```
"User registered successfully with ID: <userId>"
```

#### Register Doctor
- **POST** `/api/auth/doctor/register`
- **Request:**
```json
{
  "fullName": "Dr. Smith",
  "email": "drsmith@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "address": "456 Clinic Rd",
  "dateOfBirth": "1980-05-10",
  "appointmentAddress": "456 Clinic Rd",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "bio": "Experienced cardiologist.",
  "specialization": "Cardiology",
  "gmcNumber": "GMC123456",
  "profileImage": "https://..."
}
```
- **Response:**
```
"Doctor registered successfully with ID: <doctorId>"
```

#### Login (User/Doctor)
- **POST** `/api/auth/user/login` or `/api/auth/doctor/login`
- **Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "token": "<jwt-token>",
  "refreshToken": "<refresh-token>",
  "type": "Bearer",
  "id": "userId",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "USER"
}
```

#### Validate Token
- **POST** `/api/auth/validate-token`
- **Request:**
```json
{
  "token": "<jwt-token>"
}
```
- **Response:**
```json
{
  "valid": true,
  "userId": "...",
  "role": "USER"
}
```

---

### 2. User Management

#### Get User Profile
- **GET** `/api/users/profile`
- **Response:**
```json
{
  "id": "...",
  "email": "...",
  "fullName": "...",
  "phoneNumber": "...",
  "isEmailVerified": true,
  "address": "...",
  "dateOfBirth": "1990-01-01"
}
```

#### Update User Profile
- **PUT** `/api/users/profile`
- **Request:**
```json
{
  "fullName": "...",
  "email": "...",
  "phoneNumber": "...",
  "address": "...",
  "dateOfBirth": "1990-01-01",
  "password": "..." // optional
}
```
- **Response:** Same as Get User Profile

#### Get All Users (Admin)
- **GET** `/api/users/all`
- **Response:** Array of user profiles

#### Get User by ID (Admin)
- **GET** `/api/users/{id}`
- **Response:** User profile

#### Delete User (Admin)
- **DELETE** `/api/users/{id}`
- **Response:**
```
"User deleted successfully"
```

---

### 3. Doctor Management

#### Get All Verified Doctors
- **GET** `/api/doctors/public/all`
- **Response:** Array of doctor profiles

#### Search Doctors
- **GET** `/api/doctors/public/search?keyword=cardio`
- **Response:** Array of doctor profiles

#### Get Doctors by Specialization
- **GET** `/api/doctors/public/specialization/{specialization}`
- **Response:** Array of doctor profiles

#### Get Doctor by ID
- **GET** `/api/doctors/{id}`
- **Response:** Doctor profile

#### Get Doctor Profile
- **GET** `/api/doctors/profile`
- **Response:** Doctor profile

#### Update Doctor Profile
- **PUT** `/api/doctors/profile`
- **Request:** Same as registration, fields optional
- **Response:** Doctor profile

#### Verify Doctor (Admin)
- **PUT** `/api/doctors/{id}/verify`
- **Response:**
```
"Doctor verified successfully"
```

---

### 4. Appointments

#### Book Appointment (User)
- **POST** `/api/appointments/book`
- **Request:**
```json
{
  "doctorId": "...",
  "timeSlotId": "...",
  "notes": "..."
}
```
- **Response:**
```json
{
  "id": "...",
  "user": { ... },
  "doctor": { ... },
  "timeSlot": { ... },
  "appointmentDateTime": "2025-07-12T09:00:00",
  "notes": "...",
  "status": "PENDING",
  "cancellationReason": null,
  "canCancel": true
}
```

#### Confirm/Cancel/Complete Appointment
- **PUT** `/api/appointments/{id}/confirm|cancel|complete`
- **Response:** Appointment object (see above)

#### Get User/Doctor Appointments
- **GET** `/api/appointments/user` (User)
- **GET** `/api/appointments/doctor` (Doctor)
- **Response:** Array of appointment summaries

#### Get Appointment by ID
- **GET** `/api/appointments/{id}`
- **Response:** Appointment object

---

### 5. Time Slots

#### Create Time Slot (Doctor)
- **POST** `/api/time-slots`
- **Request:**
```json
{
  "date": "2025-07-12",
  "startTime": "09:00",
  "durationMinutes": 30,
  "notes": "..."
}
```
- **Response:** Time slot object

#### Get Available Slots (Public)
- **GET** `/api/time-slots/doctor/{doctorId}/available?date=2025-07-12`
- **Response:** Array of time slot objects

#### Block Time Slot (Doctor)
- **PUT** `/api/time-slots/{slotId}/block`
- **Response:** Time slot object

---

### 6. Chat (REST)

#### Send Message
- **POST** `/api/v1/chat/send`
- **Request:**
```json
{
  "receiverId": "...",
  "receiverType": "USER" | "DOCTOR",
  "content": "Hello!",
  "messageType": "TEXT", // or "IMAGE"
  "attachmentUrl": "...", // optional
  "attachmentType": "image/png", // optional
  "attachmentSize": 12345 // optional
}
```
- **Response:** Message object

#### Get User/Doctor Chats
- **GET** `/api/v1/chat/user/chats` (User)
- **GET** `/api/v1/chat/doctor/chats` (Doctor)
- **Response:** Array of chat objects

---

### 7. Support Requests

#### Create Support Request
- **POST** `/api/support/request`
- **Request:**
```json
{
  "subject": "Need help with booking",
  "message": "I can't book an appointment.",
  "category": "Booking",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "userId": "..."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Support request submitted successfully",
  "data": { ... }
}
```

#### Get Support Requests (Admin)
- **GET** `/api/support/requests/status/{status}`
- **Response:** Array of support request objects

---

## WebSocket API

### WebSocket Endpoint
- **URL:** `ws://<host>/ws`
- **Protocol:** STOMP over WebSocket

### Main Channels
- **Send Message:** `/app/chat.send` (client → server)
  - **Payload:** Same as REST send message
- **Mark as Read:** `/app/chat.markRead` (client → server)
  - **Payload:** `"chatId"` (string)
- **Typing Indicator:** `/app/chat.typing` (client → server)
  - **Payload:** `{ "receiverId": "...", "isTyping": true }`
- **Stop Typing:** `/app/chat.typing.stop` (client → server)
  - **Payload:** `"receiverId"` (string)
- **Ping:** `/app/chat.ping` (client → server)
  - **Payload:** none

### Subscriptions
- **Private Messages:** `/user/queue/messages` (receive real-time messages)
- **Typing Indicator:** `/user/queue/typing`
- **Errors:** `/user/queue/errors`
- **Confirmations:** `/user/queue/confirmations` (delivery/read confirmations)
- **Pong:** `/user/queue/pong`

### Example WebSocket Message (Send)
```json
{
  "receiverId": "...",
  "receiverType": "DOCTOR",
  "content": "Hello doctor!",
  "messageType": "TEXT"
}
```

### Example WebSocket Message (Receive)
```json
{
  "id": "...",
  "chatId": "...",
  "senderId": "...",
  "senderType": "USER",
  "senderName": "John Doe",
  "senderProfileImage": "https://...",
  "content": "Hello doctor!",
  "messageType": "TEXT",
  "isRead": false,
  "isDelivered": true,
  "deliveredAt": "2025-07-12T09:00:00",
  "sentAt": "2025-07-12T09:00:00"
}
```

---

## Error Handling
- All error responses follow the structure:
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Notes
- All date/time fields are in ISO 8601 format (e.g., `2025-07-12T09:00:00`)
- All endpoints return JSON
- Some endpoints require specific roles (see above)
- For full entity/field details, see the DTOs in the codebase 