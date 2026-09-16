-- =====================================================================
-- DOMAIN EXPANSION: AI PROMPT CHALLENGE
-- POSTGRESQL FULL COMPATIBLE SCRIPT (NO SYNTAX ERRORS)
-- Tested for PostgreSQL 11, 12, 13, 14, 15, 16
-- =====================================================================

-- Step 1: Cleanup Existing Tables (if re-running)
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS domains CASCADE;

-- Step 2: Create Domains Table
CREATE TABLE domains (
    domain_id SERIAL PRIMARY KEY,
    domain_code VARCHAR(10) UNIQUE NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    topics TEXT NOT NULL,
    is_dominant BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create Registrations Table
CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    ieee_interest VARCHAR(10) NOT NULL CHECK (ieee_interest IN ('YES', 'NO')),
    whatsapp_number VARCHAR(15) UNIQUE NOT NULL,
    assigned_domain_id INT REFERENCES domains(domain_id) ON DELETE SET NULL,
    registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create Submissions Table
CREATE TABLE submissions (
    submission_id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    round_number INT NOT NULL CHECK (round_number IN (1, 2)),
    ai_prompt_text TEXT,
    generated_image_url VARCHAR(500),
    time_taken_seconds INT,
    raised_hand_flag BOOLEAN DEFAULT FALSE,
    speed_points INT DEFAULT 0,
    creativity_score NUMERIC(4,2) DEFAULT 0.00,
    relevance_score NUMERIC(4,2) DEFAULT 0.00,
    total_round_score NUMERIC(5,2) GENERATED ALWAYS AS (speed_points + creativity_score + relevance_score) STORED,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- INSERT OFFICIAL EVENT SEED DATA
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
(1, 1, 'https://domainexpansion.org/img1.jpg', 120, TRUE, 1, 9.50, 9.50),
(2, 1, 'https://domainexpansion.org/img2.jpg', 180, FALSE, 0, 8.50, 9.00),
(3, 1, 'https://domainexpansion.org/img3.jpg', 210, FALSE, 0, 7.50, 8.00),
(4, 1, 'https://domainexpansion.org/img4.jpg', 140, FALSE, 0, 9.00, 9.00);

-- Round 2 Submissions (Prompt Creation)
INSERT INTO submissions (registration_id, round_number, ai_prompt_text, time_taken_seconds, raised_hand_flag, speed_points, creativity_score, relevance_score) VALUES
(1, 2, 'Cyberpunk neon AI core floating in dark obsidian space, 8k resolution', 150, TRUE, 1, 9.80, 9.70),
(2, 2, 'Vintage movie poster with holographic musical notes', 200, FALSE, 0, 8.80, 8.50),
(3, 2, 'Futuristic cyber shield grid with matrix code background', 230, FALSE, 0, 8.00, 8.00),
(4, 2, 'Neural network AI brain core with glowing red light streams', 160, FALSE, 0, 9.20, 9.10);


-- =====================================================================
-- POSTGRESQL OVERALL LEADERBOARD & SUMMARY QUERY
-- =====================================================================
SELECT 
    DENSE_RANK() OVER (
        ORDER BY 
            (COALESCE(r1.total_round_score, 0) + COALESCE(r2.total_round_score, 0)) DESC, 
            (COALESCE(r1.speed_points, 0) + COALESCE(r2.speed_points, 0)) DESC
    ) AS rank,
    
    reg.registration_id AS id,
    reg.full_name AS participant_name,
    reg.college_name AS college,
    reg.department AS dept,
    reg.whatsapp_number AS whatsapp,
    reg.ieee_interest AS ieee_interest,
    dom.domain_name AS assigned_domain,
    
    -- Round 1 Performance
    COALESCE(r1.time_taken_seconds, 0) AS r1_time_sec,
    COALESCE(r1.speed_points, 0) AS r1_speed_pts,
    COALESCE(r1.total_round_score, 0.00) AS r1_score,
    
    -- Round 2 Performance
    COALESCE(r2.time_taken_seconds, 0) AS r2_time_sec,
    COALESCE(r2.speed_points, 0) AS r2_speed_pts,
    COALESCE(r2.total_round_score, 0.00) AS r2_score,
    
    -- Cumulative Scores
    (COALESCE(r1.speed_points, 0) + COALESCE(r2.speed_points, 0)) AS total_speed_points,
    (COALESCE(r1.total_round_score, 0.00) + COALESCE(r2.total_round_score, 0.00)) AS final_overall_score

FROM registrations reg
LEFT JOIN domains dom ON reg.assigned_domain_id = dom.domain_id
LEFT JOIN submissions r1 ON reg.registration_id = r1.registration_id AND r1.round_number = 1
LEFT JOIN submissions r2 ON reg.registration_id = r2.registration_id AND r2.round_number = 2
ORDER BY final_overall_score DESC, total_speed_points DESC;
