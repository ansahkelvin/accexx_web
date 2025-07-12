# API Migration Summary

This document summarizes all the changes made to migrate the frontend from the old API structure to the new API structure as defined in the API documentation.

## Base URL Changes
- **Old**: `https://accexx247.com/backend/api`
- **New**: `https://accexx247.com/api`

## Authentication Changes

### Login
- **Old**: `POST /auth/login` (FormData)
- **New**: `POST /auth/user/login` or `POST /auth/doctor/login` (JSON)
- **Changes**:
  - Split into separate endpoints for users and doctors
  - Changed from FormData to JSON format
  - Response structure updated to match new API

### Registration
- **Old**: `POST /auth/patient/register` and `POST /auth/doctor/register` (FormData)
- **New**: `POST /auth/user/register` and `POST /auth/doctor/register` (JSON)
- **Changes**:
  - Patient registration endpoint changed to `/auth/user/register`
  - Changed from FormData to JSON format
  - Updated field names to match new API structure

### Token Validation
- **Old**: `POST /auth/validate-token` (GET with Authorization header)
- **New**: `POST /auth/validate-token` (POST with token in body)
- **Changes**:
  - Changed from GET to POST method
  - Token now sent in request body instead of Authorization header

### Token Refresh
- **Old**: `POST /auth/refresh-token`
- **New**: `POST /auth/refresh`
- **Changes**:
  - Endpoint name changed
  - Request body field changed from `refresh_token` to `refreshToken`

## User Management Changes

### Get User Profile
- **Old**: `GET /users/patient/details`
- **New**: `GET /users/profile`
- **Changes**:
  - Unified endpoint for all user types
  - Response structure updated

### Get Doctor Profile
- **Old**: `GET /users/doctor/details`
- **New**: `GET /doctors/profile`
- **Changes**:
  - Endpoint moved to doctors-specific path
  - Response structure updated

## Doctor Management Changes

### Get All Doctors
- **Old**: `GET /doctors/all`
- **New**: `GET /doctors/public/all`
- **Changes**:
  - Endpoint renamed to indicate public access
  - Response structure updated

### Get Top Doctors
- **Old**: `GET /doctors/top`
- **New**: `GET /doctors/public/all` (filtered client-side)
- **Changes**:
  - No dedicated endpoint, filtering done client-side
  - Response structure updated

### Get Nearby Doctors
- **Old**: `GET /doctors/nearby?latitude=...&longitude=...&radius=...`
- **New**: `GET /doctors/public/all` (distance calculated client-side)
- **Changes**:
  - No dedicated endpoint, distance calculation done client-side
  - Response structure updated

## Appointment Changes

### Get User Appointments
- **Old**: `GET /appointments/patient`
- **New**: `GET /appointments/user`
- **Changes**:
  - Endpoint renamed to be role-agnostic
  - Response structure updated

### Get Doctor Appointments
- **Old**: `GET /appointments/doctor`
- **New**: `GET /appointments/doctor`
- **Changes**:
  - Endpoint remains the same
  - Response structure updated

### Book Appointment
- **Old**: `POST /appointments/new`
- **New**: `POST /appointments/book`
- **Changes**:
  - Endpoint renamed
  - Request body structure simplified
  - Response structure updated

### Update Appointment Status
- **Old**: `PATCH /appointments/{id}/status?appointment_status=...&schedule_id=...`
- **New**: `PUT /appointments/{id}/confirm|cancel|complete`
- **Changes**:
  - Changed from PATCH to PUT method
  - Status now part of URL path instead of query parameter
  - Removed schedule_id parameter

## Schedule/Time Slot Changes

### Get Doctor Schedules
- **Old**: `GET /schedules/doctors/all`
- **New**: `GET /time-slots`
- **Changes**:
  - Endpoint renamed to reflect new terminology
  - Response structure updated

### Create Schedule
- **Old**: `POST /schedules/new`
- **New**: `POST /time-slots`
- **Changes**:
  - Endpoint renamed
  - Request body structure updated
  - Response structure updated

### Update Schedule
- **Old**: `PUT /schedules/{id}`
- **New**: `PUT /time-slots/{id}`
- **Changes**:
  - Endpoint renamed
  - Request body structure updated
  - Response structure updated

### Delete Schedule
- **Old**: `DELETE /schedules/{id}`
- **New**: `DELETE /time-slots/{id}`
- **Changes**:
  - Endpoint renamed
  - Response structure updated

## Chat Changes

### Get User Chats
- **Old**: `GET /chats`
- **New**: `GET /v1/chat/user/chats` or `GET /v1/chat/doctor/chats`
- **Changes**:
  - Split into role-specific endpoints
  - Added version prefix
  - Response structure updated

### Get Chat Messages
- **Old**: `GET /chats/{chatId}/messages`
- **New**: `GET /v1/chat/{chatId}/messages`
- **Changes**:
  - Added version prefix
  - Response structure updated

### Send Message
- **Old**: `POST /chats/{chatId}/messages`
- **New**: `POST /v1/chat/send`
- **Changes**:
  - Endpoint moved to global send endpoint
  - Request body structure updated
  - Added receiver information
  - Response structure updated

### Create Chat
- **Old**: `POST /chats`
- **New**: `POST /v1/chat/create`
- **Changes**:
  - Added version prefix
  - Request body structure updated
  - Response structure updated

## Medical Documents Changes

### Get Documents
- **Old**: `GET /documents`
- **New**: `GET /documents`
- **Changes**:
  - Endpoint remains the same
  - Response structure updated

### Upload Document
- **Old**: `POST /documents/upload`
- **New**: `POST /documents/upload`
- **Changes**:
  - Endpoint remains the same
  - Form field name changed from 'document' to 'file'
  - Response structure updated

## Reviews/Ratings Changes

### Create Review
- **Old**: `POST /ratings`
- **New**: `POST /reviews`
- **Changes**:
  - Endpoint renamed
  - Request body structure updated
  - Response structure updated

## WebSocket Changes

### WebSocket Endpoint
- **Old**: `ws://host/endpoint`
- **New**: `ws://host/ws/endpoint`
- **Changes**:
  - Added `/ws` prefix to all WebSocket connections
  - Protocol remains STOMP over WebSocket

## Dashboard Changes

### Get Patient Dashboard
- **Old**: `GET /dashboard/patients`
- **New**: `GET /appointments/user` (transformed client-side)
- **Changes**:
  - No dedicated dashboard endpoint
  - Dashboard data constructed from appointments
  - Response structure updated

### Get Doctor Dashboard
- **Old**: `GET /dashboard/doctors`
- **New**: `GET /appointments/doctor` (transformed client-side)
- **Changes**:
  - No dedicated dashboard endpoint
  - Dashboard data constructed from appointments
  - Response structure updated

## Key Transformations Made

1. **Response Structure Mapping**: All API responses are now transformed to match the existing frontend interfaces
2. **Role Mapping**: Backend roles (USER, DOCTOR, ADMIN) are mapped to frontend roles (patient, doctor)
3. **Field Name Mapping**: Backend field names are mapped to frontend field names
4. **Data Transformation**: Complex transformations are done client-side where dedicated endpoints don't exist
5. **Error Handling**: Updated error response handling to match new API structure

## Files Modified

1. `src/config/config.ts` - Updated BASE_URL
2. `src/actions/auth.ts` - Updated authentication endpoints
3. `src/app/actions/user.ts` - Updated user-related endpoints
4. `src/app/actions/doctor.ts` - Updated doctor-related endpoints
5. `src/service/doctors/doctor.ts` - Updated doctor service endpoints
6. `src/app/actions/chat.ts` - Updated chat endpoints
7. `src/app/actions/appointments.ts` - Updated appointment endpoints
8. `src/app/actions/medical.ts` - Updated medical document endpoints
9. `src/middleware.ts` - Updated token validation
10. `src/app/api/auth/refresh/route.ts` - Updated refresh token endpoint
11. `src/service/make_request.ts` - Updated refresh endpoint URL
12. `src/service/websocketFactory.ts` - Updated WebSocket endpoint

## Testing Recommendations

1. Test all authentication flows (login, register, logout)
2. Test appointment booking and management
3. Test chat functionality
4. Test document upload and retrieval
5. Test doctor and patient dashboards
6. Test WebSocket connections
7. Test error handling and token refresh
8. Test role-based access control

## Notes

- Some endpoints that didn't exist in the new API have been implemented using client-side transformations
- The migration maintains backward compatibility with existing frontend interfaces
- Error handling has been updated to match the new API response format
- All authentication flows have been updated to use the new token structure 