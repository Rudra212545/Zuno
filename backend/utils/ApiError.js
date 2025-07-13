class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
      field = null,
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = false;
  
      // Include validation errors (e.g. from express-validator)
      this.errors = errors || [];

  
      // Optionally indicate the field that caused the error (e.g. email, username)
      this.field = field || null;
  
      // Attach the stack trace if provided
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    // Optional: clean format for logging/debugging
    toJSON() {
      return {
        success: this.success,
        message: this.message,
        statusCode: this.statusCode,
        errors: this.errors,
        field: this.field
      };
    }
  }
  
  export { ApiError };
  