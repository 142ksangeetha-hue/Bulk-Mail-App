# 📧 Bulk Mail Application

A full-stack web application for managing subscribers and sending bulk emails using the **MERN Stack**. The application provides user authentication, subscriber management, and secure bulk email functionality using Gmail and Nodemailer.

---

## 📌 Project Overview

The **Bulk Mail Application** is designed to simplify the process of managing email subscribers and sending emails to multiple subscribers at once.

The application consists of:

* A **React.js** frontend for the user interface
* A **Node.js + Express.js** backend for APIs and business logic
* **MongoDB** for storing users and subscribers
* **JWT** for user authentication
* **Nodemailer + Gmail** for sending emails

---

## 🎯 Objectives

The main objectives of this project are:

1. To create a user-friendly bulk email management system.
2. To provide secure user registration and login.
3. To allow users to add, edit, view, and delete subscribers.
4. To send emails to all registered subscribers.
5. To store subscriber and user information in MongoDB.
6. To implement authentication using JSON Web Tokens (JWT).
7. To integrate Gmail with Nodemailer for email delivery.

---

## ✨ Features

### 🔐 User Authentication

* User registration
* User login
* JWT-based authentication
* Protected email-sending API
* Logout functionality

### 👤 Subscriber Management

* Add new subscribers
* View all subscribers
* Edit subscriber details
* Delete subscribers
* Delete confirmation dialog
* Subscriber count display

### 📧 Bulk Email

* Enter email subject
* Enter email message
* Send email to all subscribers
* Gmail integration using Nodemailer
* Sending status indicator
* Success/error messages
* Prevents multiple submissions while an email is being sent
* Confirmation before sending bulk email

### 🎨 User Interface

* Clean and simple interface
* Responsive form layout
* Subscriber table
* Styled action buttons
* Clear form functionality
* User-friendly success and error messages

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Fetch API

### Backend

* Node.js
* Express.js
* JavaScript
* REST API

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* Password hashing

### Email Service

* Nodemailer
* Gmail SMTP
* Gmail App Password

### Development Tools

* Visual Studio Code
* Postman
* MongoDB
* Node.js
* npm

---

## 🏗️ System Architecture

```text
                   ┌─────────────────────┐
                   │       User          │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   React Frontend    │
                   │      (Vite)         │
                   └──────────┬──────────┘
                              │
                         HTTP / REST API
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Node.js + Express  │
                   │      Backend        │
                   └──────┬───────┬──────┘
                          │       │
              ┌───────────┘       └────────────┐
              ▼                                ▼
     ┌─────────────────┐              ┌─────────────────┐
     │     MongoDB     │              │    Nodemailer   │
     │    Database     │              │      Gmail      │
     └─────────────────┘              └────────┬────────┘
                                               │
                                               ▼
                                      📧 Subscribers
```

---

## 📂 Project Structure

```text
Bulk-Mail-App/
│
├── backend/
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Subscriber.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── subscriberRoutes.js
│   │   └── emailRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Subscribers

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/api/subscribers`     | Get all subscribers |
| POST   | `/api/subscribers`     | Add a subscriber    |
| PUT    | `/api/subscribers/:id` | Update a subscriber |
| DELETE | `/api/subscribers/:id` | Delete a subscriber |

### Email

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| POST   | `/api/email/send` | Send email to all subscribers |

The email endpoint requires a valid JWT authentication token.

---

## ⚙️ Installation and Setup

### 1. Clone or download the project

Open the project folder in Visual Studio Code.

### 2. Install backend dependencies

Open a terminal inside the `backend` folder:

```bash
npm install
```

### 3. Install frontend dependencies

Open another terminal inside the `frontend` folder:

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

**Do not share your Gmail App Password or upload the `.env` file to GitHub.**

---

## ▶️ Running the Application

### Start the Backend

From the `backend` folder:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

From the `frontend` folder:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

## 📮 Email Configuration

The application uses **Nodemailer** to send emails through Gmail.

A Gmail **App Password** is used instead of the normal Gmail account password.

The email configuration is stored securely in the backend `.env` file.

```env
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## 🔒 Security

The project implements several security measures:

* JWT authentication
* Protected email-sending route
* Environment variables for sensitive configuration
* Gmail App Password instead of storing the normal Gmail password
* Authentication token sent using the Bearer authorization header
* `.env` excluded from version control

---

## 🧪 Testing

The APIs were tested using **Postman**.

The following functionality was tested successfully:

* User registration
* User login
* JWT authentication
* Adding subscribers
* Retrieving subscribers
* Updating subscribers
* Deleting subscribers
* Sending bulk emails

The frontend was also tested for:

* Login
* Subscriber management
* Email composition
* Bulk email sending
* Success messages
* Delete confirmation
* Sending-state handling

---

## ✅ Expected Result

After logging in, the user can:

1. Add subscribers.
2. View the subscriber list.
3. Edit subscriber information.
4. Delete subscribers.
5. Enter an email subject and message.
6. Confirm the bulk email operation.
7. Send the email to all subscribers.
8. Receive a successful email-sending confirmation.

---

## 🚀 Future Enhancements

The application can be extended with:

* Email templates
* Scheduled emails
* Email delivery history
* Search and filter subscribers
* Subscriber groups
* CSV subscriber import
* Pagination
* Rich-text email editor
* Email analytics
* Delivery and bounce tracking
* Admin dashboard
* Password reset functionality

---

## 🎓 Learning Outcomes

Through this project, the following concepts were implemented:

* React component development
* React state management
* REST API development
* Express.js routing
* MongoDB database operations
* Mongoose models
* JWT authentication
* Password security
* CRUD operations
* API testing using Postman
* Gmail SMTP integration
* Nodemailer email integration
* Frontend-backend communication
* Environment variable management

---

## 👩‍💻 Project Type

**Full Stack Web Application**

**Technology:** MERN Stack

**Project:** Bulk Mail Application

---

## 📄 License

This project was developed for educational and academic purposes.
