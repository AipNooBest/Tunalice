DROP TABLE IF EXISTS solved;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS theories;
DROP TABLE IF EXISTS users;

CREATE TABLE solved
(
    task_id int NOT NULL UNIQUE,
    user_id int NOT NULL UNIQUE
) WITHOUT OIDS;


CREATE TABLE tasks
(
    id serial NOT NULL UNIQUE,
    name varchar(100) NOT NULL UNIQUE,
    difficulty int NOT NULL,
    path text NOT NULL UNIQUE,
    theory_id int NOT NULL,
    PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE theories
(
    id serial NOT NULL UNIQUE,
    path text NOT NULL UNIQUE,
    -- Примеры:
    -- SSRF, XXE
    theme varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE TABLE users
(
    id serial NOT NULL UNIQUE,
    username varchar(100) NOT NULL UNIQUE,
    email varchar(100) NOT NULL UNIQUE,
    registration_date date NOT NULL,
    -- Алгоритм хэширования паролей: argon2i
    password char(100) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) WITHOUT OIDS;



/* Create Foreign Keys */

ALTER TABLE solved
    ADD FOREIGN KEY (task_id)
        REFERENCES tasks (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
;


ALTER TABLE tasks
    ADD FOREIGN KEY (theory_id)
        REFERENCES theories (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
;


ALTER TABLE solved
    ADD FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
;



/* Comments */

COMMENT ON COLUMN theories.theme IS 'Примеры:
SSRF, XXE';
COMMENT ON COLUMN users.password IS 'Алгоритм хэширования паролей: argon2i';



