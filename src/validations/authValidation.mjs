import { checkSchema, validationResult } from "express-validator";

const loginShema = {
  username: {
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: "Username length must be between 4 and 20 characters",
    },
    trim: true,
  },

  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Password length must be between 8 and 20 characters",
    },
  },
};

export const loginValidation = checkSchema(loginShema);

export const signUpValidation = checkSchema(loginShema);

export const authValidationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
