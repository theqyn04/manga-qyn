// File: src/utils/validationSchemas.js
import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    password: yup
        .string()
        .required('Password is required')
});

export const profileSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    bio: yup
        .string()
        .max(500, 'Bio must not exceed 500 characters')
});