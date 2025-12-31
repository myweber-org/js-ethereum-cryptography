import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username cannot exceed 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .endsWith('.com', 'Email must be a .com domain'),
    
    password: passwordSchema,
    
    confirmPassword: z.string(),
    
    birthDate: z.date()
        .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old'),
    
    termsAccepted: z.boolean()
        .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): UserRegistrationData {
    return userRegistrationSchema.parse(data);
}

export function getValidationErrors(data: unknown): string[] {
    try {
        userRegistrationSchema.parse(data);
        return [];
    } catch (error) {
        if (error instanceof z.ZodError) {
            return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        }
        return ['Unknown validation error'];
    }
}import { z } from 'zod';

export const RegistrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  email: z.string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be a .com domain'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

export function validateRegistration(input: unknown): RegistrationData {
  return RegistrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    RegistrationSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}