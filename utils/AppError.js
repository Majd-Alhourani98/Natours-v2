// Define a custom error class called `AppError` that extends the built-in `Error` class.
class AppError extends Error {
  // The constructor method is called when a new instance of `AppError` is created.
  constructor(message, statusCode) {
    // Call the parent class's constructor with the error message.
    super(message);

    // Set the HTTP status code for the error (e.g., 400 for bad request, 500 for server error).
    this.statusCode = statusCode;

    // Determine the status based on the status code. If the status code starts with 4 (client error),
    // set the status to 'fail'. Otherwise, set it to 'error' (e.g., server error).
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';

    // Mark the error as operational, meaning it is expected and should be handled by the application.
    this.isOperational = true;

    // Capture the stack trace for the error, excluding the constructor call from the trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the `AppError` class to make it available for use in other files.
module.exports = AppError;
