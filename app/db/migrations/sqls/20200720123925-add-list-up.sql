CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    user_id  uuid  REFERENCES users(id) NOT NULL,
    title VARCHAR(100) NOT NULL
);

CREATE TYPE keep_task_status AS ENUM('pending', 'completed');
 
 CREATE TABLE items (
     id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES list(id) ON DELETE CASCADE NOT NULL,
    task VARCHAR(100) NOT NULL,
    status keep_task_status ,
     due_date TIMESTAMP NOT NULL,
     created_at DATE DEFAULT now(),
     updated_at DATE DEFAULT now()

 );


 
 CREATE UNIQUE INDEX title_index ON list(title text_pattern_ops);