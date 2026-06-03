# Neighborhood Library Service

This solution uses REST APIs with FastAPI instead of gRPC-Web, as permitted in the assignment instructions.

A full-stack Neighborhood Library Service built using:

- React + TypeScript
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy ORM
- Bootstrap UI
- React Toastify
- SweetAlert2

---

# Features

## Dashboard

- Total Books
- Total Members
- Total Borrowed Books

## Books Management

- Add Book
- Edit Book
- Delete Book
- View Books List

## Members Management

- Add Member
- Edit Member
- Delete Member
- View Members List

## Borrow Management

- Borrow Book
- Return Book
- Borrow History
- Due Date Tracking

## Business Rules

- Cannot borrow a book when no copies are available.
- Cannot return a book twice.
- Cannot delete a book that is currently borrowed.
- Cannot delete a member with active borrowed books.
- Available copies automatically update when books are borrowed or returned.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Axios
- React Router DOM
- Bootstrap
- React Toastify
- SweetAlert2

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic

## Database

- PostgreSQL

---

# Project Structure

```text
neighborhood-library-service/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── tsconfig.json
│
├── docs/
│   └── library.proto
│
└── README.md
```

---

# Prerequisites

Install the following software:

- Node.js 16+
- Python 3.12+
- PostgreSQL 14+

---

# Database Setup

Create a PostgreSQL database.

```sql
CREATE DATABASE library_db;
```

---

# Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file inside backend folder:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/library_db
```

Replace:

```text
postgres
password
library_db
```

with your local PostgreSQL credentials.

---

# Run Backend

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000
```

---

# Run Frontend

```bash
npm start
```

Application URL:

```text
http://localhost:3000
```

---

# API Endpoints

## Books

```http
GET    /books
POST   /books
PUT    /books/{id}
DELETE /books/{id}
```

## Members

```http
GET    /members
POST   /members
PUT    /members/{id}
DELETE /members/{id}
```

## Borrowing

```http
POST /borrow
POST /return
GET  /borrow-records
```

## Borrow History

```http
GET /borrow-records
GET /members/{member_id}/borrowed-books
GET /overdue-books
```

---

# Testing Flow

## Create Member

Navigate to Members page.

Create:

```text
John Doe
john@example.com
9876543210
```

---

## Create Book

Navigate to Books page.

Create:


```
curl -X POST http://localhost:8000/books/ \
-H "Content-Type: application/json" \
-d '{
"title":"Atomic Habits",
"author":"James Clear",
"isbn":"9780735211292",
"total_copies":5
}'
```

---

## Borrow Book

Navigate to Borrow page.

Select:

```curl -X POST http://localhost:8000/borrow \
-H "Content-Type: application/json" \
-d '{
"member_id":1,
"book_id":1
}'
```

Click:

```text
Borrow
```

---

## Return Book

Navigate to Borrow History page.

Click:

```text
Return
```

```
curl -X POST http://localhost:8000/return \
-H "Content-Type: application/json" \
-d '{
"borrow_record_id":1
}'
```
---

# Error Handling

The application handles:

- Invalid member
- Invalid book
- No available copies
- Duplicate return attempts
- Active borrow deletion restrictions

---

# Future Improvements

- Authentication & Authorization
- Search & Filters
- Pagination
- Email Notifications
- Role Based Access
- Docker Support
- Unit Testing

---


# Protocol Buffers

A sample Protocol Buffer definition is provided:

docs/library.proto

The assignment allowed either:

- gRPC-Web + Protocol Buffers
- REST API

This implementation uses FastAPI REST APIs while providing sample Protobuf service definitions for reference.


# Assignment Requirements Coverage

✅ Member Management

- Create Member
- Update Member
- Delete Member
- List Members

✅ Book Management

- Create Book
- Update Book
- Delete Book
- List Books

✅ Borrowing System

- Borrow Books
- Return Books
- Due Date Tracking
- Borrow History

✅ PostgreSQL Integration

- SQLAlchemy ORM
- PostgreSQL Database

✅ Service Interface

- REST API implemented using FastAPI
- Swagger/OpenAPI documentation included

✅ Validation & Error Handling

- Invalid member validation
- Invalid book validation
- No available copies validation
- Duplicate return prevention
- Active borrow deletion prevention

✅ Additional Features

- Borrow History
- Overdue Books Endpoint
- Dashboard Statistics
- Responsive UI

# API Documentation

Interactive Swagger documentation is available at:

http://localhost:8000/docs

#Future Improvements
- gRPC-Web implementation
- Docker & Docker Compose
- JWT Authentication
- Automated Unit Tests
- CI/CD Pipeline

# Author

Rahul Tathod

Full Stack Developer

React | Node.js | Python | PostgreSQL