##### SQHEMA ######
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  filial INT NOT NULL CHECK (filial BETWEEN 1 AND 31),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, filial)
VALUES ('ita@aidealmodas.com.br', '$2b$10$jgfeFGZNI.TACAniuhZvEumHS/QSuedQSGgES4rjI/568HNuYickS', 21);

(senha é 123456)

##### NOVAS DEPENDENCIAS ######
npm install bcrypt jsonwebtoken
