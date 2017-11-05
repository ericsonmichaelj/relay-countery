import Relay from 'react-relay'
import CounterMutation from './CounterMutation'

export default class IncrementMutation extends CounterMutation  {
  getFatQuery() {
    return Relay.QL`
      fragment on IncrementCounterPayload @relay(pattern: true) {
        counter {
          count,
          id
        }
      }
    `
  }
  getMutation() {
    return Relay.QL`mutation{incrementCounter}`
  }
  getOptimisticResponse() {
    return {
      counter: {
        count: this.props.counter.count + 1
      }
    }
  }
}
