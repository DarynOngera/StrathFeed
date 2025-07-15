# Inclusive Feedback Tool

This is a secure, anonymous feedback system for university students, particularly those from marginalized groups, to report concerns (e.g., discrimination, mental health, accessibility) without fear of identification. This project was developed as a diploma-level project in Business Information Technology.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: MySQL (managed via XAMPP for local development)
- **Version Control**: Git, GitHub

## Features

- **Anonymous Feedback Submission**: Students can submit feedback without any personal identification.
- **Feedback Categorization**: Submissions can be categorized for easier processing.
- **Optional Tracking Code**: Users receive a unique code to check the status of their submission.
- **Secure Admin Dashboard**: Role-based access for administrators to view and manage feedback.
- **Super Admin Privileges**: Super Admins can manage categories and administrator accounts.
- **Encrypted Storage**: All feedback content is encrypted in the database.

---

## Setup and Installation

Follow these steps to get the application running locally.

### 1. Prerequisites

- **Node.js and npm**: Ensure you have Node.js (LTS version recommended) and npm installed. You can download it from [nodejs.org](https://nodejs.org/).
- **XAMPP**: Install XAMPP for a local Apache server and MySQL database. You can download it from [apachefriends.org](https://www.apachefriends.org/index.html).

### 2. Database Setup

1.  **Start XAMPP**: Open the XAMPP Control Panel and start the **Apache** and **MySQL** modules.
2.  **Open phpMyAdmin**: Click the **Admin** button for the MySQL module. This will open phpMyAdmin in your browser.
3.  **Import the Schema**: 
    - In phpMyAdmin, click on the **Import** tab.
    - Click **Choose File** and select the `database/schema.sql` file from this project's directory.
    - Scroll down and click **Go**. This will create the `inclusive_feedback_tool` database, create the necessary tables, and seed them with initial data (default categories and a super admin account).

### 3. Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the backend server**:
    ```bash
    npm run dev
    ```
    The backend API will now be running on `http://localhost:3001`.

### 4. Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the frontend server**:
    ```bash
    npm run dev
    ```
    The frontend application will now be running on `http://localhost:3000`.

---

## User Manual

### For Students

1.  **Submit Feedback**: Open `http://localhost:3000` in your browser. Fill out the form with your feedback, select a category, and click "Submit Anonymously".
2.  **Save Tracking Code**: After submission, you will receive a unique tracking code. Save this code if you wish to follow up on your submission in the future (note: this feature is designed for future extension).

### For Administrators

1.  **Login**: Navigate to `http://localhost:3000/admin/login`.
    - **Username**: `superadmin`
    - **Password**: `adminpass`
2.  **View Feedback**: On the dashboard, you can view all feedback submissions. You can filter them by category or flag them as inappropriate.
3.  **Manage Categories (Super Admin only)**: Click on the "Manage Categories" tab to add, edit, or delete feedback categories.
4.  **Manage Admins (Super Admin only)**: Click on the "Manage Admins" tab to create new administrator accounts or delete existing ones.

---

## Development Phases (Gantt Chart)

This chart outlines the basic development timeline for the project.

```
+--------------------------------+--------------------+
| Phase                          | Duration           |
+--------------------------------+--------------------+
| 1. Requirements & Planning     | 2 Days             |
| 2. Database & Backend Setup    | 4 Days             |
| 3. Frontend Development        | 5 Days             |
| 4. Admin Dashboard & Auth      | 4 Days             |
| 5. Testing & Documentation     | 3 Days             |
+--------------------------------+--------------------+
```
