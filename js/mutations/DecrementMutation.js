import Relay from 'react-relay'
import CounterMutation from './CounterMutation'

export default class DecrementMutation extends CounterMutation {
  getFatQuery() {
    return Relay.QL`
      fragment on DecrementCounterPayload @relay(pattern: true) {
        counter {
          count,
          id
        }
      }
    `
  }
  getMutation() {
    return Relay.QL`mutation{decrementCounter}`
  }

  getOptimisticResponse() {
    return {
      counter: {
        count: this.props.counter.count - 1
      }
    }
  }
}
