-- Drop in reverse order of dependencies
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TYPE IF EXISTS account_type;

-- Create ENUM type
CREATE TYPE account_type AS ENUM ('Admin', 'Employee', 'Client');

-- Create classification table
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- Populate classification
INSERT INTO classification (classification_name)
VALUES ('Sport'), ('SUV'), ('Truck'), ('Sedan');

-- Create inventory table
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_year INT NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(100),
  inv_thumbnail VARCHAR(100),
  inv_price NUMERIC(10, 2),
  inv_miles INT,
  inv_color VARCHAR(30),
  classification_id INT REFERENCES classification(classification_id)
);

-- Populate inventory
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles,
  inv_color, classification_id
) VALUES 
  ('GM', 'Hummer', 2022, 'Big powerful vehicle with small interiors',
   '/images/hummer.jpg', '/images/hummer-thumb.jpg', 55000, 10000, 'Black', 2),
  ('Ford', 'Mustang', 2023, 'Fast and sporty',
   '/images/mustang.jpg', '/images/mustang-thumb.jpg', 47000, 5000, 'Red', 1);

-- Create account table
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password VARCHAR(100) NOT NULL,
  account_type account_type DEFAULT 'Client'
);

-- === TASK 1 Query 4 ===
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- === TASK 1 Query 6 ===
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
