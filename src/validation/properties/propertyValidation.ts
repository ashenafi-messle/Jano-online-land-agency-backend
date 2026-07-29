import { z } from 'zod';
import { PropertyCategory, PropertyStatus } from '../../types/database';

export const createPropertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.enum(['Residential Land', 'Commercial Land', 'Agricultural Land', 'Investment Land']),
  price_etb: z.number().positive('Price must be positive').min(1000, 'Price must be at least 1000 ETB'),
  land_size_sqm: z.number().positive('Land size must be positive').min(1, 'Land size must be at least 1 sqm'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City must be less than 100 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters').max(255, 'Location must be less than 255 characters'),
  images: z.array(z.string().url('Each image must be a valid URL')).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  video_url: z.string().url('Video URL must be valid').optional(),
  ownership_document_url: z.string().url('Document URL must be valid').optional(),
  broker_id: z.string().uuid('Invalid broker ID'),
  broker_name: z.string().min(2, 'Broker name must be at least 2 characters'),
  broker_agency: z.string().optional(),
  broker_photo: z.string().url('Broker photo must be valid URL').optional(),
  broker_phone: z.string().min(10, 'Phone number must be at least 10 characters').max(20, 'Phone number must be less than 20 characters'),
  broker_email: z.string().email('Invalid email address'),
  broker_verified: z.boolean().default(false),
  status: z.enum(['Pending Verification', 'Approved', 'Rejected']).default('Pending Verification'),
  featured: z.boolean().default(false),
});

export const updatePropertySchema = z.object({
  title: z.string().min(10).max(255).optional(),
  description: z.string().min(20).max(5000).optional(),
  category: z.enum(['Residential Land', 'Commercial Land', 'Agricultural Land', 'Investment Land']).optional(),
  price_etb: z.number().positive().min(1000).optional(),
  land_size_sqm: z.number().positive().min(1).optional(),
  city: z.string().min(2).max(100).optional(),
  location: z.string().min(5).max(255).optional(),
  images: z.array(z.string().url()).min(1).max(10).optional(),
  video_url: z.string().url().optional(),
  ownership_document_url: z.string().url().optional(),
  status: z.enum(['Pending Verification', 'Approved', 'Rejected']).optional(),
  featured: z.boolean().optional(),
});

export const getPropertyQuerySchema = z.object({
  city: z.string().optional(),
  category: z.enum(['Residential Land', 'Commercial Land', 'Agricultural Land', 'Investment Land']).optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  min_size: z.number().positive().optional(),
  max_size: z.number().positive().optional(),
  broker_verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  sort_by: z.enum(['created_at', 'price_etb', 'land_size_sqm', 'views_count']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type GetPropertyQuery = z.infer<typeof getPropertyQuerySchema>;
