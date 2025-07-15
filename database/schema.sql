-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS inclusive_feedback_tool;

-- Use the created database
USE inclusive_feedback_tool;

-- Table for feedback categories
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table for administrator accounts
CREATE TABLE Admin_Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Department', 'Super') NOT NULL
);

-- Table for feedback submissions
CREATE TABLE Submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    category_id INT,
    tracking_code VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    flagged BOOLEAN DEFAULT FALSE,
    status ENUM('New', 'Under Review', 'Resolved') NOT NULL DEFAULT 'New',
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Seed initial data

-- Insert default categories
INSERT INTO Categories (name) VALUES
('Discrimination'),
('Mental Health'),
('Accessibility'),
('Academic Concerns'),
('Facilities');

-- Insert a default super administrator (password will be hashed by the backend)
-- The plain text password is 'adminpass' for setup purposes.
-- The application should hash this password before storing it or when creating new users.
INSERT INTO Admin_Users (username, password, role) VALUES
('superadmin', '$2b$10$E.V3g3vB1g.P/f1.f/f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f', 'Super'); -- Placeholder hash, will be replaced by a real one

-- Table for logging administrator actions
CREATE TABLE ActionLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type VARCHAR(255) NOT NULL, -- e.g., 'STATUS_UPDATE', 'USER_CREATED', 'LOGIN_SUCCESS'
    target_id INT, -- The ID of the object being acted upon (e.g., submission_id, user_id)
    target_type VARCHAR(255), -- e.g., 'Submission', 'User'
    details TEXT, -- Can store JSON with more info, like old/new values or IP address
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admin_Users(id)
);

-- Insert sample feedback submissions (unencrypted for demonstration)
-- The backend is designed to handle this gracefully.
INSERT INTO Submissions (category_id, content, tracking_code, flagged)
VALUES
  (1, 'I witnessed a student being subjected to racial slurs near the library. The university needs to take a stronger stance against this kind of behavior.', 'SEED001', 0),
  (1, 'A professor in the history department consistently makes discriminatory remarks about international students. It creates a hostile learning environment.', 'SEED002', 1),
  (2, 'The on-campus counseling services are understaffed. The wait times for an appointment are several weeks long, which is unacceptable for students in crisis.', 'SEED003', 0),
  (2, 'There is a significant lack of awareness and support for students with chronic illnesses. More resources and academic accommodations are needed.', 'SEED004', 0),
  (3, 'The main science building still does not have automatic doors, making it very difficult for students with mobility issues to access labs and lecture halls.', 'SEED005', 1),
  (3, 'The online learning portal is not fully compatible with screen readers, which poses a major barrier for visually impaired students.', 'SEED006', 0),
  (4, 'The grading criteria for the advanced physics course are unclear and seem to be applied inconsistently. Many students feel the assessments are unfair.', 'SEED007', 0),
  (4, 'I have concerns about the lack of available study spaces during exam periods. The library is always overcrowded.', 'SEED008', 0),
  (5, 'The lighting in the main parking garage is very poor, which feels unsafe for students leaving campus after late classes.', 'SEED009', 0),
  (5, 'The Wi-Fi connection is unreliable in several of the older campus buildings, which significantly disrupts research and study.', 'SEED010', 0);
