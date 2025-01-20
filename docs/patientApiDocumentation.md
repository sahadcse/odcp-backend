# Patient API Documentation

## Authentication

### Register a new patient
- **URL:** `/api/users/patient/register`
- **Method:** `POST`
- **Access:** Public
- **Body:**
  ```json
  {
    "full_name": "string",
    "email": "string",
    "password": "string",
    "phone_number": "string",
    "date_of_birth": "string",
    "gender": "string",
    "blood_group": "string",
    "height": "number",
    "weight": "number",
    "emergency_contact": "string",
    "terms_accepted": "boolean",
    "consent_form_signed": "boolean"
  }
  ```
  Example:
  ```json
  {
    "full_name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "password": "securePassword123",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-05-15",
    "gender": "Female",
    "blood_group": "O+",
    "height": {
      "feet": 5,
      "inches": 9
    },
    "weight": {
      "value": 60,
      "unit": "kg"
    },
    "emergency_contact": {
      "name": "Robert Johnson",
      "phone_number": "+0987654321",
      "relationship": "Brother"
    },
    "terms_accepted": true,
    "consent_form_signed": true
  }
  ```

### Login a patient
- **URL:** `/api/users/patient/login`
- **Method:** `POST`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## Profile Management

### Get patient profile
- **URL:** `/api/users/patient/profile`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Update patient profile
- **URL:** `/api/users/patient/update`
- **Method:** `PUT`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Body:**
  ```json
  {
    "profile_picture": "file",
    // other fields to update
  }
  ```

### Delete patient profile
- **URL:** `/api/users/patient/delete`
- **Method:** `DELETE`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Body:**
  ```json
  {
    "reason": "string"
  }
  ```

## Appointments

### Book an appointment
- **URL:** `/api/users/patient/appointments`
- **Method:** `POST`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Body:**
  ```json
  {
    // appointment details
  }
  ```

### View all appointments for the patient
- **URL:** `/api/users/patient/appointments`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Get details of a specific appointment
- **URL:** `/api/users/patient/appointments/:appointmentId`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Cancel an appointment
- **URL:** `/api/users/patient/appointments/:appointmentId/cancel`
- **Method:** `PUT`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Reschedule an appointment
- **URL:** `/api/users/patient/appointments/:id/reschedule`
- **Method:** `PATCH`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

## Consultations

### View consultation history
- **URL:** `/api/users/patient/consultations`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### View details of a specific consultation
- **URL:** `/api/users/patient/consultations/:id`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

### Upload medical reports for a consultation
- **URL:** `/api/users/patient/consultations/:id/files`
- **Method:** `POST`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Body:**
  ```json
  {
    "medical_reports": "file"
  }
  ```

### Download prescription
- **URL:** `/api/users/patient/consultations/:id/prescription`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

## Notifications

### Get notifications for the patient
- **URL:** `/api/users/patient/notifications`
- **Method:** `GET`
- **Access:** Private
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
