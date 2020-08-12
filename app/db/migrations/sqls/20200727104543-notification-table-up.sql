CREATE TYPE read_notification AS ENUM('yes', 'no');

CREATE TABLE IF NOT EXISTS notifications(
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES items(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  seen_by_user read_notification,
  created_at DATE DEFAULT now()
) 