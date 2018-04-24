const _ = require('lodash')
const gql = require('graphql/language')

const ignore = _.split(process.env.IGNORE, ',')

function ignored (query, variables) {
  const {definitions} = gql.parse(query)
  const queryName = _.get(_.find(definitions, {
    operation: 'query',
  }), 'name.value')
  return _.includes(ignore, queryName)
}

module.exports = {
  ignored,
}
