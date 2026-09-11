# CampusConnect 🎓

CampusConnect is a full-stack student opportunity platform that helps students discover opportunities, build professional profiles, apply for opportunities, and track their applications.

Recruiters can create and manage opportunities, review applications, and update application statuses, while administrators can manage users, opportunities, and applications.

## 🌐 Live Application

**Frontend:**
https://campusconnect-red-alpha.vercel.app

**Backend API:**
https://campusconnect-server-lcj4.onrender.com

## ✨ Features

### Student Features

* Student registration and login
* Secure authentication with JWT
* Password reset through email
* Student profile management
* Profile image upload
* Cloudinary profile image storage
* Student directory
* Search and browse opportunities
* Opportunity details
* Apply for opportunities
* Track submitted applications
* Save and unsave opportunities
* Notifications
* Application status updates
* Student dashboard

### Recruiter Features

* Recruiter authentication
* Recruiter dashboard
* Create opportunities
* Edit opportunities
* Delete opportunities
* View applications for owned opportunities
* Accept or reject applications
* Application status notifications
* Email notifications for new applications

### Administrator Features

* Admin dashboard
* View platform statistics
* View all users
* View individual users
* Change user roles
* Activate or deactivate users
* View all applications
* Platform-level management

## 🛡️ Security

CampusConnect includes several security and hardening measures:

* JWT-based authentication
* Role-based authorization
* Recruiter ownership checks
* Application ownership checks
* Notification ownership checks
* Secure password hashing with bcrypt
* One-time password reset tokens
* Password reset token expiration
* CORS origin restrictions
* Helmet security headers
* API rate limiting
* Authentication-specific rate limiting
* Registration rate limiting
* JSON request-size limits
* Input validation
* Database-level schema validation
* Duplicate application protection
* Profile image size restrictions
* Profile image MIME validation
* Profile image signature validation
* Cloudinary-based image storage
* Environment-based secrets

## 🧰 Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary
* Brevo Transactional Email
* Helmet
* Express Rate Limit

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Cloudinary — Image Storage
* Brevo — Transactional Email

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      CampusConnect   │
                    │    React Frontend    │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ HTTPS / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Node.js + Express │
                    │      Backend API     │
                    │        Render        │
                    └──────┬─────┬─────┬───┘
                           │     │     │
              ┌────────────┘     │     └─────────────┐
              ▼                  ▼                   ▼
     ┌────────────────┐  ┌───────────────┐  ┌────────────────┐
     │ MongoDB Atlas  │  │   Cloudinary  │  │     Brevo      │
     │    Database    │  │ Profile Images│  │ Transactional  │
     │                │  │               │  │     Email      │
     └────────────────┘  └───────────────┘  └────────────────┘
```

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
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
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
├── .env.example
├── .gitignore
└── package.json
```

## 🔐 Authentication Flow

CampusConnect uses JWT-based authentication.

```text
User Login
    ↓
Backend validates credentials
    ↓
JWT token generated
    ↓
Frontend stores authenticated session
    ↓
Protected API requests include:
Authorization: Bearer <token>
```

Role-based authorization then determines whether the user can access student, recruiter, or admin functionality.

## 🔑 Password Reset Flow

```text
User selects "Forgot Password"
          ↓
Backend finds account
          ↓
Secure reset token generated
          ↓
Token hash stored in MongoDB
          ↓
Brevo sends reset email
          ↓
User opens reset link
          ↓
Reset Password page
          ↓
New password hashed with bcrypt
          ↓
Reset token invalidated
          ↓
User logs in with new password
```

Reset links expire after 15 minutes and are designed for one-time use.

## 📧 Email Notifications

CampusConnect uses Brevo for transactional email delivery.

Emails include:

* Password reset emails
* New application notifications for recruiters
* Application acceptance notifications
* Application rejection notifications

## 🖼️ Profile Image Handling

Profile images are:

1. Validated by MIME type
2. Limited to 2 MB
3. Checked using file signatures
4. Uploaded to Cloudinary
5. Stored using the Cloudinary secure URL
6. Previous Cloudinary images are removed after successful replacement

## 🔒 Environment Variables

Never commit real environment variables or secrets to GitHub.

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

For production, environment variables are configured through Vercel and Render rather than committed to the repository.

## 🚀 Local Development

### Frontend

```bash
git clone https://github.com/Abdulsalam-k/campusconnect.git
cd campusconnect
npm install
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

### Backend

```bash
git clone https://github.com/Abdulsalam-k/campusconnect-server.git
cd campusconnect-server
npm install
npm run dev
```

The backend runs by default at:

```text
http://localhost:5000
```

## 🧪 Testing

CampusConnect has been manually tested across major user flows, including:

* Registration
* Login
* Logout
* Password reset
* Profile management
* Profile image upload
* Opportunity browsing
* Opportunity creation
* Opportunity editing
* Opportunity deletion
* Opportunity saving
* Application submission
* Application tracking
* Application status updates
* Notifications
* Recruiter functionality
* Admin functionality
* Production API communication
* Production deployment

Security hardening was also tested locally before production deployment.

## 🎯 Project Goals

CampusConnect was built to provide a realistic full-stack platform that demonstrates:

* Frontend development
* Backend API development
* Database design
* Authentication
* Authorization
* Cloud services
* Transactional email
* Security
* API integration
* Production deployment

## 🔮 Future Improvements

Potential future improvements include:

* Advanced search and filtering
* Pagination improvements
* Resume/document uploads
* Recruiter company profiles
* Advanced recommendation systems
* Analytics dashboards
* Automated testing with Jest/Supertest
* End-to-end testing
* CI/CD pipelines
* Enhanced monitoring and logging

## 👨‍💻 Author

**Abdulkareem Abdulsalam**

GitHub:
https://github.com/Abdulsalam-k

CampusConnect was developed as a full-stack portfolio project focused on building a realistic student opportunity platform from frontend to production deployment.
