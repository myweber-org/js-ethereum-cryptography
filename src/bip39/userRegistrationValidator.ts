import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  dateOfBirth: z.date().refine(date => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 13;
  }, 'You must be at least 13 years old')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type RegistrationData = z.infer<typeof registrationSchema>;

export function validateRegistration(data: unknown): RegistrationData {
  return registrationSchema.parse(data);
}

export function getValidationErrors(data: unknown): string[] {
  try {
    registrationSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Please provide a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  birthDate: z.date()
    .max(new Date(), 'Birth date cannot be in the future')
    .refine(date => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 13;
    }, 'You must be at least 13 years old to register'),
  
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
});

export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
  return UserRegistrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    UserRegistrationSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => err.message);
    }
    return ['An unexpected validation error occurred'];
  }
}