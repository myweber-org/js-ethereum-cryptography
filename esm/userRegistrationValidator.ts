import { z } from 'zod';

export const RegistrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string(),
  age: z.number().int().min(18, 'You must be at least 18 years old').max(120),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

export function validateRegistration(input: unknown): {
  success: boolean;
  data?: RegistrationData;
  errors?: Record<string, string[]>;
} {
  const result = RegistrationSchema.safeParse(input);
  
  if (!result.success) {
    const formattedErrors: Record<string, string[]> = {};
    
    result.error.errors.forEach(error => {
      const path = error.path.join('.');
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(error.message);
    });
    
    return {
      success: false,
      errors: formattedErrors
    };
  }
  
  return {
    success: true,
    data: result.data
  };
}