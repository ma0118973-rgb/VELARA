-- Run this SQL in your Neon Database SQL Editor to create the table

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert a test article
INSERT INTO articles (title, content, category) 
VALUES ('Welcome to your new DB', 'This article is stored in Neon Postgres!', 'General');
