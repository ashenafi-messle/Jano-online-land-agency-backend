-- Properties Table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Residential Land', 'Commercial Land', 'Agricultural Land', 'Investment Land')),
  price_etb DECIMAL(15, 2) NOT NULL,
  land_size_sqm DECIMAL(10, 2) NOT NULL,
  city VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  images TEXT[] NOT NULL,
  video_url TEXT,
  ownership_document_url TEXT,
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  broker_name VARCHAR(255) NOT NULL,
  broker_agency VARCHAR(255),
  broker_photo TEXT,
  broker_phone VARCHAR(20) NOT NULL,
  broker_email VARCHAR(255) NOT NULL,
  broker_verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'Pending Verification' CHECK (status IN ('Pending Verification', 'Approved', 'Rejected')),
  views_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_broker_id ON properties(broker_id);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_price ON properties(price_etb);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Full-text search index
CREATE INDEX idx_properties_search ON properties USING GIN (
  to_tsvector('english', title || ' ' || description || ' ' || location || ' ' || city)
);

-- Brokers Table
-- Auth will be handled by Supabase Auth (auth.users table)
CREATE TABLE brokers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  agency_name VARCHAR(255),
  biography TEXT,
  profile_photo TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  subscription_plan VARCHAR(50) DEFAULT 'Basic Broker' CHECK (subscription_plan IN ('Basic Broker', 'Pro Broker', 'Enterprise Agency')),
  subscription_status VARCHAR(50) DEFAULT 'Active' CHECK (subscription_status IN ('Active', 'Expired', 'Pending')),
  subscription_expiration TIMESTAMP WITH TIME ZONE,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for brokers
CREATE INDEX idx_brokers_email ON brokers(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON brokers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
-- Note: Users should be created via Supabase Auth first, then linked to brokers table
-- For testing, we'll insert broker records that can be linked to auth users
INSERT INTO brokers (id, full_name, email, phone, address, agency_name, profile_photo) VALUES
('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', '+251911123456', 'Addis Ababa, Bole', 'Ethio Properties', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', '+251922234567', 'Addis Ababa, Kazanchis', 'Prime Land Agency', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200');

INSERT INTO properties (title, description, category, price_etb, land_size_sqm, city, location, images, broker_id, broker_name, broker_agency, broker_photo, broker_phone, broker_email, broker_verified, status, featured) VALUES
('Prime Residential Land in Bole', 'Beautiful residential land located in the heart of Bole, near major amenities. Perfect for building your dream home.', 'Residential Land', 2500000.00, 500.00, 'Addis Ababa', 'Bole, Ring Road area', ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'], 
 (SELECT id FROM brokers WHERE email = 'john@example.com'), 'John Doe', 'Ethio Properties', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '+251911123456', 'john@example.com', true, 'Approved', true),
('Commercial Land in Kazanchis', 'Excellent commercial land in Kazanchis business district. High visibility and great investment opportunity.', 'Commercial Land', 5000000.00, 1000.00, 'Addis Ababa', 'Kazanchis, near Bole Rd', ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'], 
 (SELECT id FROM brokers WHERE email = 'jane@example.com'), 'Jane Smith', 'Prime Land Agency', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', '+251922234567', 'jane@example.com', true, 'Approved', true),
('Agricultural Land in Bishoftu', 'Fertile agricultural land in Bishoftu with water access. Ideal for farming or investment.', 'Agricultural Land', 1500000.00, 2000.00, 'Bishoftu', 'Near Lake Hora', ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], 
 (SELECT id FROM brokers WHERE email = 'john@example.com'), 'John Doe', 'Ethio Properties', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '+251911123456', 'john@example.com', true, 'Approved', false);

-- Applications Table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  property_title VARCHAR(255) NOT NULL,
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_diaspora BOOLEAN DEFAULT FALSE,
  preferred_contact VARCHAR(50) NOT NULL CHECK (preferred_contact IN ('WhatsApp', 'Phone', 'Email', 'Telegram')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for applications
CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_broker_id ON applications(broker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Trigger for applications updated_at
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample application data
INSERT INTO applications (property_id, property_title, broker_id, full_name, email, phone, country, is_diaspora, preferred_contact, message, status) VALUES
((SELECT id FROM properties WHERE title = 'Prime Residential Land in Bole'), 'Prime Residential Land in Bole', (SELECT id FROM brokers WHERE email = 'john@example.com'), 'Dr. Solomon Haile', 'solomon.haile@gmail.com', '+1 (240) 555-0199', 'USA (Diaspora)', true, 'WhatsApp', 'I am interested in acquiring this property. Please send land title deed copy and verification details.', 'New'),
((SELECT id FROM properties WHERE title = 'Commercial Land in Kazanchis'), 'Commercial Land in Kazanchis', (SELECT id FROM brokers WHERE email = 'jane@example.com'), 'Abebe Kebede', 'abebe.kebede@yahoo.com', '+251 91 234 5678', 'Ethiopia', false, 'Phone', 'I would like to schedule a site visit for this commercial property.', 'Contacted');

-- Messages Table (Contact Us Form)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100),
  subject VARCHAR(100) NOT NULL CHECK (subject IN ('Land Inquiry', 'Diaspora Assistance', 'Broker Partnership', 'Other')),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_email ON messages(email);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_subject ON messages(subject);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Trigger for messages updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample message data
INSERT INTO messages (full_name, email, phone, country, subject, message, status) VALUES
('Bethlehem Girma', 'bethlehem.girma@gmail.com', '+251 91 234 5678', 'Ethiopia', 'Land Inquiry', 'I am looking for residential land in the Bole area with a budget of 3 million ETB. Please send me available options.', 'New'),
('Michael Johnson', 'michael.johnson@yahoo.com', '+1 (415) 555-0123', 'USA (Diaspora)', 'Diaspora Assistance', 'I am interested in buying land in Ethiopia but need guidance on the legal process for diaspora buyers.', 'In Progress');

-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for password reset tokens
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_broker_id ON password_reset_tokens(broker_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Trigger for password reset tokens updated_at
CREATE TRIGGER update_password_reset_tokens_updated_at BEFORE UPDATE ON password_reset_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
