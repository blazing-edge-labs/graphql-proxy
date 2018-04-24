const hasha = require('hasha')

function hash (data = {}) {
  return hasha(JSON.stringify(data))
}

module.exports = hash
