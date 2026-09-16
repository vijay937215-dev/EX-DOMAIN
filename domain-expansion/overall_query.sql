-- =====================================================================
-- DOMAIN EXPANSION: AI PROMPT CHALLENGE
-- MASTER SINGLE SQL SCRIPT (COMPLETE SETUP + ALL-IN-ONE OVERALL QUERY)
-- Compatible with: MySQL 8.0+ / PostgreSQL / MariaDB / SQLite
-- =====================================================================

-- Step 1: Create and select database
CREATE DATABASE IF NOT EXISTS domain_expansion_db;
USE domain_expansion_db;

-- Step 2: Drop existing tables if re-initialising
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS domains;

-- Step 3: Create Domains Table
CREATE TABLE domains (
    domain_id INT PRIMARY KEY AUTO_INCREMENT,
    domain_code VARCHAR(10) UNIQUE NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    topics TEXT NOT NULL,
    is_dominant BOOLEAN DEFAULT FALSE
);

-- Step 4: Create Registrations Table
CREATE TABLE registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    ieee_interest ENUM('YES', 'NO') NOT NULL,
    whatsapp_number VARCHAR(15) NOT NULL UNIQUE,
    assigned_domain_id INT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_domain_id) REFERENCES domains(domain_id) ON DELETE SET NULL
);

-- Step 5: Create Submissions & Performance Table
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    round_number INT NOT NULL CHECK (round_number IN (1, 2)),
    ai_prompt_text TEXT,
    generated_image_url VARCHAR(500),
    time_taken_seconds INT,
    raised_hand_flag BOOLEAN DEFAULT FALSE,
    speed_points INT DEFAULT 0,
    creativity_score DECIMAL(4,2) DEFAULT 0.00,
    relevance_score DECIMAL(4,2) DEFAULT 0.00,
    total_round_score DECIMAL(5,2) GENERATED ALWAYS AS (speed_points + creativity_score + relevance_score) STORED,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- SAMPLE DATA POPULATION
-- ---------------------------------------------------------------------
INSERT INTO domains (domain_code, domain_name, topics, is_dominant) VALUES
('DOM-01', 'General Knowledge, Movies & Music', 'GK, Cinema, Pop Culture, Music', FALSE),
('DOM-02', 'Cyber Security, History & Sports', 'Cyber Safety, Historical Events, Sports', FALSE),
('DOM-03', 'Technology & Artificial Intelligence', 'AI, Future Tech, Neural Networks', TRUE);

INSERT INTO registrations (full_name, college_name, department, ieee_interest, whatsapp_number, assigned_domain_id) VALUES
('Aravind Kumar', 'Jeppiaar Engineering College', 'AIDS', 'YES', '9876543210', 3),
('Priya Dharshini', 'Jeppiaar Engineering College', 'CSE', 'YES', '9876543211', 1),
('Rahul Sharma', 'Anna University', 'ECE', 'NO', '9876543212', 2),
('Kavya Rajesh', 'Jeppiaar Engineering College', 'IT', 'YES', '9876543213', 3);

-- Round 1 Submissions (Image Generation)
INSERT INTO submissions (registration_id, round_number, generated_image_url, time_taken_seconds, raised_hand_flag, speed_points, creativity_score, relevance_score) VALUES
(1, 1, 'https://domainexpansion.org/img1.jpg', 120, TRUE, 1, 9.5, 9.5),
(2, 1, 'https://domainexpansion.org/img2.jpg', 180, FALSE, 0, 8.5, 9.0),
(3, 1, 'https://domainexpansion.org/img3.jpg', 210, FALSE, 0, 7.5, 8.0),
(4, 1, 'https://domainexpansion.org/img4.jpg', 140, FALSE, 0, 9.0, 9.0);

-- Round 2 Submissions (Prompt Creation)
INSERT INTO submissions (registration_id, round_number, ai_prompt_text, time_taken_seconds, raised_hand_flag, speed_points, creativity_score, relevance_score) VALUES
(1, 2, 'Cyberpunk neon AI core floating in dark obsidian space, 8k resolution', 150, TRUE, 1, 9.8, 9.7),
(2, 2, 'Vintage movie poster with holographic musical notes', 200, FALSE, 0, 8.8, 8.5),
(3, 2, 'Futuristic cyber shield grid with matrix code background', 230, FALSE, 0, 8.0, 8.0),
(4, 2, 'Neural network AI brain core with glowing red light streams', 160, FALSE, 0, 9.2, 9.1);


-- =====================================================================
-- THE OVERALL MASTER ANALYTICS & LEADERBOARD QUERY
-- =====================================================================
SELECT 
    DENSE_RANK() OVER (ORDER BY (COALESCE(r1.total_round_score, 0) + COALESCE(r2.total_round_score, 0)) DESC, (COALESCE(r1.speed_points, 0) + COALESCE(r2.speed_points, 0)) DESC) AS `RANK`,
    reg.registration_id AS `ID`,
    reg.full_name AS `PARTICIPANT NAME`,
    reg.college_name AS `COLLEGE`,
    reg.department AS `DEPT`,
    reg.whatsapp_number AS `WHATSAPP`,
    reg.ieee_interest AS `IEEE INTEREST`,
    dom.domain_name AS `ASSIGNED DOMAIN`,
    
    -- Round 1 Performance
    COALESCE(r1.time_taken_seconds, 0) AS `R1 TIME (SEC)`,
    COALESCE(r1.speed_points, 0) AS `R1 SPEED PTS`,
    COALESCE(r1.total_round_score, 0.00) AS `R1 SCORE`,
    
    -- Round 2 Performance
    COALESCE(r2.time_taken_seconds, 0) AS `R2 TIME (SEC)`,
    COALESCE(r2.speed_points, 0) AS `R2 SPEED PTS`,
    COALESCE(r2.total_round_score, 0.00) AS `R2 SCORE`,
    
    -- Overall Aggregate Performance
    (COALESCE(r1.speed_points, 0) + COALESCE(r2.speed_points, 0)) AS `TOTAL SPEED POINTS`,
    (COALESCE(r1.total_round_score, 0.00) + COALESCE(r2.total_round_score, 0.00)) AS `FINAL OVERALL SCORE`

FROM registrations reg
LEFT JOIN domains dom ON reg.assigned_domain_id = dom.domain_id
LEFT JOIN submissions r1 ON reg.registration_id = r1.registration_id AND r1.round_number = 1
LEFT JOIN submissions r2 ON reg.registration_id = r2.registration_id AND r2.round_number = 2
ORDER BY `FINAL OVERALL SCORE` DESC, `TOTAL SPEED POINTS` DESC;
