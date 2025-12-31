/**
 * ENTERPRISE SECURITY CONFIGURATION
 * Protects against hacking, attacks, and unauthorized access
 */

import { Response } from 'express';

/**
 * Security Headers Configuration
 * Prevents common web vulnerabilities
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent XSS (Cross-Site Scripting) attacks
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com;
    img-src 'self' https: data:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https:;
    frame-ancestors 'none';
  `.replace(/\n/g, ' '),
  
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Feature Policy / Permissions Policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // HTTP Strict Transport Security
  'X-Permitted-Cross-Domain-Policies': 'none',
};

/**
 * Rate Limiting Configuration
 * Prevents brute force attacks and DDoS
 */
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: {
    api: 100, // 100 requests per window
    auth: 5, // 5 requests per window for auth endpoints
    upload: 10, // 10 requests per window for uploads
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

/**
 * CORS Configuration
 * Allows safe cross-origin requests
 */
export const corsConfig = {
  origin: [
    'https://meowshopbd.me',
    'https://meowshopbd.com',
    'https://www.meowshopbd.me',
    'https://www.meowshopbd.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

/**
 * Input Validation Rules
 * Prevents injection attacks
 */
export const inputValidation = {
  maxRequestBodySize: '10mb',
  maxJsonSize: '10mb',
  maxUrlEncodedSize: '10mb',
  
  // SQL Injection Prevention
  sqlInjectionPatterns: [
    /(\bunion\b.*\bselect\b|\bselect\b.*\bfrom\b|\binsert\b.*\binto\b|\bupdate\b.*\bset\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g,
  ],
  
  // XSS Prevention
  xssPatterns: [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
  ],
  
  // Command Injection Prevention
  commandInjectionPatterns: [
    /[;&|`$()]/g,
  ],
};

/**
 * Authentication Security Configuration
 */
export const authSecurity = {
  // Session configuration
  sessionSecret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-this',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  
  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  
  // JWT Token
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-this',
  jwtExpiry: '7d',
  
  // Login attempts
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

/**
 * Database Security Configuration
 */
export const databaseSecurity = {
  // Connection pooling
  poolMin: 2,
  poolMax: 10,
  
  // Query timeout
  queryTimeout: 30000, // 30 seconds
  
  // SSL/TLS for database connections
  ssl: true,
};

/**
 * File Upload Security Configuration
 */
export const fileUploadSecurity = {
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'],
  scanForViruses: true, // Enable antivirus scanning
  uploadDirectory: './uploads/',
  tempDirectory: './temp/',
};

/**
 * Encryption Configuration
 */
export const encryptionConfig = {
  algorithm: 'aes-256-cbc',
  hashAlgorithm: 'sha256',
  saltRounds: 12,
};

/**
 * Monitoring & Logging Configuration
 */
export const monitoringConfig = {
  enableLogging: true,
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: 'combined',
  
  // Sensitive data to redact from logs
  redactPatterns: [
    /password[=:\s]+([^\s,}]+)/gi,
    /token[=:\s]+([^\s,}]+)/gi,
    /secret[=:\s]+([^\s,}]+)/gi,
    /apikey[=:\s]+([^\s,}]+)/gi,
    /creditcard[=:\s]+([^\s,}]+)/gi,
    /cvv[=:\s]+([^\s,}]+)/gi,
  ],
};

/**
 * Set all security headers on response
 */
export function setSecurityHeaders(res: Response) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

/**
 * Validate input against injection patterns
 */
export function validateInput(input: string, type: 'sql' | 'xss' | 'command' = 'xss'): boolean {
  const patterns = inputValidation[`${type}InjectionPatterns`] as RegExp[];
  if (!patterns) return true;
  
  return !patterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[;&|`$()]/g, '') // Remove shell metacharacters
    .trim();
}

/**
 * Hash sensitive data
 */
export function hashPassword(password: string): string {
  const bcrypt = require('bcrypt');
  return bcrypt.hashSync(password, authSecurity.passwordMinLength);
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Check if password meets security requirements
 */
export function isSecurePassword(password: string): boolean {
  if (password.length < authSecurity.passwordMinLength) return false;
  if (authSecurity.passwordRequireUppercase && !/[A-Z]/.test(password)) return false;
  if (authSecurity.passwordRequireNumbers && !/\d/.test(password)) return false;
  if (authSecurity.passwordRequireSpecialChars && !/[!@#$%^&*]/.test(password)) return false;
  return true;
}
