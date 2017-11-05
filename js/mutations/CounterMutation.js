import Relay from 'react-relay'

export default class CounterMutation extends Relay.Mutation {
  static fragments = {
    counter: () => Relay.QL`
      fragment on User {
        id,
        count
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        counter: this.props.counter.id
      }
    }]
  }
  getVariables() {
    return {
      id: this.props.counter.id
    }
  }
  getCollisionKey() {
    return `counter_${this.props.counter.id}`
  }
}
