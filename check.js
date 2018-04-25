const _ = require('lodash')
const gql = require('graphql/language')

const ignore = _.split(process.env.IGNORE, ',')

function ignored (query, variables) {
  const {definitions} = gql.parse(query)

  const queryName = _.get(_.find(definitions, {
    operation: 'query',
  }), 'name.value')
  if (_.includes(ignore, queryName)) {
    return true
  }

  const mutationName = _.get(_.find(definitions, {
    operation: 'mutation',
  }), 'name.value')
  if (_.includes(ignore, mutationName)) {
    return true
  }

  return false
}

module.exports = {
  ignored,
}
