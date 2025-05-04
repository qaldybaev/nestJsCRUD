export const OrderTableModel = `
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) 
    ON DELETE CASCADE ON UPDATE NO ACTION,
  user_id INT REFERENCES users(id) 
    ON DELETE CASCADE ON UPDATE NO ACTION,
  count INT NOT NULL
);
`;
