export const ProductTableModel = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    images VARCHAR(255),
    category_id INT REFERENCES categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`;
