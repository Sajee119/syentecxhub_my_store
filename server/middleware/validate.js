export const validate = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    req.body = value;
    next();
  } catch (err) {
    next(err);
  }
};
