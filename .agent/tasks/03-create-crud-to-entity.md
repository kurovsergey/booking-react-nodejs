# Task 3: API REST project: CRUD For User, Office, Working Seat, Booking

# Prompt:
    Backend: Nest.js
    - Architecture: Clean Architecture, Domain Driven Design (DDD)
    - Authentication: JWT, Password Bcrypt, Refresh Token:
        - Use Redis for store token for logout and refresh token
        - Login
        - Register
        - Logout
        - Forgot Password
        - Reset Password
        - Verify Account
    - Authorization: Role-Based Access Control (RBAC) (Admin, User)
    - Database: PostgreSQL, TypeORM for database operations
    - Data Transfer: Use DTO for data transfer

# User
    - Create, Update, Delete, Get, GetAll, Login, Register
    - Access: Admin:
        - Create, Update, Delete, Get, GetAll, Login, Register
    - Access: User:
        - Get(only own user), Login, Update(only own user), Register
# Office
    - Create, Update, Delete, Get, GetAll
    - Access: Admin:
        - Create, Update, Delete, Get, GetAll
    - Access: User:
        - Get(only own office), GetAll(all office), Update(only own office), Delete(only own office)
# Working Seat
    - Create, Update, Delete, Get, GetAll
    - Access: Admin:
        - Create, Update, Delete, Get, GetAll
    - Access: User:
        - Get(only own working seat), GetAll(all working seat), Update(only own working seat), Delete(only own working seat)
# Booking
    - Create, Update, Delete, Get, GetAll
    - Access: Admin:
        - Create, Update, Delete, Get, GetAll
    - Access: User:
        - Get(only own booking), GetAll(all booking), Update(only own booking), Delete(only own booking)

# Override
    - Prevent double booking in same date by user
    - Use pessimistic transaction for database operations
        