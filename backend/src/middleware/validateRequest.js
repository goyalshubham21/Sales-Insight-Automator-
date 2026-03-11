import Joi from "joi";

const uploadSchema = Joi.object({
  email: Joi.string().email().required()
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
  summary: Joi.string().min(10).required()
});

export const validateUploadBody = (req, res, next) => {
  const { error } = uploadSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      Object.assign(new Error("Invalid upload request"), {
        statusCode: 400,
        details: error.details.map((item) => item.message)
      })
    );
  }

  return next();
};

export const validateEmailBody = (req, res, next) => {
  const { error } = emailSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(
      Object.assign(new Error("Invalid email request"), {
        statusCode: 400,
        details: error.details.map((item) => item.message)
      })
    );
  }

  return next();
};
