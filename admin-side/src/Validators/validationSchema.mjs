import { body } from 'express-validator';
import sanitize from 'mongo-sanitize'; 
import xss from 'xss'; 

export const validateOrder = [
  body()
     .isArray().withMessage("Request must be an array of JSON"),

  body('*.userID')
    .isString().withMessage('User ID must be a string.')
    .trim().escape()
    .isLength({ min: 1, max: 30 }).withMessage('User ID must be between 1 and 30 characters.')
    .custom(value => {
      if (/[^a-zA-Z0-9]/.test(value)) {
        throw new Error('User ID must contain only alphanumeric characters.');
      }
      return true;
    }),

  body('*.itemName')
    .isString().withMessage('Item name must be a string.')
    .trim().escape()
    .isLength({ min: 1, max: 30 }).withMessage('Item name must be between 1 and 30 characters.')
    .custom(value => {
      if (/[^a-zA-Z0-9]/.test(value)) {
        throw new Error('Item name must contain only alphanumeric characters.');
      }
      return true;
    }),

  body('*.mealTime')
    .isIn(['breakfast', 'lunch', 'dinner']).withMessage('Meal time must be one of: breakfast, lunch, dinner.')
    .trim().escape()
    .notEmpty().withMessage('Meal time cannot be empty.'),
    
  body('*.quantity')
    .isInt({ min: 1, max: 10 }).withMessage('Quantity must be an integer between 1 and 10.')
];