// Database table type definitions for Supabase

export type PropertyCategory = 'Residential Land' | 'Commercial Land' | 'Agricultural Land' | 'Investment Land';
export type PropertyStatus = 'Pending Verification' | 'Approved' | 'Rejected';

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  price_etb: number;
  land_size_sqm: number;
  city: string;
  location: string;
  images: string[];
  video_url?: string;
  ownership_document_url?: string;
  broker_id: string;
  broker_name: string;
  broker_agency?: string;
  broker_photo?: string;
  broker_phone: string;
  broker_email: string;
  broker_verified: boolean;
  status: PropertyStatus;
  views_count: number;
  average_rating: number;
  total_reviews: number;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'Active' | 'Expired' | 'Pending';
export type SubscriptionPlan = 'Basic Broker' | 'Pro Broker' | 'Enterprise Agency';

export interface Broker {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  agency_name?: string;
  biography?: string;
  profile_photo?: string;
  rating: number;
  total_reviews: number;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_expiration?: string;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = 'New' | 'Contacted' | 'Closed';

export interface Application {
  id: string;
  property_id: string;
  property_title: string;
  broker_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  is_diaspora: boolean;
  preferred_contact: 'WhatsApp' | 'Phone' | 'Email' | 'Telegram';
  message: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
export type MessageSubject = 'Land Inquiry' | 'Diaspora Assistance' | 'Broker Partnership' | 'Other';

export interface Message {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  subject: MessageSubject;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'broker' | 'admin';
  broker_id?: string;
  created_at: string;
  updated_at: string;
}

// Database response types
export type DbResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type DbResponseArray<T> = {
  data: T[] | null;
  error: Error | null;
};

// Filter types for queries
export interface PropertyFilters {
  location?: string;
  city?: string;
  category?: PropertyCategory;
  min_price?: number;
  max_price?: number;
  min_land_size?: number;
  max_land_size?: number;
  status?: PropertyStatus;
  broker_verified?: boolean;
  featured?: boolean;
}

export interface ApplicationFilters {
  property_id?: string;
  broker_id?: string;
  status?: string;
  applicant_email?: string;
}

export interface MessageFilters {
  property_id?: string;
  broker_id?: string;
  status?: string;
  email?: string;
}
