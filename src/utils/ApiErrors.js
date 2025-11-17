class ApiErrors extends Error {
  constructor(errors, message) {
    super(message);
    this.errors = errors;
    this.success = false;
    this.data = null;
  }
}

module.exports = { ApiErrors };