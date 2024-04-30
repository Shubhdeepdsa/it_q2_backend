### DAX

#### Status Table
- status_id (UUID): Primary key, generated every time, a unique identifier for the status.
- entity_type (TEXT): Type of entity associated with the status (e.g., Order, Shipping, Payment).
- entity_state (TEXT): State of the entity (e.g., Processing, Shipped, Delivered, Cancelled).
- status_remark (TEXT): Additional remarks or notes related to the status.

#### Inventory Table
- Inventory_id (UUID): Primary key, a unique identifier for the inventory item.
- product_id (UUID): Foreign key referencing the product associated with the inventory.
- location_id (UUID): Foreign key referencing the location where the inventory is stored.
- quantity (INTEGER): The quantity of the product available in the inventory.
- last_updated (TIMESTAMP): Timestamp indicating the last time the inventory was updated.

#### Shipping Table
- shipping_id (UUID): Primary key, generated every time, uniquely identifying each shipping record.
- customer_id (UUID): Foreign key referencing the Customer table, identifying the customer associated with the shipment.
- shipping_address (TEXT): Address to which the shipment is delivered.
- shipping_method (TEXT): Method used for shipping, such as standard, express, etc.
- shipping_cost (NUMERIC): Cost associated with shipping the order.
- shipping_status_id (UUID): Foreign key referencing the ShippingStatus table, indicating the current status of the shipment.
- shipping_date (TIMESTAMP): Date and time when the shipment was initiated.
- tracking_id (TEXT): Tracking ID or number for tracking the shipment.
- shipment_fulfiller_id (UUID): Identifier for the entity responsible for fulfilling the shipment.

#### Preference Table
- preference_id (UUID): Primary key, generated every time, a unique identifier for the preference.
- customer_id (UUID): Foreign key referencing the Customer table, identifying the customer associated with the preference.
- size (TEXT): Preferred size for items.
- style (TEXT): Preferred style or fashion preference.
- brands (TEXT): Preferred brands for items.
- occasion (TEXT): Occasions for which the preference applies.

#### Payment Table
- payment_id (UUID): Primary key, unique identifier for the payment
- order_id (UUID): Foreign key referencing the order associated with the payment
- payment_method (VARCHAR(50)): The payment method used (e.g., credit card, PayPal, etc.)
- payment_amount (DECIMAL(10,2)): The total amount paid for the order
- transaction_id (VARCHAR(100)): The unique identifier for the transaction provided by the payment gateway
- payment_status (VARCHAR(20)): The status of the payment (e.g., pending, completed, failed)
- payment_timestamp (TIMESTAMP): The date and time when the payment was made

#### Orders Table
- Order_id (UUID): Primary key, generated every time, a unique identifier for the order.
- customer_id (UUID): Foreign key referencing the customer who placed the order.
- shipping_id (UUID): Foreign key referencing the shipping details associated with the order.
- status_id (UUID): Foreign key referencing the status of the order.
- placed_on (TIMESTAMP): The timestamp indicating when the order was placed.
- billing_id (UUID): Foreign key referencing the billing details associated with the order.

#### Review Table
- review_id (UUID): Primary key, a unique identifier for the review.
- product_id (UUID): Foreign key referencing the product associated with the review.
- customer_id (UUID): Foreign key referencing the customer who wrote the review.
- rating (INTEGER): The rating given by the customer (e.g., 1 to 5 stars).
- review_content (TEXT): The written content of the review.
- review_images (TEXT[]): An array of URLs or file paths for images attached to the review.
- review_likes (INTEGER): The number of likes or upvotes the review has received.
- review_tags (TEXT[]): An array of tags associated with the review, for categorization or filtering purposes.

#### Customer Table
- customer_id (UUID): Primary key, generated every time, a unique identifier for the customer.
- profile_pic (VARCHAR): The URL or path to the customer's profile picture.
- first_name (VARCHAR): The first name of the customer.
- last_name (VARCHAR): The last name of the customer.
- password (VARCHAR): The password for the customer's account.
- address_line_1 (VARCHAR): The first line of the customer's address.
- address_line_2 (VARCHAR): The second line of the customer's address (optional).
- customer_pincode (VARCHAR): The postal code of the customer's address.
- customer_country (VARCHAR): The country of the customer's address.
- customer_gender (VARCHAR): The gender of the customer.
- customer_primary_phone (VARCHAR): The primary phone number of the customer.
- customer_alternate_phone (VARCHAR): The alternate phone number of the customer (optional).
- customer_email (VARCHAR): The email address of the customer.
- customer_dob (DATE): The date of birth of the customer.
- customer_type (VARCHAR): Indicates the type of customer (e.g., VIP, normal, influencer).

#### Order Item Table
- order_item_id (UUID): Primary key, generated every time, a unique identifier for the order item.
- order_id (UUID): Foreign key referencing the order to which the item belongs.
- shipping_id (UUID): Foreign key referencing the shipping details associated with the order item.
- current_status (TEXT): The current status of the order item.
- status_id (UUID): Foreign key referencing the status of the order item.
- placed_on (TIMESTAMP): The timestamp indicating when the order item was placed.
-

 item_quantity (INTEGER): The quantity of the item ordered.
- item_details (JSON): Additional details about the item, including size and variant/color.
- size (TEXT): Size of the item.
- variant/color (TEXT): Variant or color of the item.
- product_id (UUID): Foreign key referencing the product associated with the order item.


```

-- Status Table
CREATE TABLE Status (
    status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT,
    entity_state TEXT,
    status_remark TEXT
);

-- Inventory Table
CREATE TABLE Inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES Product(product_id),
    location_id UUID REFERENCES Location(location_id),
    quantity INTEGER,
    last_updated TIMESTAMP
);

-- Shipping Table
CREATE TABLE Shipping (
    shipping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES Customer(customer_id),
    shipping_address TEXT,
    shipping_method TEXT,
    shipping_cost NUMERIC,
    shipping_status_id UUID REFERENCES ShippingStatus(status_id),
    shipping_date TIMESTAMP,
    tracking_id TEXT,
    shipment_fulfiller_id UUID
);

-- Preference Table
CREATE TABLE Preference (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES Customer(customer_id),
    size TEXT,
    style TEXT,
    brands TEXT,
    occasion TEXT
);

-- Payment Table
CREATE TABLE Payment (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES Orders(order_id),
    payment_method VARCHAR(50),
    payment_amount DECIMAL(10,2),
    transaction_id VARCHAR(100),
    payment_status VARCHAR(20),
    payment_timestamp TIMESTAMP
);

-- Orders Table
CREATE TABLE Orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES Customer(customer_id),
    shipping_id UUID REFERENCES Shipping(shipping_id),
    status_id UUID REFERENCES Status(status_id),
    placed_on TIMESTAMP,
    billing_id UUID
);

-- Review Table
CREATE TABLE Review (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES Product(product_id),
    customer_id UUID REFERENCES Customer(customer_id),
    rating INTEGER,
    review_content TEXT,
    review_images TEXT[],
    review_likes INTEGER,
    review_tags TEXT[]
);

-- Customer Table
CREATE TABLE Customer (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_pic VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    password VARCHAR,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    customer_pincode VARCHAR,
    customer_country VARCHAR,
    customer_gender VARCHAR,
    customer_primary_phone VARCHAR,
    customer_alternate_phone VARCHAR,
    customer_email VARCHAR,
    customer_dob DATE,
    customer_type VARCHAR
);

-- Order Item Table
CREATE TABLE Order_Item (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES Orders(order_id),
    shipping_id UUID REFERENCES Shipping(shipping_id),
    current_status TEXT,
    status_id UUID REFERENCES Status(status_id),
    placed_on TIMESTAMP,
    item_quantity INTEGER,
    item_details JSONB,
    size TEXT,
    variant_color TEXT,
    product_id UUID REFERENCES Product(product_id)
);


```