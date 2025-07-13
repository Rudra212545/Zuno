import { body } from 'express-validator';

// Validation middleware for user registration
const validateUserRegistration = [

  // ─── Basic Info ────────────────────────────────────────────────
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .toLowerCase(),

  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('displayName')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Display name must be between 1 and 50 characters')
    .escape(),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
    .escape(),

  body('pronouns')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Pronouns cannot exceed 20 characters')
    .escape(),

  body('phoneNumber')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number'),

  body('language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'])
    .withMessage('Invalid language selection'),

  body('timezone')
    .optional()
    .isLength({ min: 1 }).withMessage('Invalid timezone'),

 
];

export { validateUserRegistration };
