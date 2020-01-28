const apiErrorsCode = {
  400: {
    error: {
      status: '400 BAD REQUEST',
      code: 400
    },
    details: []
  },
  404: {
    error: {
      status: '404 NOT FOUND',
      code: 404
    },
    details: []
  },
  500: {
    error: {
      status: '500 INTERNAL SERVER ERROR',
      code: 500
    },
    details: []
  }
}

class APICustomErrors extends Error {
  constructor (message, status, details) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.details = null || details
    this.obj = apiErrorsCode
  }

  static error (arg) {
    return apiErrorsCode[arg]
  }

  static assign (arg) {
    return Object.assign({}, apiErrorsCode[arg])
  }

  log () {
    if (this.details) this.obj[this.status].details[0] = this.details
    return this.obj[this.status]
  }
}

module.exports = { APICustomErrors }
