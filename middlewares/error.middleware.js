const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;

    console.error(err);

    // Mongoose Bad ObjectID

    if (err.name === "castError") {
      const message = "Resourse not Found";

      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
      const message = "Duplicate Field Value Entered";

      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      Error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};
export default errorMiddleware;
