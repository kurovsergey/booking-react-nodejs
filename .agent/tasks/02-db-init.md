# Init Database

## Task: 
Сделать миграции и сиды для базы данных

## Stack:
- PostgreSQL
- TypeORM

## Additional Requirements:
- Миграции должны быть созданы с использованием TypeORM
- Сиды должны быть созданы с использованием TypeORM

## Database Schema:
Database: booking_db:
    - User:
        id: uuid
        name: string
        email: string
        password: string
        role: string
    - Booking:
        id: uuid
        user_id: uuid
        office_id: uuid
        working_seat_id: uuid
        start_date: date
        end_date: date
        status: string
    - Office:
        id: uuid
        name: string
        description: string
        price: number
        availability: boolean
        created_at: date
        updated_at: date
    - Working_Seat:
        id: uuid
        name: string
        description: string
        price: number
        availability: boolean
        created_at: date
        updated_at: date
        