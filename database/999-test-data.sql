-- Теория
INSERT INTO theories (id, path, theme) VALUES ('1', 'sql-injection/part-1.md', 'SQL Injection');

-- Задание
INSERT INTO tasks (id, name, difficulty, path, theory_id) VALUES ('1', 'SQL-1', '1', 'sql-injection-1', '1');

-- Пользователь
INSERT INTO users (id, username, email, registration_date, password) VALUES ('1', 'test_user', 'test@user.ru', '04-14-2024', '$argon2i$v=19$m=4096,t=3,p=1$c29tZXNhbHQ$1KqgSFUBrI/2h92QYFGjBKvIMR+8/7cfP/a9R3f/cx8$argon2i$v=19$m=4096,t=3,p=1$c29tZXNhbHQ$1KqgSFUBrI/2h92QYFGjBKvIMR+8/7cfP/a9R3f/cx8');

-- Решённые задачи
INSERT INTO solved (task_id, user_id) VALUES ('1', '1');
