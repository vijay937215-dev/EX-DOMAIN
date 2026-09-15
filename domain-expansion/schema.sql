-- =====================================================================
-- DOMAIN EXPANSION: AI PROMPT CHALLENGE
-- DATABASE SCHEMA & SQL QUERIES
-- Supported Databases: MySQL / PostgreSQL / SQLite / SQL Server
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. DOMAINS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS domains (
    domain_id INT PRIMARY KEY AUTO_INCREMENT,
    domain_code VARCHAR(10) UNIQUE NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    topics TEXT NOT NULL,
    focus_description TEXT NOT NULL,
    is_dominant BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate official domains
INSERT INTO domains (domain_code, domain_name, topics, focus_description, is_dominant) VALUES
('DOM-01', 'General Knowledge, Movies & Music', 'General Knowledge, Movies, Music', 'Creative AI image generation based on general awareness, cinema, and music.', FALSE),
('DOM-02', 'Cyber Security, History & Sports', 'Cyber Security, History, Sports', 'Creative AI image generation based on digital safety, historical events, and sports.', FALSE),
('DOM-03', 'Technology & Artificial Intelligence', 'Technology, Emerging Tech, Artificial Intelligence', 'Creative AI image generation based on technology, emerging tech, and AI.', TRUE);


-- ---------------------------------------------------------------------
-- 2. REGISTRATIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    ieee_interest ENUM('YES', 'NO') NOT NULL,
    whatsapp_number VARCHAR(15) NOT NULL UNIQUE,
    assigned_domain_id INT,
    registration_status ENUM('PENDING', 'CONFIRMED', 'ATTENDED') DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_domain_id) REFERENCES domains(domain_id) ON DELETE SET NULL
);


-- ---------------------------------------------------------------------
-- 3. ROUND SUBMISSIONS & SCORING TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    round_number INT NOT NULL CHECK (round_number IN (1, 2)),
    ai_prompt_text TEXT,
    generated_image_url VARCHAR(500),
    time_taken_seconds INT,
    raised_hand_timestamp TIMESTAMP NULL,
    speed_points INT DEFAULT 0,
    judge_creativity_score DECIMAL(4,2) DEFAULT 0.00,
    judge_relevance_score DECIMAL(4,2) DEFAULT 0.00,
    total_score DECIMAL(5,2) GENERATED ALWAYS AS (speed_points + judge_creativity_score + judge_relevance_score) STORED,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE
);


-- =====================================================================
-- COMMON PRODUCTION SQL QUERIES
-- =====================================================================

-- Query 1: Insert a New Participant Registration (From Website Form)
INSERT INTO registrations (full_name, college_name, department, ieee_interest, whatsapp_number, assigned_domain_id)
VALUES ('Aravind Kumar', 'Jeppiaar Engineering College', 'AIDS', 'YES', '9876543210', 3);

-- Query 2: Retrieve All Registered Participants
SELECT 
    r.registration_id,
    r.full_name,
    r.college_name,
    r.department,
    r.ieee_interest,
    r.whatsapp_number,
    d.domain_name AS assigned_domain,
    r.created_at
FROM registrations r
LEFT JOIN domains d ON r.assigned_domain_id = d.domain_id
ORDER BY r.created_at DESC;

-- Query 3: Retrieve Participants Interested in Joining IEEE
SELECT 
    full_name,
    college_name,
    department,
    whatsapp_number
FROM registrations
WHERE ieee_interest = 'YES'
ORDER BY full_name ASC;

-- Query 4: Record Round 1 Submission & Speed Point
INSERT INTO submissions (registration_id, round_number, generated_image_url, time_taken_seconds, raised_hand_timestamp, speed_points, judge_creativity_score, judge_relevance_score)
VALUES (1, 1, 'https://storage.googleapis.com/domain-expansion/submissions/img_001.jpg', 145, CURRENT_TIMESTAMP, 1, 9.5, 9.0);

-- Query 5: Record Round 2 Prompt Creation Submission
INSERT INTO submissions (registration_id, round_number, ai_prompt_text, time_taken_seconds, speed_points, judge_creativity_score, judge_relevance_score)
VALUES (1, 2, 'Cyberpunk neon AI core floating over obsidian digital city, 8k resolution, volumetric lighting', 180, 0, 9.8, 9.6);

-- Query 6: Leaderboard Query (Top Winners Across Both Rounds)
SELECT 
    r.full_name,
    r.college_name,
    r.department,
    SUM(s.speed_points) AS total_speed_points,
    SUM(s.judge_creativity_score) AS total_creativity,
    SUM(s.judge_relevance_score) AS total_relevance,
    SUM(s.total_score) AS overall_score
FROM registrations r
JOIN submissions s ON r.registration_id = s.registration_id
GROUP BY r.registration_id, r.full_name, r.college_name, r.department
ORDER BY overall_score DESC, total_speed_points DESC;

-- Query 7: Registration Count & IEEE Interest Stats Overview
SELECT 
    COUNT(*) AS total_registered,
    SUM(CASE WHEN ieee_interest = 'YES' THEN 1 ELSE 0 END) AS interested_in_ieee,
    SUM(CASE WHEN ieee_interest = 'NO' THEN 1 ELSE 0 END) AS not_interested_in_ieee
FROM registrations;
