# Online Land Agency Platform - Backend Structure

This directory contains the backend server for the Online Land Agency Platform, built with Node.js, Express.js, and Supabase.

## Directory Structure

```
backend/
├── config/              # Configuration files (database, environment, Supabase)
├── controllers/         # Request handlers for each domain
│   ├── properties/      # Property-related controllers
│   ├── applications/    # Apply-to-Buy application controllers
│   ├── messages/        # Customer message controllers
│   ├── brokers/         # Broker account controllers
│   └── auth/            # Authentication controllers
├── services/            # Business logic layer
│   ├── properties/      # Property business logic
│   ├── applications/    # Application business logic
│   ├── messages/        # Message business logic
│   ├── brokers/         # Broker business logic
│   └── auth/            # Authentication business logic
├── repositories/        # Data access layer (Supabase interactions)
│   ├── properties/      # Property data operations
│   ├── applications/    # Application data operations
│   ├── messages/        # Message data operations
│   └── brokers/         # Broker data operations
├── middleware/          # Express middleware
│   ├── auth/            # JWT authentication middleware
│   ├── validation/      # Request validation middleware
│   ├── error/           # Error handling middleware
│   └── security/        # Security middleware (CORS, rate limiting, headers)
├── validation/          # Input validation schemas
│   ├── properties/      # Property validation schemas
│   ├── applications/    # Application validation schemas
│   ├── messages/        # Message validation schemas
│   ├── brokers/         # Broker validation schemas
│   └── auth/            # Authentication validation schemas
├── routes/              # API route definitions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── server.ts            # Main application entry point
```

## Architecture Overview

### Layered Architecture

The backend follows a modular, layered architecture:

1. **Controllers Layer** - Handles HTTP requests/responses, validates input, delegates to services
2. **Services Layer** - Contains business logic, orchestrates repository operations
3. **Repositories Layer** - Manages data access to Supabase PostgreSQL database
4. **Middleware Layer** - Cross-cutting concerns (auth, validation, error handling, security)
5. **Validation Layer** - Schema definitions for input validation

### Key Features

- **Property Management**: CRUD operations for land properties with filtering, searching, and sorting
- **Apply-to-Buy Management**: Application lifecycle management with status tracking
- **Customer Message Management**: Communication system with status management
- **Broker Account Management**: Authentication, authorization, and profile management
- **Database Management**: Secure CRUD operations with Supabase PostgreSQL
- **API Management**: RESTful APIs with consistent request/response formats
- **Security**: JWT authentication, RBAC, input validation, rate limiting, CORS
- **Scalability**: Modular design for easy maintenance and feature additions

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Custom validation schemas
- **Language**: TypeScript

## API Endpoints

### Public Endpoints
- `GET /api/properties` - List all available properties
- `GET /api/properties/:id` - Get property details
- `POST /api/applications` - Submit a buy application
- `POST /api/messages` - Send a customer message

### Protected Endpoints (Broker/Admin)
- `GET /api/brokers/profile` - Get broker profile
- `PUT /api/brokers/profile` - Update broker profile
- `POST /api/properties` - Create property listing
- `PUT /api/properties/:id` - Update property listing
- `DELETE /api/properties/:id` - Delete property listing
- `GET /api/applications` - List applications (broker's properties)
- `PUT /api/applications/:id` - Update application status
- `GET /api/messages` - List messages
- `PUT /api/messages/:id` - Update message status

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Request rate limiting
- Secure HTTP headers
- CORS policies
- Error handling and logging
- SQL injection prevention (via Supabase)
