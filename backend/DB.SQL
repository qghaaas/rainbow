CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE "User"
ADD COLUMN delivery_address VARCHAR(255);

ALTER TABLE "User"
ADD COLUMN favorite_products JSONB DEFAULT '[]';

ALTER TABLE "User"
ADD COLUMN phone_number VARCHAR(20);

CREATE TABLE Catalog (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    category VARCHAR(50),
    manufacturer VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO Catalog (image_path, product_name, price, category, manufacturer, in_stock)
VALUES 
    ('/src/HomePage/img/grunt1.jpg', 'Грунт для рассады', 159, 'Грунт', 'АгроМир', true),
    ('/src/HomePage/img/grunt2.jpg', 'Другой грунт для рассады', 99, 'Грунт', 'Зелёная Линия', true),
    ('/src/HomePage/img/сombicorm.jpg', 'Комбикорм для свиней', 199.99, 'Комбикорм', 'Фермер-Про', false),
    ('/src/HomePage/img/combicorm2.jpg', 'Комбикорм для кур', 100, 'Комбикорм', 'СельхозПром', true);

CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO Categories (name)
SELECT DISTINCT category FROM Catalog WHERE category IS NOT NULL;

INSERT INTO Manufacturers (name)
SELECT DISTINCT manufacturer FROM Catalog WHERE manufacturer IS NOT NULL;

CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES Catalog(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    price_at_adding DECIMAL(10, 2) NOT NULL,  
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    item_total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price_at_adding) STORED
);

CREATE OR REPLACE FUNCTION set_cart_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.price_at_adding = (SELECT price FROM catalog WHERE id = NEW.product_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_cart_price
BEFORE INSERT ON Cart
FOR EACH ROW
EXECUTE FUNCTION set_cart_price();

CREATE INDEX idx_cart_user ON Cart(user_id);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "User"(id),
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE orders
ADD COLUMN delivery_method VARCHAR(20),
ADD COLUMN delivery_date DATE;

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES catalog(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    UNIQUE (order_id, product_id)
);

SELECT 
    c.*,
    (SELECT COUNT(*) FROM order_items WHERE product_id = c.id) AS total_orders 
FROM catalog c
WHERE (SELECT COUNT(*) FROM order_items WHERE product_id = c.id) >= 3
ORDER BY total_orders DESC
LIMIT 20;

INSERT INTO orders (user_id, items, total)
VALUES (1, '[{"product_id":1,"quantity":3}]', 477);

INSERT INTO order_items (order_id, product_id, quantity)
VALUES (1, 1, 3);

INSERT INTO "User" (id, first_name, last_name, email, password)
VALUES (1, 'Иван', 'Иванов', 'ivan@example.com', 'securepassword');