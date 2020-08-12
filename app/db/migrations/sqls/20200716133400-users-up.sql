CREATE TABLE users (
   id UUID PRIMARY KEY,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     email_address VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR NOT NULL,
        salt VARCHAR(255) NULL,
     created_at timestamp DEFAULT NOW(),
     updated_at timestamp DEFAULT NOW());
