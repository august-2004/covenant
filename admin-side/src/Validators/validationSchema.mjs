import { body,param } from 'express-validator';
import sanitize from 'mongo-sanitize'; 
import xss from 'xss'; 

export const validateOrder = [
  body()
     .isArray().withMessage("Request must be an array of JSON"),

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

export const validateItem = [
  body()
     .isArray().withMessage("Request must be an array of JSON"),
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
    .notEmpty().withMessage('Meal time cannot be empty.')
  ];

  export const validateLogin = [
    body('userID')
      .isString().withMessage('UserID must be a string.')
      .trim().escape()
      .isLength({ min: 1, max: 30 }).withMessage('UserID is exceeding the limit')
      .custom(value => {
        const sanitizedValue = sanitize(xss(value));  
        if (/[^a-zA-Z0-9@]/.test(sanitizedValue)) {
          throw new Error('UserID must contain only alphanumeric characters and @ symbol');
        }
        return true;
      }),
  
    body('password')
      .isString().withMessage('Password must be a string')
      .trim().escape()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .custom(value => {
        const sanitizedValue = sanitize(xss(value)); 
        if (/[^a-zA-Z0-9@]/.test(sanitizedValue)) {
          throw new Error('Password must contain only alphanumeric characters and @ symbol');
        }
        return true;
      })
  ];

  export const validateOrderID = [
    param('id')  
      .exists().withMessage('OrderID is required') 
      .isString().withMessage('OrderID must be a string') 
      .trim() 
      .isLength({ min: 24, max: 24 }).withMessage('OrderID must be 24 characters long') 
      .isAlphanumeric().withMessage('Order ID must be alphanumeric') 
      .customSanitizer((value) => {
        const sanitizedValue = sanitize(value);
        return xss(sanitizedValue);
      })
  ];
  
