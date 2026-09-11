# CampusConnect 🎓

CampusConnect is a full-stack student opportunity platform designed to help students discover opportunities, build professional profiles, apply for opportunities, and track their applications.

Recruiters can create and manage opportunities, review applications, and update application statuses, while administrators can manage users and platform-level activities.

The project demonstrates modern frontend development, REST API integration, authentication, role-based authorization, cloud services, security hardening, automated testing, and production deployment.

## 🌐 Live Application

**Frontend:**
https://campusconnect-red-alpha.vercel.app

**Backend API:**
https://campusconnect-server-lcj4.onrender.com

**API Documentation:**
https://campusconnect-server-lcj4.onrender.com/api-docs

## ✨ Features

### 👨‍🎓 Student Features

* Student registration and login
* JWT-based authentication
* Secure password reset through email
* Student profile management
* Profile image upload
* Cloudinary image storage
* Student directory
* Student profile viewing
* Opportunity discovery
* Opportunity search and filtering
* Opportunity details
* Save and unsave opportunities
* Apply for opportunities
* Application tracking
* Application status updates
* Notifications
* Student dashboard

### 💼 Recruiter Features

* Recruiter authentication
* Recruiter dashboard
* Create opportunities
* Edit owned opportunities
* Delete owned opportunities
* View applications for owned opportunities
* Review applicant information
* Accept applications
* Reject applications
* Application status management
* Application notifications
* Email notifications for new applications

### 🛡️ Administrator Features

* Admin dashboard
* Platform statistics
* User management
* Individual user details
* Role management
* Account activation/deactivation
* Application management
* Protected administrator endpoints

## 🛡️ Security

CampusConnect was designed with security as an important part of the application rather than as an afterthought.

Security measures include:

* JWT authentication
* Role-based authorization
* Recruiter ownership verification
* Application ownership verification
* Notification ownership verification
* Secure password hashing with bcrypt
* Cryptographically secure password reset tokens
* Hashed password reset tokens
* 15-minute password reset expiration
* One-time password reset tokens
* Generic forgot-password responses to reduce account enumeration
* Restricted CORS
* Helmet security headers
* General API rate limiting
* Authentication-specific rate limiting
* Registration rate limiting
* JSON request-size limits
* Request input validation
* Mongoose schema validation
* ObjectId validation
* Duplicate application protection
* Profile image size restrictions
* Profile image MIME validation
* Profile image signature validation
* Environment-based secrets
* Cloudinary secure image storage

## 🧰 Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* CSS
* Vitest
* React Testing Library

### Backend

* Node.js
* Express.js
* JavaScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary
* Brevo Transactional Email
* Helmet
* Express Rate Limit
* Swagger/OpenAPI

### Infrastructure

* Vercel — Frontend hosting
* Render — Backend hosting
* MongoDB Atlas — Database
* Cloudinary — Image storage
* Brevo — Transactional email

## 🏗️ Architecture

```text
                         CampusConnect
                              │
                              ▼
                  ┌─────────────────────┐
                  │    React Frontend   │
                  │       Vercel        │
                  └──────────┬──────────┘
                             │
                             │ HTTPS / REST API
                             ▼
                  ┌─────────────────────┐
                  │   Express Backend   │
                  │       Render        │
                  └──────┬──────┬───────┘
                         │      │
              ┌──────────┘      └──────────┐
              ▼                            ▼
      ┌───────────────┐            ┌───────────────┐
      │ MongoDB Atlas │            │   Cloudinary  │
      │   Database    │            │ Profile Images│
      └───────────────┘            └───────────────┘
                         │
                         ▼
                  ┌───────────────┐
                  │     Brevo     │
                  │ Transactional │
                  │     Email     │
                  └───────────────┘
```

## 🔐 Authentication Flow

CampusConnect uses JWT-based authentication.

```text
User
 ↓
Login / Registration
 ↓
Backend validates credentials
 ↓
JWT generated
 ↓
Frontend stores authenticated session
 ↓
Protected API request
 ↓
Authorization: Bearer <token>
 ↓
Backend verifies JWT
 ↓
User identity and role attached
 ↓
Protected resource accessed
```

Role-based authorization determines whether the authenticated user can access student, recruiter, or administrator functionality.

## 👥 Role-Based Access Control

CampusConnect supports three primary roles:

```text
student
recruiter
admin
```

### Student

Students can:

* Manage their profile
* Browse opportunities
* Save opportunities
* Apply for opportunities
* Track applications
* Manage notifications

### Recruiter

Recruiters can:

* Create opportunities
* Manage their own opportunities
* View applications for their opportunities
* Accept or reject applications
* Receive application notifications

### Admin

Administrators can:

* Manage users
* Manage user roles
* Activate/deactivate accounts
* View platform statistics
* Manage applications
* Access protected administrative resources

## 🔑 Password Reset

CampusConnect uses a secure token-based password reset workflow.

```text
Forgot Password
       ↓
Find User Account
       ↓
Generate Cryptographically Secure Token
       ↓
Hash Token
       ↓
Store Token Hash + Expiration
       ↓
Send Reset Email Through Brevo
       ↓
User Opens Reset Link
       ↓
Backend Hashes Submitted Token
       ↓
Compare Token Hashes
       ↓
Check Expiration
       ↓
Hash New Password
       ↓
Invalidate Reset Token
       ↓
Password Successfully Changed
```

Password reset tokens expire after **15 minutes** and are invalidated after successful use.

## 📧 Transactional Email

CampusConnect uses the **Brevo transactional email API**.

Email notifications include:

* Password reset emails
* New application notifications for recruiters
* Application acceptance notifications
* Application rejection notifications

The API-based email implementation avoids dependency on outbound SMTP ports from the production hosting environment.

## 🖼️ Profile Image Security

Profile images are processed using Multer and Cloudinary.

The backend:

1. Limits uploads to 2 MB
2. Accepts JPG, PNG, and WebP
3. Validates the provided MIME type
4. Verifies the actual file signature
5. Uploads validated images to Cloudinary
6. Stores the secure Cloudinary URL
7. Removes the previous Cloudinary image after successful replacement

## 📁 Project Structure

### Frontend

```text
campusconnect/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── config/
│   ├── test/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── vercel.json
├── package.json
└── README.md
```

### Backend

```text
campusconnect-server/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 📡 API Documentation

The backend provides interactive API documentation using **Swagger/OpenAPI**.

API documentation is available at:

https://campusconnect-server-lcj4.onrender.com/api-docs

The API documentation covers the major backend resources, including:

* Authentication
* Students
* Opportunities
* Applications
* Notifications
* Saved opportunities
* Recruiter functionality
* Administration
* Health checks

Protected endpoints use JWT Bearer authentication.

## 🧪 Testing

CampusConnect has been tested across frontend and backend application flows.

### Backend Automated Testing

The backend currently has:

**61 automated tests**

with:

**100% statement coverage**
**100% branch coverage**
**100% function coverage**
**100% line coverage**

Backend testing covers areas including:

* Authentication
* Registration
* Login
* Password reset
* Profile management
* Profile image handling
* Opportunities
* Applications
* Notifications
* Saved opportunities
* Recruiter authorization
* Admin authorization
* Ownership protection
* Security validation
* API behavior

### Frontend Automated Testing

The frontend currently has:

**208 passing tests**

The tested frontend areas include:

* Login
* Registration
* Forgot Password
* Reset Password
* Dashboard
* Student Details
* Opportunities
* Opportunity Cards
* Opportunity Details
* Profile
* Student Directory
* Home
* Saved Opportunities
* Notifications

The Applications frontend suite was intentionally left outside the final passing-test count.

## 🚀 Local Development

### Frontend

Clone the repository:

```bash
git clone https://github.com/Abdulsalam-k/campusconnect.git
```

Enter the project:

```bash
cd campusconnect
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

### Backend

Clone the backend repository:

```bash
git clone https://github.com/Abdulsalam-k/campusconnect-server.git
```

Enter the project:

```bash
cd campusconnect-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a guide.

Start the development server:

```bash
npm run dev
```

The backend runs by default at:

```text
http://localhost:5000
```

## 🔒 Environment Variables

Never commit real secrets, API keys, database credentials, or private tokens to GitHub.

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

### Backend

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
FRONTEND_APP_URL=http://localhost:5173

BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=your_verified_sender_email
BREVO_FROM_NAME=CampusConnect

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Production secrets are configured through Vercel and Render environment variables.

## 🌍 Production Deployment

CampusConnect is deployed using a cloud-based architecture.

```text
Vercel
   │
   │ React Frontend
   │
   ▼
Render
   │
   │ Express REST API
   │
   ├──────────────► MongoDB Atlas
   │
   ├──────────────► Cloudinary
   │
   └──────────────► Brevo
```

### Production Services

| Service       | Purpose                 |
| ------------- | ----------------------- |
| Vercel        | React frontend hosting  |
| Render        | Express backend hosting |
| MongoDB Atlas | Database                |
| Cloudinary    | Profile image storage   |
| Brevo         | Transactional email     |

## 🎯 Project Goals

CampusConnect was built as a realistic full-stack application to demonstrate practical software engineering skills across the entire development lifecycle.

The project demonstrates:

* React frontend development
* REST API development
* Database modeling
* Authentication
* Authorization
* Role-based access control
* API integration
* Cloud storage
* Transactional email
* Security hardening
* Automated testing
* API documentation
* Production deployment

## 🔮 Future Improvements

Potential future improvements include:

* Resume and document uploads
* Recruiter company profiles
* Advanced recommendation systems
* Advanced analytics
* More advanced search capabilities
* Centralized production logging
* Application monitoring
* CI/CD automation
* End-to-end browser testing
* Performance monitoring

## 👨‍💻 Author

**Abdulkareem Abdulsalam**

GitHub:
https://github.com/Abdulsalam-k

### Repositories

**Frontend:**
https://github.com/Abdulsalam-k/campusconnect

**Backend:**
https://github.com/Abdulsalam-k/campusconnect-server

### Live Application

https://campusconnect-red-alpha.vercel.app

---

CampusConnect was developed as a full-stack portfolio project focused on building a realistic student opportunity platform from frontend development through backend engineering, security, automated testing, API documentation, and production deployment.
