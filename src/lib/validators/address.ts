import { z } from 'zod';

// Zod Schemas for Address Validation
export const addressSchema = z.object({
  salutation: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  keywords: z.string().optional(),
  searchTerms: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal('')), // Allow empty string or valid URL
});

export const updateAddressSchema = addressSchema.partial();