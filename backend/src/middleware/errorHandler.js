export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (error, req, res, next) => {
  void next;
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    message,
    details: error.details || undefined
  });
};
