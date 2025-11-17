class ApiResponse {
    constructor( message, data){
        this.message = message,
        this.data = data,
        this.success = true
    }
}

module.exports = {ApiResponse}