🗳️ Voting App
A secure and role-based online voting system built using Node.js, Express, MongoDB, and JWT authentication. This application allows users to register, log in, vote for candidates, and provides an admin panel for managing candidates.

🚀 Features
User registration and login with secure password hashing (bcrypt).

JWT-based authentication.

Role-based access:

Admin: Can add/update/delete candidates.

Voter: Can vote only once.

Only one admin is allowed in the system.

Vote tracking with timestamps.

Secure profile handling.

Vote count and candidate listing.

🏗️ Technologies Used
Node.js

Express.js

MongoDB + Mongoose

JSON Web Tokens (JWT)

bcrypt for password encryption

dotenv for environment management

📁 Folder Structure
pgsql
Copy
Edit
.
├── models/
│   ├── user.js
│   └── candidate.js
├── routes/
│   ├── userRoutes.js
│   └── candidateRoutes.js
├── db.js
├── jwt.js
├── server.js
├── .env
└── README.md

⚙️ Setup Instructions
Prerequisites
Node.js and npm installed
postman
MongoDB installed or a MongoDB Atlas cluster

Installation
bash
Copy
Edit
git clone <your-repo-url>
cd voting-app
npm install
Environment Variables (.env)
env
Copy
Edit
PORT=3000
MONGODB_URL_LOCAL=mongodb://localhost:27017/votingapp
MONGODB_URL=<your-atlas-url>
JWT_SECRET=your_jwt_secret_key


📌 API Endpoints


👥 User Routes (/user)
POST /signup – Register a new user

POST /login – Log in and receive JWT token

GET /profile – View profile (JWT required)

PUT /profile/password – Change password

GET /list – List all users

GET /admin – Get admin details



🗳️ Candidate Routes (/candidate)

POST / – Add new candidate (Admin only)

PUT /:candidateID – Update candidate (Admin only)

DELETE /:candidateID – Delete candidate (Admin only)

POST /vote/:candidateID – Vote for a candidate (User only)

GET /vote/count – Get vote count per party

GET /list – List all candidates


🧪 Testing
Use Postman or Thunder Client for API testing. Include the JWT token in the Authorization header:

makefile
Copy
Edit
Authorization: Bearer <your_token_here>
❗ Notes
Only one admin is allowed.

A user can vote only once.

Admins are restricted from voting.


✍️ Author
Yash Saxena
Feel free to contribute, raise issues, or fork this repo!
