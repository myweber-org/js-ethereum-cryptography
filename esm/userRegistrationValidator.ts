import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  age: z.number().int().min(18, 'You must be at least 18 years old').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
  return userRegistrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    userRegistrationSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}import { z } from 'zod';

export const registrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  email: z.string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be from a .com domain'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type RegistrationData = z.infer<typeof registrationSchema>;

export function validateRegistration(input: unknown): RegistrationData {
  return registrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    registrationSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}
import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  age: z.number().int().min(18, 'Must be at least 18 years old').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): {
  success: boolean;
  data?: UserRegistrationData;
  errors?: Record<string, string>;
} {
  const result = userRegistrationSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach(error => {
      const path = error.path.join('.');
      errors[path] = error.message;
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function sanitizeUserData(data: UserRegistrationData): Omit<UserRegistrationData, 'confirmPassword' | 'acceptTerms'> {
  const { confirmPassword, acceptTerms, ...sanitizedData } = data;
  return sanitizedData;
}