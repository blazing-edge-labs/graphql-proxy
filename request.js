const got = require('got')

function request (body, headers) {
  return got.post(process.env.GRAPHQL_URL, {
    body,
    headers,
    json: true,
    throwHttpErrors: false,
  })
}

module.exports = request
