module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static validResponse (body) {
    return {
      statusCode: 200,
      body: body
    }
  }
}
