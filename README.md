# Personal Journaling App - Backend

### Overview

This is the backend service for the Personal Journaling App, built with Node.js, Express, and TypeORM.

### Prerequisites

- Node.js (>= 14.x)
- JavaScript
- TypeORM

### Getting Started

1. **Clone the Repository**

   git clone https://github.com/yourusername/PersonalJournalingAppBackend.git
   cd PersonalJournalingAppBackend

2. **Install Dependencies**

   npm install

3. **Setup Environment Variables**

   Create a .env file in the root directory and add the following:

      DATABASE_URL=your_database_url
      JWT_SECRET=your_secret_key

4. **Run the Application**

   node src/index.js

5. **Run Tests**

   npm test

6. **API Documentation**
### User Endpoints

#### Register User

   URL: /api/users/register
   Method: POST
   Body:
      {
      "username": "string",
      "password": "string"
      }
   Response:
      {
      "message": "User registered successfully"
      }

#### Login User

   URL: /api/users/login
   Method: POST
   Body:
      {
      "username": "string",
      "password": "string"
      }
   Response:
      {
      "token": "string"
      }

#### Get User Profile

   URL: /api/users/profile
   Method: GET
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Response:
         {
         "id": "number",
         "username": "string"
         }


### Entry Endpoints
#### Create Entry

   URL: /api/entries
   Method: POST
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Body:
         {
         "title": "string",
         "content": "string",
         "category": "string",
         "date": "string"
         }
   Response:
         {
         "message": "Entry created successfully"
         }

#### Get Entries

   URL: /api/entries
   Method: GET
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Response:
         [
         {
            "id": "number",
            "title": "string",
            "content": "string",
            "category": "string",
            "date": "string"
         }
         ]

#### Get Entry by ID

   URL: /api/entries/:id
   Method: GET
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Response:
         {
         "id": "number",
         "title": "string",
         "content": "string",
         "category": "string",
         "date": "string"
         }

#### Update Entry

   URL: /api/entries/:id
   Method: PUT
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Body:
         {
         "title": "string",
         "content": "string",
         "category": "string",
         "date": "string"
         }
   Response:
         {
         "message": "Entry updated successfully"
         }

#### Delete Entry

   URL: /api/entries/:id
   Method: DELETE
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Response:
         {
         "message": "Entry deleted successfully"
         }

#### Get Entry Summary

   URL: /api/entries/summary/:period
   Method: GET
   Headers:
         {
         "Authorization": "Bearer <token>"
         }
   Params:
   period: daily, weekly, monthly
   Response:
         [
         {
            "date": "string",
            "count": "number"
         }
         ]

### Project Structure
src/: Contains the source code
entity/: Contains TypeORM entities
middleware/: Contains middleware for authentication
routes/: Contains API route handlers
index.js: Entry point of the application

## License
This project is licensed under the MIT License.
