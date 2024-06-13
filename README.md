[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

# University Timetable Management System - RESTful API

## Introduction:
This project aims to develop a secure and efficient RESTful API for managing the timetable system of a university.
It includes the following features:

#### 1. User Roles and Authentication
The register function enables user registration, enforcing authentication and authorization by allowing only Admins to perform this action. It securely hashes passwords before storage and generates role-specific attributes like groupName for students. The login function validates credentials, generating a JWT token upon successful authentication for subsequent authenticated requests. User data retrieval functions include getAllUsers, getUsersByRole, getUserById, and getTimetableByGroupName, catering to various data access needs while ensuring role-based access control and data security.
#### 2. Course Management
This collectively provide CRUD operations for managing courses within the application. The permissions are enforced based on the user's role, ensuring that only admins can perform certain actions like creating, updating, and deleting courses. Additionally, faculty members can be associated with courses to facilitate effective course management.
In here the system enable Admins to assign Faculty to courses.
#### 3. Timetable Management
Facilitate the CRUD operations. Admins use createTimetableSession to add sessions, preventing duplicates and ensuring authorization. getAllTimetableSessions lists all sessions in JSON format. For specific sessions, getTimetableSessionById locates them by group ID, issuing errors if not found. updateTimetableSession enables admins to modify sessions and notify students. deleteTimetableSession removes sessions by ID, confirming success. These functions streamline management, ensuring efficiency and timely updates. 
#### 4. Room and Resource Booking
The Location and Resource Booking functionality enables admins to manage CRUD operations on booking process. The system ensures that bookings do not overlap in time for the same location. Users can view all bookings, retrieve specific bookings by ID. 
#### 5. Student Enrollment
The Student Enrollment functionality allows for managing student enrollments in courses. Admins or authorized users can enroll students in courses, retrieve enrollments for a specific student, view all enrollments across courses, and unenroll students from courses as needed.
#### 6. Notifications and Alerts
Implement a system to notify users of timetable changes, room changes, or important announcements.

## Deployment:
1. Ensure that Node.js and MongoDB are installed on your system.
2. Clone the repository.
3. Navigate to the project directory in the terminal.
4. Install dependencies by running the command:
`npm install  ` 
5. Set up environment variables:
- Create a .env file in the root directory.
- Define the following environment variables:
  - `PORT=4000` 
  - `MONGODB_URI=[MongoDB connection URI]`
  - `JWT_SECRET=[Your JWT secret key]`
6. Start the server by running the command:
`npm run dev` 

## Running:
1. Ensure that the server is up and running as per the deployment instructions.
2. Use an API testing tool like Postman or Insomnia to interact with the endpoints.
3. Send HTTP requests to the appropriate endpoints for CRUD operations on courses, timetable management, location & resource booking and student enrollment.

## Testing:
### Unit Testing:
- Run unit tests for individual components and functions using Jest.
- Use this command: 
 `npx jest [xxxx.test.js]`

## Note:
- Ensure that all dependencies are installed and environment variables are properly configured before running the server or tests.
- Refer to the API documentation (generated using Postman: UniversityTimeTable.postman_collection.json) for detailed information on available endpoints and their usage.
