class ApiResponce{
    constructor(statusCode,data,message="Success"){
        this.statusCode = statusCode
        this.datat = data
        this.message = message
        this.success=statusCode<400

    }
}