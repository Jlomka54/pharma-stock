export function notFoundHandler(req, res, next) {
  return res.status(404).json({
    message: "Route not found",
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const response = {
    message: error.message || "Server error",
  };

  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
}
