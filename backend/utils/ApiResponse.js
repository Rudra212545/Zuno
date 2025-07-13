class ApiResponse {
    constructor(statusCode, data = {}, message = "Success") {
      this.statusCode = statusCode;
      this.success = statusCode < 400;
      this.message = message;
      this.data = data;
    }
  
    // Optional: for debugging or logging
    toJSON() {
      return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        data: this.data
      };
    }
  }
  
  export { ApiResponse };
  