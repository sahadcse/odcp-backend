# API Documentation

## Patient Routes

### Authentication

- **Register a new patient**
  - **URL:** `/api/users/patient/register`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Patient login**
  - **URL:** `/api/users/patient/login`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Profile Management

- **Get patient profile**
  - **URL:** `/api/users/patient/profile`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Update patient profile**
  - **URL:** `/api/users/patient/update`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "profile_picture": "file"
    }
    ```

- **Delete patient profile**
  - **URL:** `/api/users/patient/delete`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Appointments

- **Book an appointment**
  - **URL:** `/api/users/patient/appointments`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "doctorId": "string",
      "date": "string",
      "time": "string"
    }
    ```

- **View all appointments for the patient**
  - **URL:** `/api/users/patient/appointments`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get details of a specific appointment**
  - **URL:** `/api/users/patient/appointments/:appointmentId`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Cancel an appointment**
  - **URL:** `/api/users/patient/appointments/:appointmentId/cancel`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Reschedule an appointment**
  - **URL:** `/api/users/patient/appointments/:id/reschedule`
  - **Method:** `PATCH`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "date": "string",
      "time": "string"
    }
    ```

### Consultations

- **View consultation history**
  - **URL:** `/api/users/patient/consultations`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **View details of a specific consultation**
  - **URL:** `/api/users/patient/consultations/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Upload medical reports for a consultation**
  - **URL:** `/api/users/patient/consultations/:id/files`
  - **Method:** `POST`
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

- **Download prescription**
  - **URL:** `/api/users/patient/consultations/:id/prescription`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Notifications

- **Get notifications for the patient**
  - **URL:** `/api/users/patient/notifications`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

## Doctor Routes

### Authentication

- **Register a new doctor**
  - **URL:** `/api/users/doctor/register`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Doctor login**
  - **URL:** `/api/users/doctor/login`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Profile Management

- **Get doctor profile**
  - **URL:** `/api/users/doctor/profile/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Update doctor profile**
  - **URL:** `/api/users/doctor/update`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "profile_picture_url": "file",
      "documents": "file"
    }
    ```

- **Delete doctor profile**
  - **URL:** `/api/users/doctor/delete`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Appointments

- **View all appointments for the doctor**
  - **URL:** `/api/users/doctor/appointments`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get details of a specific appointment**
  - **URL:** `/api/users/doctor/appointments/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Confirm an appointment**
  - **URL:** `/api/users/doctor/appointments/:id/confirm`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Cancel an appointment**
  - **URL:** `/api/users/doctor/appointments/:id/cancel`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Consultations

- **View consultation history**
  - **URL:** `/api/users/doctor/consultations`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **View details of a specific consultation**
  - **URL:** `/api/users/doctor/consultations/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Start a consultation**
  - **URL:** `/api/users/doctor/consultations/:id/start`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Mark consultation as completed**
  - **URL:** `/api/users/doctor/consultations/:id/complete`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Upload a prescription**
  - **URL:** `/api/users/doctor/consultations/:id/prescription`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "prescription": "file"
    }
    ```

- **Cancel a consultation**
  - **URL:** `/api/users/doctor/consultations/:id/cancel`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Notifications

- **Get notifications for the doctor**
  - **URL:** `/api/users/doctor/notifications`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Availability Management

- **Set availability**
  - **URL:** `/api/users/doctor/availability/create`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "date": "string",
      "time": "string"
    }
    ```

- **Update availability**
  - **URL:** `/api/users/doctor/availability/:id/update`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "date": "string",
      "time": "string"
    }
    ```

- **Delete availability**
  - **URL:** `/api/users/doctor/availability/:availabilityId/delete`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get availability details**
  - **URL:** `/api/users/doctor/availability`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

## Admin Routes

### Authentication

- **Create a new admin**
  - **URL:** `/api/admins/admin/register`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Admin login**
  - **URL:** `/api/admins/admin/login`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **Get all admins**
  - **URL:** `/api/admins/admin/get_all`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get a specific admin by ID**
  - **URL:** `/api/admins/admin/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Update an admin by ID**
  - **URL:** `/api/admins/admin/update/:id`
  - **Method:** `PATCH`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "profile_picture": "file"
    }
    ```

- **Delete an admin by ID**
  - **URL:** `/api/admins/admin/delete/:id`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Patients

- **List all patients**
  - **URL:** `/api/admins/admin/patients/all`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get patient details**
  - **URL:** `/api/admins/admin/patients/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Block a patient**
  - **URL:** `/api/admins/admin/patients/:id/block`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Unblock a patient**
  - **URL:** `/api/admins/admin/patients/:id/unblock`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Approve patient account deletion**
  - **URL:** `/api/admins/admin/patients/:id/delete`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Doctors

- **List all doctors**
  - **URL:** `/api/admins/admin/doctors/all`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get doctor details**
  - **URL:** `/api/admins/admin/doctors/:id`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Approve a doctor registration**
  - **URL:** `/api/admins/admin/doctors/:id/approve`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Reject a doctor registration**
  - **URL:** `/api/admins/admin/doctors/:id/reject`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Block a doctor**
  - **URL:** `/api/admins/admin/doctors/:id/block`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Unblock a doctor**
  - **URL:** `/api/admins/admin/doctors/:id/unblock`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Approve doctor account deletion**
  - **URL:** `/api/admins/admin/doctors/:id/delete`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Appointments

- **View all appointments**
  - **URL:** `/api/admins/admin/appointments/all`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **View specific appointment details**
  - **URL:** `/api/admins/admin/appointments/:id/view`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Cancel an appointment on behalf of a user**
  - **URL:** `/api/admins/admin/appointments/:id/cancel`
  - **Method:** `DELETE`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Consultations

- **View all consultations**
  - **URL:** `/api/admins/admin/consultations/all`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **View details of a specific consultation**
  - **URL:** `/api/admins/admin/consultations/:id/view`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Notifications

- **Send notifications to doctors or patients**
  - **URL:** `/api/admins/admin/notifications`
  - **Method:** `POST`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "message": "string",
      "recipients": ["string"]
    }
    ```

### Manage Analytics & Reports

- **Generate system usage reports (appointments, consultations, etc.)**
  - **URL:** `/api/admins/admin/reports`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **View system-wide analytics**
  - **URL:** `/api/admins/admin/analytics`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Manage Platform Settings

- **Update platform configurations**
  - **URL:** `/api/admins/admin/settings`
  - **Method:** `PUT`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - **Body:**
    ```json
    {
      "settings": "object"
    }
    ```

- **View platform settings**
  - **URL:** `/api/admins/admin/settings`
  - **Method:** `GET`
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
