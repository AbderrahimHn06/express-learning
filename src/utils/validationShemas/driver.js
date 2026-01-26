export const addDriverValidationsSchema = {
  username: {
    notEmpty: {
      errorMessage: "UserName can't be Empty!",
    },
    isString: {
      errorMessage: "Missing username",
    },
  },
  phone: {
    notEmpty: {
      errorMessage: "Phone Can't be Empty",
    },
    isMobilePhone: {
      options: "ar-DZ",
      errorMessage: "Invalid Algerian phone Number",
    },
  },
  city: {
    optional: true,
    isString: {
      errorMessage: "City must be a string",
    },
  },
};
