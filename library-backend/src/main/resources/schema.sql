DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    biography  VARCHAR(1000),
    birth_year INT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE books
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    isbn             VARCHAR(255) NOT NULL UNIQUE,
    description      VARCHAR(1000),
    publication_year INT,
    available_copies INT DEFAULT 0,
    total_copies     INT DEFAULT 0,
    author_id        BIGINT       NOT NULL,
    created_at       DATETIME,
    updated_at       DATETIME,
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
);

INSERT INTO authors (first_name, last_name, biography, birth_year, created_at, updated_at)
VALUES ('Mohamed', 'Amine', 'Auteur marocaine.', 1999, NOW(), NOW()),
       ('Amine', 'Hajjouji', 'Auteur français.', 1998, NOW(), NOW()),
       ('Amine', 'Haj', 'Auteur Test.', 1999, NOW(), NOW());

-- Insert some sample data for books
INSERT INTO books (title, isbn, description, publication_year, available_copies, total_copies, author_id, created_at,
                   updated_at)
VALUES ('AmineBook', '1234567890', 'Nouvelle description', 2026, 5, 10, 1, NOW(), NOW()),
       ('AmineBook 2', '1234575950', 'Desc', 2024, 5, 10, 1, NOW(), NOW()),
       ('AmineBook 3', '1236587159', 'a book from Amine', 1999, 0, 10, 2, NOW(), NOW()),
       ('AmineBook 4', '4565456456', 'testooo', 2015, 10, 11, 3, NOW(), NOW());
