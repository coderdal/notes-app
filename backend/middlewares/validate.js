const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: property === 'body' ? false : true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

export default validate; 